// Live open-job counts pulled straight from company ATS boards. Shared by the
// dashboard's /api/jobs route, the per-company profile pages, and the daily
// health check (/api/cron/job-health), so all three use the same boards and
// the same Colorado location rule.
//
// Which board each company uses lives in the DB (companies.ats_type /
// ats_slug / ats_remote_nationwide), not in code: adding a board is a data
// edit like any other company field.

import { and, eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/db";
import { companies } from "@/db/schema";

export interface AtsSource {
  companyId: number;
  name: string;
  companySlug: string;
  type: string;
  slug: string;
  remoteIsNationwide: boolean;
}

export async function getAtsSources(): Promise<AtsSource[]> {
  const rows = await getDb()
    .select({
      companyId: companies.id,
      name: companies.name,
      companySlug: companies.slug,
      type: companies.atsType,
      slug: companies.atsSlug,
      remoteIsNationwide: companies.atsRemoteNationwide,
    })
    .from(companies)
    .where(and(isNotNull(companies.atsType), isNotNull(companies.atsSlug)))
    .orderBy(companies.name);
  return rows.map((r) => ({ ...r, type: r.type!, slug: r.slug! }));
}

// Every fetcher normalizes postings to this shape so one location rule can be
// applied across all ATS platforms.
interface Job {
  title: string;
  locations: string[];
  remote: boolean;
}

export interface JobCount {
  companyId: number;
  name: string;
  companySlug: string;
  count: number;
  allLocations: number;
  // "error" = the board couldn't be read (HTTP failure or an unrecognized
  // response shape), as opposed to "ok" with zero openings. Keeping these
  // distinct is what lets the health check catch a silently broken board.
  status: "ok" | "error";
  error?: string;
}

const COLORADO =
  /\bcolorado\b|,\s*co\b|\bco\s*-\s*us\b|\b(denver|boulder|broomfield|louisville|lafayette|longmont|golden|arvada|aurora|lakewood|littleton|englewood|centennial|thornton|fort collins|loveland|westminster|commerce city|greenwood village|brighton|castle rock|highlands ranch|grand junction|durango|glenwood springs|pueblo|colorado springs|fort lupton|berthoud|erie|superior|wheat ridge|windsor|greeley)\b/i;

// What's left of a remote job's location once generic "remote / US" wording
// is stripped. Empty means the role is open anywhere in the US; anything else
// ("Montana", "Canterbury", "Dublin") means it's tied to a specific region.
function nonUsResidue(location: string): string {
  return location
    .toLowerCase()
    .replace(/\./g, "") // "U.S." -> "us" so the word match below catches it
    .replace(/\b(remote|anywhere|united states( of america)?|usa|us|nationwide|work from home|wfh)\b/g, "")
    .replace(/[\s,;:/|()\-–—.]+/g, "");
}

// A job counts if any of its locations is in Colorado, or it's a fully remote
// role open anywhere in the US.
function isColoradoOrRemoteUS(job: Job): boolean {
  const locs = job.locations.filter(Boolean);
  if (locs.some((l) => COLORADO.test(l))) return true;
  const remote = job.remote || locs.some((l) => /\bremote\b/i.test(l));
  const isUsWide = locs.length === 0 ? job.remote : locs.every((l) => nonUsResidue(l) === "");
  return (remote || locs.some((l) => /^\s*(united states|usa|us)\s*$/i.test(l))) && isUsWide;
}

// Fetchers throw rather than return [] on failure, so a broken board surfaces
// as status "error" instead of looking like a company with no openings.
async function getJson(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, { ...init, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
  return res.json();
}

function expectArray(value: unknown, what: string): any[] {
  if (!Array.isArray(value)) throw new Error(`Unexpected response shape: no ${what} array`);
  return value;
}

async function fetchLever(slug: string): Promise<Job[]> {
  const data = await getJson(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  return expectArray(data, "postings").map((j: any) => ({
    title: j.text ?? "",
    locations: j.categories?.allLocations?.length ? j.categories.allLocations : [j.categories?.location ?? ""],
    remote: j.workplaceType === "remote",
  }));
}

async function fetchGreenhouse(slug: string): Promise<Job[]> {
  const data = await getJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
  return expectArray(data?.jobs, "jobs").map((j: any) => ({
    title: j.title ?? "",
    locations: [j.location?.name ?? ""],
    remote: false,
  }));
}

async function fetchAshby(slug: string): Promise<Job[]> {
  const data = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${slug}`);
  return expectArray(data?.jobs, "jobs").map((j: any) => ({
    title: j.title ?? "",
    locations: [j.location, ...(j.secondaryLocations ?? []).map((s: any) => s.location)].filter(Boolean),
    remote: Boolean(j.isRemote),
  }));
}

async function fetchWorkable(slug: string): Promise<Job[]> {
  const data = await getJson(`https://apply.workable.com/api/v1/widget/accounts/${slug}`);
  return expectArray(data?.jobs, "jobs").map((j: any) => ({
    title: j.title ?? "",
    locations: [[j.city, j.state, j.country].filter(Boolean).join(", ")],
    remote: Boolean(j.telecommuting),
  }));
}

async function fetchJobvite(slug: string): Promise<Job[]> {
  const res = await fetch(`https://jobs.jobvite.com/${slug}/jobs`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from jobs.jobvite.com`);
  const html = await res.text();
  if (!html.includes("jv-job-list")) throw new Error("Unexpected response shape: no Jobvite job list markup");
  const rows = html.match(/<td class="jv-job-list-name">[\s\S]*?<td class="jv-job-list-location">[\s\S]*?<\/td>/g) ?? [];
  const strip = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return rows.map((row) => ({
    title: strip(row.match(/<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? ""),
    locations: [strip(row.split('class="jv-job-list-location">')[1] ?? "")],
    remote: false,
  }));
}

async function fetchRippling(slug: string): Promise<Job[]> {
  const data = await getJson(`https://api.rippling.com/platform/api/ats/v1/board/${slug}/jobs`);
  return expectArray(data, "jobs").map((j: any) => ({
    title: j.name ?? "",
    locations: [j.workLocation?.label ?? ""],
    remote: /remote/i.test(j.workLocation?.label ?? ""),
  }));
}

async function fetchBreezy(slug: string): Promise<Job[]> {
  const data = await getJson(`https://${slug}.breezy.hr/json`);
  return expectArray(data, "jobs").map((j: any) => ({
    title: j.name ?? "",
    locations: [j.location?.name ?? ""],
    remote: Boolean(j.location?.is_remote),
  }));
}

async function fetchPinpoint(slug: string): Promise<Job[]> {
  const data = await getJson(`https://${slug}.pinpointhq.com/postings.json`);
  return expectArray(data?.data, "postings").map((j: any) => ({
    title: j.title ?? "",
    locations: [j.location?.name ?? ""],
    remote: j.workplace_type === "remote",
  }));
}

async function fetchBambooHR(slug: string): Promise<Job[]> {
  const data = await getJson(`https://${slug}.bamboohr.com/careers/list`, {
    headers: { Accept: "application/json" },
  });
  return expectArray(data?.result, "result").map((j: any) => ({
    title: j.jobOpeningName ?? "",
    locations: [[j.location?.city, j.location?.state].filter(Boolean).join(", ")],
    remote: Boolean(j.isRemote),
  }));
}

// Workday has no documented public API, but every myworkdayjobs.com career
// site is backed by this JSON endpoint (the site's own frontend uses it), so
// it could change without notice — the health check will flag it if it does.
// ats_slug format: "{tenant}.wd{N}/{site}", e.g. "itron.wd5/Itron" for
// https://itron.wd5.myworkdayjobs.com/Itron.
async function fetchWorkday(slug: string): Promise<Job[]> {
  const match = slug.match(/^([^.]+)\.(wd\d+)\/(.+)$/);
  if (!match) throw new Error(`Bad Workday ats_slug "${slug}" (expected tenant.wdN/site)`);
  const [, tenant, wd, site] = match;
  const base = `https://${tenant}.${wd}.myworkdayjobs.com/wday/cxs/${tenant}/${site}`;
  const PAGE = 20; // Workday's max page size

  const postings: any[] = [];
  let total = 0; // Workday only reports `total` on the first page (0 after)
  for (let offset = 0; ; offset += PAGE) {
    const data = await getJson(`${base}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ appliedFacets: {}, limit: PAGE, offset, searchText: "" }),
    });
    const page = expectArray(data?.jobPostings, "jobPostings");
    if (offset === 0) total = data.total ?? 0;
    postings.push(...page);
    if (page.length < PAGE || postings.length >= total) break;
  }

  // Multi-location postings only say "N Locations" in the list view; the
  // detail endpoint has the actual primary + additional locations.
  return Promise.all(
    postings.map(async (p: any): Promise<Job> => {
      let locations = [p.locationsText ?? ""];
      if (/^\d+ Locations$/i.test(p.locationsText ?? "")) {
        const detail = await getJson(`${base}${p.externalPath}`, { headers: { Accept: "application/json" } });
        const info = detail?.jobPostingInfo;
        locations = [info?.location, ...(info?.additionalLocations ?? [])].filter(Boolean);
      }
      return { title: p.title ?? "", locations, remote: false };
    })
  );
}

const FETCHERS: Record<string, (slug: string) => Promise<Job[]>> = {
  workday: fetchWorkday,
  lever: fetchLever,
  greenhouse: fetchGreenhouse,
  ashby: fetchAshby,
  workable: fetchWorkable,
  jobvite: fetchJobvite,
  rippling: fetchRippling,
  bamboohr: fetchBambooHR,
  breezy: fetchBreezy,
  pinpoint: fetchPinpoint,
};

async function countSource(source: AtsSource): Promise<JobCount> {
  const base = { companyId: source.companyId, name: source.name, companySlug: source.companySlug };
  const fetcher = FETCHERS[source.type];
  if (!fetcher) return { ...base, count: 0, allLocations: 0, status: "error", error: `Unknown ats_type "${source.type}"` };
  try {
    const jobs = (await fetcher(source.slug)).filter(
      (j) => !j.title.toLowerCase().includes("general application")
    );
    const count = jobs.filter((j) => isColoradoOrRemoteUS(j) || (source.remoteIsNationwide && j.remote)).length;
    return { ...base, count, allLocations: jobs.length, status: "ok" };
  } catch (e) {
    return { ...base, count: 0, allLocations: 0, status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

export async function getJobCounts(): Promise<JobCount[]> {
  return Promise.all((await getAtsSources()).map(countSource));
}

// Returns null when the company has no public ATS board we can count, so the
// profile page can tell "not tracked" apart from "tracked, zero openings".
export async function getCompanyJobCount(companySlug: string): Promise<JobCount | null> {
  const [row] = await getDb()
    .select({
      companyId: companies.id,
      name: companies.name,
      companySlug: companies.slug,
      type: companies.atsType,
      slug: companies.atsSlug,
      remoteIsNationwide: companies.atsRemoteNationwide,
    })
    .from(companies)
    .where(eq(companies.slug, companySlug));
  if (!row?.type || !row.slug) return null;
  return countSource({ ...row, type: row.type, slug: row.slug });
}
