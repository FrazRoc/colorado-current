import { pgTable, serial, text, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  hq: text("hq").notNull(),
  sector: text("sector").notNull(),
  stage: text("stage").notNull(),
  funding: text("funding").notNull(),
  whatTheyDo: text("what_they_do").notNull(),
  interestingAngle: text("interesting_angle").notNull(),
  website: text("website"),
  founded: text("founded"),
  bCorp: text("b_corp"),
  targetCustomer: text("target_customer"),
  lastUpdated: text("last_updated"),
  sources: text("sources"),
  notes: text("notes"),
  jobsUrl: text("jobs_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),
  crunchbaseUrl: text("crunchbase_url"),
  pitchbookUrl: text("pitchbook_url"),
  builtinUrl: text("builtin_url"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
});

// Companies deliberately excluded from the directory during research passes
// (out of scope — general industrial/manufacturing companies swept in by a
// broad "climate, energy & critical minerals" source list, not actual
// clean-energy/climate-tech companies) — recorded so future research doesn't
// re-litigate the same company from scratch.
export const rejectedCompanies = pgTable("rejected_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  reason: text("reason").notNull(),
  sourceUrl: text("source_url"),
  rejectedAt: timestamp("rejected_at").defaultNow().notNull(),
});
