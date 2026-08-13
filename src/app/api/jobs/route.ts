import { NextResponse } from "next/server";

const ATS_SOURCES = [
  // Lever
  { name: "Xcimer Energy",    type: "lever",      slug: "xcimer" },
  { name: "Lightship",        type: "lever",      slug: "lightship" },
  { name: "Zero Homes",       type: "lever",      slug: "zerohomes" },
  { name: "Charm Industrial", type: "lever",      slug: "charmindustrial" },
  { name: "Perennial",        type: "lever",      slug: "perennial" },
  // Greenhouse
  { name: "Solid Power",      type: "greenhouse", slug: "solidpower" },
  { name: "Electra",          type: "greenhouse", slug: "electrasteel" },
  { name: "Arcadia",          type: "greenhouse", slug: "arcadiacareers" },
  { name: "Wunder",           type: "greenhouse", slug: "wundercapital" },
  { name: "Emporia",          type: "greenhouse", slug: "emporiarevolutionizinghomeenergy" },
  { name: "Outrider",         type: "greenhouse", slug: "outrider" },
  { name: "Flatiron Energy",  type: "greenhouse", slug: "flatironenergy" },
  // Ashby
  { name: "Crusoe Energy",    type: "ashby",      slug: "Crusoe" },
  // Workable
  { name: "Scout Clean Energy", type: "workable", slug: "scout-clean-energy" },
  { name: "Korsail Energy",   type: "workable",   slug: "korsail-energy-1" },
  { name: "Nautilus Solar",   type: "workable",   slug: "nautilus-solar-energy" },
  { name: "SolRiver Capital", type: "workable",   slug: "solriver-capital" },
  // Jobvite
  { name: "Uplight",          type: "jobvite",    slug: "uplight" },
  // Rippling
  { name: "AtmosZero",        type: "rippling",   slug: "atmoszero-careers" },
];

async function fetchLever(slug: string): Promise<number> {
  const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return Array.isArray(data)
    ? data.filter((j: any) => !j.text?.toLowerCase().includes("general application")).length
    : 0;
}

async function fetchGreenhouse(slug: string): Promise<number> {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.jobs?.length ?? 0;
}

async function fetchAshby(slug: string): Promise<number> {
  const res = await fetch(
    `https://jobs.ashbyhq.com/api/non-user-facing/job-board/listing?organizationHostedJobsPageName=${slug}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.jobPostings?.length ?? 0;
}

async function fetchWorkable(slug: string): Promise<number> {
  const res = await fetch(
    `https://apply.workable.com/api/v3/accounts/${slug}/jobs?details=false`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.results?.length ?? 0;
}

async function fetchJobvite(slug: string): Promise<number> {
  const res = await fetch(`https://jobs.jobvite.com/${slug}/jobs`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return 0;
  const html = await res.text();
  const matches = html.match(/jobs\.jobvite\.com\/.+?\/job\//g);
  return matches ? new Set(matches).size : 0;
}

async function fetchRippling(slug: string): Promise<number> {
  const res = await fetch(`https://ats.rippling.com/${slug}/jobs`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return 0;
  const html = await res.text();
  const matches = html.match(/\/jobs\/\d+/g);
  return matches ? new Set(matches).size : 0;
}

export async function GET() {
  const results = await Promise.allSettled(
    ATS_SOURCES.map(async (source) => {
      let count = 0;
      try {
        if (source.type === "lever")          count = await fetchLever(source.slug);
        else if (source.type === "greenhouse") count = await fetchGreenhouse(source.slug);
        else if (source.type === "ashby")      count = await fetchAshby(source.slug);
        else if (source.type === "workable")   count = await fetchWorkable(source.slug);
        else if (source.type === "jobvite")    count = await fetchJobvite(source.slug);
        else if (source.type === "rippling")   count = await fetchRippling(source.slug);
      } catch { count = 0; }
      return { name: source.name, count };
    })
  );

  const companies = results.map((r, i) => ({
    name: ATS_SOURCES[i].name,
    count: r.status === "fulfilled" ? r.value.count : 0,
  }));

  const total = companies.reduce((sum, c) => sum + c.count, 0);

  return NextResponse.json({
    total,
    companies: companies.filter(c => c.count > 0),
    updatedAt: new Date().toISOString(),
    sources: ATS_SOURCES.length,
  });
}
