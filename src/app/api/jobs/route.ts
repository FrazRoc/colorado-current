import { NextResponse } from "next/server";

// `remoteIsNationwide`: set for boards that attach an HQ city to fully remote
// roles, so remote-flagged jobs count even though a non-Colorado city is listed.
const ATS_SOURCES: { name: string; type: string; slug: string; remoteIsNationwide?: boolean }[] = [
  // Lever
  { name: "Xcimer Energy",         type: "lever",      slug: "xcimer" },
  { name: "Lightship",             type: "lever",      slug: "lightship" },
  { name: "Zero Homes",            type: "lever",      slug: "zerohomes" },
  { name: "Charm Industrial",      type: "lever",      slug: "charmindustrial" },
  { name: "Perennial",             type: "lever",      slug: "perennial" },
  { name: "Travertine Technologies", type: "lever",    slug: "travertine" },
  { name: "Pivot Energy",          type: "lever",      slug: "pivotenergy" },

  // Greenhouse
  { name: "Solid Power",           type: "greenhouse", slug: "solidpower" },
  { name: "Electra",               type: "greenhouse", slug: "electrasteel" },
  { name: "Wunder",                type: "greenhouse", slug: "wundercapital" },
  { name: "Emporia",               type: "greenhouse", slug: "emporiarevolutionizinghomeenergy" },
  { name: "Outrider",              type: "greenhouse", slug: "outrider" },
  { name: "Flatiron Energy",       type: "greenhouse", slug: "flatironenergy" },
  { name: "AMP Robotics",          type: "greenhouse", slug: "ampsortation" },
  { name: "Marvel Fusion",         type: "greenhouse", slug: "marvelfusion" },
  { name: "Jetson Home",           type: "greenhouse", slug: "jetsonhome" },
  { name: "Yes Energy",            type: "greenhouse", slug: "yesenergy" },
  { name: "Peak Energy",           type: "greenhouse", slug: "peakenergy" },
  { name: "Alta Resource Technologies", type: "greenhouse", slug: "altaresourcetechnologiesinc" },
  { name: "Nira Energy",           type: "greenhouse", slug: "niraenergy" },
  { name: "Fervo Energy",          type: "greenhouse", slug: "fervoenergy" },

  // Ashby
  { name: "Crusoe Energy",         type: "ashby",      slug: "Crusoe" },
  { name: "Halter",                type: "ashby",      slug: "halter" },
  { name: "H3X Technologies",      type: "ashby",      slug: "h3x-technologies" },
  // Lists every remote role as "San Francisco (Remote)"; the city is just HQ
  { name: "WeaveGrid",             type: "ashby",      slug: "weave-grid", remoteIsNationwide: true },

  // Workable
  { name: "Scout Clean Energy",    type: "workable",   slug: "scout-clean-energy" },
  { name: "Korsail Energy",        type: "workable",   slug: "korsail-energy-1" },
  { name: "Nautilus Solar",        type: "workable",   slug: "nautilus-solar-energy" },
  { name: "SolRiver Capital",      type: "workable",   slug: "solriver-capital" },
  { name: "Cloudbreak Energy",     type: "workable",   slug: "cloudbreakenergy" },

  // Breezy
  { name: "Forge Nano",            type: "breezy",     slug: "forge-nano" },

  // Pinpoint
  { name: "Project Canary",        type: "pinpoint",   slug: "projectcanary" },

  // Jobvite
  { name: "Uplight",               type: "jobvite",    slug: "uplight" },

  // Rippling
  { name: "AtmosZero",             type: "rippling",   slug: "atmoszero-careers" },
  { name: "Gevo",                  type: "rippling",   slug: "gevo-careers" },

  // BambooHR
  { name: "Ascend Analytics",      type: "bamboohr",   slug: "ascendanalytics" },
  { name: "GridX",                 type: "bamboohr",   slug: "gridx" },
];

// Every fetcher normalizes postings to this shape so one location rule can be
// applied across all ATS platforms.
interface Job {
  title: string;
  locations: string[];
  remote: boolean;
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

// A job counts toward the dashboard if any of its locations is in Colorado,
// or it's a fully remote role open anywhere in the US.
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

export async function GET() {
  const results = await Promise.allSettled(
    ATS_SOURCES.map(async (source) => {
      const jobs = (await FETCHERS[source.type](source.slug)).filter(
        (j) => !j.title.toLowerCase().includes("general application")
      );
      const counted = jobs.filter(
        (j) => isColoradoOrRemoteUS(j) || (source.remoteIsNationwide && j.remote)
      );
      return { all: jobs.length, count: counted.length };
    })
  );

  const companies = results.map((r, i) => ({
    name: ATS_SOURCES[i].name,
    count: r.status === "fulfilled" ? r.value.count : 0,
    allLocations: r.status === "fulfilled" ? r.value.all : 0,
  }));

  const total = companies.reduce((sum, c) => sum + c.count, 0);
  const totalAllLocations = companies.reduce((sum, c) => sum + c.allLocations, 0);

  return NextResponse.json({
    total,
    totalAllLocations,
    companies: companies.filter((c) => c.allLocations > 0),
    updatedAt: new Date().toISOString(),
    sources: ATS_SOURCES.length,
  });
}
