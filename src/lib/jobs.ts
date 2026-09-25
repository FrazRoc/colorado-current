// Live open-job counts pulled straight from company ATS boards. Shared by the
// dashboard's /api/jobs route and the per-company profile pages, so both use
// the same source list and the same Colorado location rule.

// `companySlug` is the company's stored `slug` in the DB (not derived from
// `name`, which is just the display label in the /api/jobs response).
// `remoteIsNationwide`: set for boards that attach an HQ city to fully remote
// roles, so remote-flagged jobs count even though a non-Colorado city is listed.
interface AtsSource {
  name: string;
  companySlug: string;
  type: string;
  slug: string;
  remoteIsNationwide?: boolean;
}

export const ATS_SOURCES: AtsSource[] = [
  // Lever
  { name: "Xcimer Energy",         companySlug: "xcimer-energy",          type: "lever",      slug: "xcimer" },
  { name: "Lightship",             companySlug: "lightship",              type: "lever",      slug: "lightship" },
  { name: "Zero Homes",            companySlug: "zero-homes",             type: "lever",      slug: "zerohomes" },
  { name: "Charm Industrial",      companySlug: "charm-industrial",       type: "lever",      slug: "charmindustrial" },
  { name: "Perennial",             companySlug: "perennial",              type: "lever",      slug: "perennial" },
  { name: "Travertine Technologies", companySlug: "travertine-technologies", type: "lever",   slug: "travertine" },
  { name: "Pivot Energy",          companySlug: "pivot-energy",           type: "lever",      slug: "pivotenergy" },

  // Greenhouse
  { name: "Solid Power",           companySlug: "solid-power",            type: "greenhouse", slug: "solidpower" },
  { name: "Electra",               companySlug: "electra",                type: "greenhouse", slug: "electrasteel" },
  { name: "Wunder",                companySlug: "wunder",                 type: "greenhouse", slug: "wundercapital" },
  { name: "Emporia",               companySlug: "emporia",                type: "greenhouse", slug: "emporiarevolutionizinghomeenergy" },
  { name: "Outrider",              companySlug: "outrider",               type: "greenhouse", slug: "outrider" },
  { name: "Flatiron Energy",       companySlug: "flatiron-energy",        type: "greenhouse", slug: "flatironenergy" },
  { name: "AMP Robotics",          companySlug: "amp-robotics",           type: "greenhouse", slug: "ampsortation" },
  { name: "Marvel Fusion",         companySlug: "marvel-fusion",          type: "greenhouse", slug: "marvelfusion" },
  { name: "Jetson Home",           companySlug: "jetson-home",            type: "greenhouse", slug: "jetsonhome" },
  { name: "Yes Energy",            companySlug: "yes-energy",             type: "greenhouse", slug: "yesenergy" },
  { name: "Peak Energy",           companySlug: "peak-energy",            type: "greenhouse", slug: "peakenergy" },
  { name: "Alta Resource Technologies", companySlug: "alta-resource-technologies", type: "greenhouse", slug: "altaresourcetechnologiesinc" },
  { name: "Nira Energy",           companySlug: "nira-energy",            type: "greenhouse", slug: "niraenergy" },
  { name: "Fervo Energy",          companySlug: "fervo-energy",           type: "greenhouse", slug: "fervoenergy" },

  // Ashby
  { name: "Crusoe Energy",         companySlug: "crusoe-energy-systems",  type: "ashby",      slug: "Crusoe" },
  { name: "Halter",                companySlug: "halter",                 type: "ashby",      slug: "halter" },
  { name: "H3X Technologies",      companySlug: "h3x-technologies",       type: "ashby",      slug: "h3x-technologies" },
  // Lists every remote role as "San Francisco (Remote)"; the city is just HQ
  { name: "WeaveGrid",             companySlug: "weavegrid",              type: "ashby",      slug: "weave-grid", remoteIsNationwide: true },

  // Workable
  { name: "Scout Clean Energy",    companySlug: "scout-clean-energy",     type: "workable",   slug: "scout-clean-energy" },
  { name: "Korsail Energy",        companySlug: "korsail-energy",         type: "workable",   slug: "korsail-energy-1" },
  { name: "Nautilus Solar",        companySlug: "nautilus-solar-energy",  type: "workable",   slug: "nautilus-solar-energy" },
  { name: "SolRiver Capital",      companySlug: "solriver-capital",       type: "workable",   slug: "solriver-capital" },
  { name: "Cloudbreak Energy",     companySlug: "cloudbreak-energy",      type: "workable",   slug: "cloudbreakenergy" },

  // Breezy
  { name: "Forge Nano",            companySlug: "forge-nano",             type: "breezy",     slug: "forge-nano" },

  // Pinpoint
  { name: "Project Canary",        companySlug: "project-canary",         type: "pinpoint",   slug: "projectcanary" },

  // Jobvite
  { name: "Uplight",               companySlug: "uplight",                type: "jobvite",    slug: "uplight" },

  // Rippling
  { name: "AtmosZero",             companySlug: "atmoszero",              type: "rippling",   slug: "atmoszero-careers" },
  { name: "Gevo",                  companySlug: "gevo",                   type: "rippling",   slug: "gevo-careers" },

  // BambooHR
  { name: "Ascend Analytics",      companySlug: "ascend-analytics",       type: "bamboohr",   slug: "ascendanalytics" },
  { name: "GridX",                 companySlug: "gridx",                  type: "bamboohr",   slug: "gridx" },
];

// Every fetcher normalizes postings to this shape so one location rule can be
// applied across all ATS platforms.
interface Job {
  title: string;
  locations: string[];
  remote: boolean;
}

export interface JobCount {
  name: string;
  companySlug: string;
  count: number;
  allLocations: number;
}

const COLORADO =
  /\bcolorado\b|,\s*co\b|\bco\s*-\s*us\b|\b(denver|boulder|broomfield|louisville|lafayette|longmont|golden|arvada|aurora|lakewood|littleton|englewood|centennial|thornton|fort collins|loveland|westminster|commerce city|greenwood village|brighton|castle rock|highlands ranch|grand junction|durango|glenwood springs|pueblo|colorado springs|fort lupton|berthoud|erie|superior|wheat ridge|windsor|greeley)\b/i;

// What's left of a remote job's location once generic "remote / US" wording
// is stripped. Empty means the role is open anywhere in the US; anything else
// ("Montana", "Canterbury", "Dublin") means it's tied to a specific region.
function nonUsResidue(location: string): string {
  return location
    .toLowerCase()
    .replace(/\b(remote|anywhere|united states( of america)?|usa|u\.s\.a?\.?|us|nationwide|work from home|wfh)\b/g, "")
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

async function getJson(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, { ...init, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

async function fetchLever(slug: string): Promise<Job[]> {
  const data = await getJson(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  return (Array.isArray(data) ? data : []).map((j: any) => ({
    title: j.text ?? "",
    locations: j.categories?.allLocations?.length ? j.categories.allLocations : [j.categories?.location ?? ""],
    remote: j.workplaceType === "remote",
  }));
}

async function fetchGreenhouse(slug: string): Promise<Job[]> {
  const data = await getJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
  return (data?.jobs ?? []).map((j: any) => ({
    title: j.title ?? "",
    locations: [j.location?.name ?? ""],
    remote: false,
  }));
}

async function fetchAshby(slug: string): Promise<Job[]> {
  const data = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${slug}`);
  return (data?.jobs ?? []).map((j: any) => ({
    title: j.title ?? "",
    locations: [j.location, ...(j.secondaryLocations ?? []).map((s: any) => s.location)].filter(Boolean),
    remote: Boolean(j.isRemote),
  }));
}

async function fetchWorkable(slug: string): Promise<Job[]> {
  const data = await getJson(`https://apply.workable.com/api/v1/widget/accounts/${slug}`);
  return (data?.jobs ?? []).map((j: any) => ({
    title: j.title ?? "",
    locations: [[j.city, j.state, j.country].filter(Boolean).join(", ")],
    remote: Boolean(j.telecommuting),
  }));
}

async function fetchJobvite(slug: string): Promise<Job[]> {
  const res = await fetch(`https://jobs.jobvite.com/${slug}/jobs`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const html = await res.text();
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
  return (Array.isArray(data) ? data : []).map((j: any) => ({
    title: j.name ?? "",
    locations: [j.workLocation?.label ?? ""],
    remote: /remote/i.test(j.workLocation?.label ?? ""),
  }));
}

async function fetchBreezy(slug: string): Promise<Job[]> {
  const data = await getJson(`https://${slug}.breezy.hr/json`);
  return (Array.isArray(data) ? data : []).map((j: any) => ({
    title: j.name ?? "",
    locations: [j.location?.name ?? ""],
    remote: Boolean(j.location?.is_remote),
  }));
}

async function fetchPinpoint(slug: string): Promise<Job[]> {
  const data = await getJson(`https://${slug}.pinpointhq.com/postings.json`);
  return (data?.data ?? []).map((j: any) => ({
    title: j.title ?? "",
    locations: [j.location?.name ?? ""],
    remote: j.workplace_type === "remote",
  }));
}

async function fetchBambooHR(slug: string): Promise<Job[]> {
  const data = await getJson(`https://${slug}.bamboohr.com/careers/list`, {
    headers: { Accept: "application/json" },
  });
  return (data?.result ?? []).map((j: any) => ({
    title: j.jobOpeningName ?? "",
    locations: [[j.location?.city, j.location?.state].filter(Boolean).join(", ")],
    remote: Boolean(j.isRemote),
  }));
}

const FETCHERS: Record<string, (slug: string) => Promise<Job[]>> = {
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
  let count = 0;
  let allLocations = 0;
  try {
    const jobs = (await FETCHERS[source.type](source.slug)).filter(
      (j) => !j.title.toLowerCase().includes("general application")
    );
    allLocations = jobs.length;
    count = jobs.filter((j) => isColoradoOrRemoteUS(j) || (source.remoteIsNationwide && j.remote)).length;
  } catch {
    // Fetchers fail soft: a broken board counts as 0 rather than breaking the page
  }
  return { name: source.name, companySlug: source.companySlug, count, allLocations };
}

export async function getJobCounts(): Promise<JobCount[]> {
  return Promise.all(ATS_SOURCES.map(countSource));
}

// Returns null when the company has no public ATS board we can count, so the
// profile page can tell "not tracked" apart from "tracked, zero openings".
export async function getCompanyJobCount(companySlug: string): Promise<JobCount | null> {
  const source = ATS_SOURCES.find((s) => s.companySlug === companySlug);
  return source ? countSource(source) : null;
}
