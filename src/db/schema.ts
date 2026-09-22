import { pgTable, serial, integer, text, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";

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
  blueskyUrl: text("bluesky_url"),
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

// Canonical person record, independent of any company affiliation — a
// person can have zero, one, or many rows in peopleRoles below.
export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  websiteUrl: text("website_url"),
  bio: text("bio"),
  notes: text("notes"),
  lastUpdated: text("last_updated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Many-to-many join between people and companies, with attributes — this is
// what makes "who sits on multiple boards" or "where did this person work
// before" queryable, instead of a single company_id on people forcing one
// affiliation at a time.
export const peopleRoles = pgTable("people_roles", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => people.id),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  roleType: text("role_type").notNull(), // "executive" | "board" | "founder"
  isCurrent: boolean("is_current").notNull().default(true),
  startDate: text("start_date"),
  endDate: text("end_date"),
  sourceUrl: text("source_url"),
  lastUpdated: text("last_updated"),
});
