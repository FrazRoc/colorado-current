import { eq, ne, and } from "drizzle-orm";
import { getDb } from "@/db";
import { companies as companiesTable } from "@/db/schema";
import type { Company } from "@/types";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCompany(row: typeof companiesTable.$inferSelect): Company {
  return {
    id: row.id,
    name: row.name,
    hq: row.hq,
    sector: row.sector as Company["sector"],
    stage: row.stage as Company["stage"],
    funding: row.funding,
    what_they_do: row.whatTheyDo,
    interesting_angle: row.interestingAngle,
    website: row.website ?? undefined,
    founded: row.founded ?? undefined,
    b_corp: row.bCorp ?? undefined,
    target_customer: row.targetCustomer ?? undefined,
    last_updated: row.lastUpdated ?? undefined,
    sources: row.sources ?? undefined,
    notes: row.notes ?? undefined,
    jobs_url: row.jobsUrl ?? undefined,
    linkedin_url: row.linkedinUrl ?? undefined,
    twitter_url: row.twitterUrl ?? undefined,
    bluesky_url: row.blueskyUrl ?? undefined,
    facebook_url: row.facebookUrl ?? undefined,
    instagram_url: row.instagramUrl ?? undefined,
    youtube_url: row.youtubeUrl ?? undefined,
    crunchbase_url: row.crunchbaseUrl ?? undefined,
    pitchbook_url: row.pitchbookUrl ?? undefined,
    builtin_url: row.builtinUrl ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
  };
}

export async function getCompanies(): Promise<Company[]> {
  const rows = await getDb().select().from(companiesTable);
  return rows.map(toCompany);
}

export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  const rows = await getDb().select().from(companiesTable).where(eq(companiesTable.slug, slug)).limit(1);
  return rows[0] ? toCompany(rows[0]) : undefined;
}

export async function getRelatedCompanies(company: Company, limit = 3): Promise<Company[]> {
  const rows = await getDb()
    .select()
    .from(companiesTable)
    .where(and(eq(companiesTable.sector, company.sector), ne(companiesTable.name, company.name)))
    .limit(limit);
  return rows.map(toCompany);
}
