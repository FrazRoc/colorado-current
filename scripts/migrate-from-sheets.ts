import { fetchCompanies } from "../src/lib/sheets";
import { slugify } from "../src/lib/companies";
import { getDb } from "../src/db";
import { companies } from "../src/db/schema";

async function main() {
  const sheetCompanies = await fetchCompanies();
  if (sheetCompanies.length === 0) {
    console.error("No companies fetched from the sheet — aborting migration.");
    process.exit(1);
  }

  const seenSlugs = new Map<string, number>();

  const rows = sheetCompanies.map((c) => {
    const base = slugify(c.name);
    const count = seenSlugs.get(base) ?? 0;
    seenSlugs.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;

    return {
      slug,
      name: c.name,
      hq: c.hq,
      sector: c.sector,
      stage: c.stage,
      funding: c.funding,
      whatTheyDo: c.what_they_do,
      interestingAngle: c.interesting_angle,
      website: c.website || null,
      founded: c.founded || null,
      bCorp: c.b_corp || null,
      targetCustomer: c.target_customer || null,
      lastUpdated: c.last_updated || null,
      sources: c.sources || null,
      notes: c.notes || null,
      jobsUrl: c.jobs_url || null,
      linkedinUrl: c.linkedin_url || null,
      twitterUrl: c.twitter_url || null,
      facebookUrl: c.facebook_url || null,
      instagramUrl: c.instagram_url || null,
      youtubeUrl: c.youtube_url || null,
      crunchbaseUrl: c.crunchbase_url || null,
      pitchbookUrl: c.pitchbook_url || null,
      builtinUrl: c.builtin_url || null,
      lat: c.lat ?? null,
      lng: c.lng ?? null,
    };
  });

  const db = getDb();
  await db.insert(companies).values(rows);

  console.log(`Inserted ${rows.length} companies into Postgres.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
