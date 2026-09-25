# Colorado Current — Project Guide for Claude Code

## What this is

Colorado Current (coloradocurrent.com) is an independent publication tracking
Colorado's clean energy and climate tech ecosystem — companies, capital, and
policy. Built and run by Evan Frasz as both a genuine editorial project and a
networking/job-search tool targeting Director-level product roles in clean
energy.

The site has two halves:
1. A live **dashboard** (homepage) — company directory stats, funding ticker,
   emissions charts, sector breakdown, an interactive HQ map, and a live open
   jobs count pulled from company ATS platforms.
2. A **blog** — long-form MDX posts with inline citations, mostly deep-dive
   policy/data analysis in Evan's voice (see Writing Style below).

## Tech stack

- Next.js 16 (App Router), Tailwind CSS v4, MDX, Vercel hosting
- Data layer: the company directory lives in Neon Postgres (provisioned via the
  Vercel Marketplace), queried with Drizzle ORM (`drizzle-orm` +
  `@neondatabase/serverless`, `neon-http` driver). Migrated off a Google Sheets
  CSV in Sep 2026 — see "Company directory data" below.
- Charts: Chart.js (loaded dynamically client-side, `"use client"` components)
- Map: Leaflet with Esri's free World_Light_Gray_Base tiles (switched from
  CartoDB's light_all raster tiles in Sep 2026 after Carto started requiring
  an API key on that service and announced it's being retired in favor of
  vector basemaps — Esri's tiles need no key/signup and are a close visual
  match)
- MDX rendering: `next-mdx-remote/rsc`
- Deployment: push to `main` → Vercel auto-deploys

## Key files and structure

```
src/
  app/
    page.tsx                    — homepage / dashboard (server component)
    companies/page.tsx          — full company directory table
    blog/page.tsx                — blog index
    blog/[slug]/page.tsx         — individual post renderer (MDX + citations)
    blog/[slug]/opengraph-image.tsx — per-post OG image generator (next/og)
    api/jobs/route.ts           — live ATS job count aggregator (thin wrapper
                                   over src/lib/jobs.ts; response cached 1h)
    sitemap.ts, robots.ts       — auto-generated SEO files
  components/
    dashboard/                  — SectorChart, PolicyPanel, EmissionsPanel,
                                   MapPanel, CompanyMap, SectorEmissionsPanel,
                                   FundingTicker, JobsMetric, SourceLinks.
                                   MetricsRow.tsx, StatPanel.tsx, and
                                   HeatPumpPanel.tsx were removed Aug 2026 —
                                   all three were dead (unimported), and had
                                   silently orphaned two live features along
                                   the way: MetricsRow used to render a
                                   citation footer under the funding/coal
                                   metrics (restored inline in page.tsx —
                                   ecosystem funding's footer is back; the
                                   coal metric itself was retired instead per
                                   product decision, along with
                                   sources.coal — EmissionsPanel's own
                                   separately-hardcoded "Coal generation
                                   24.7%" warning line is intentionally
                                   unrelated and was kept), and
                                   StatPanel/HeatPumpPanel rendered a VPP
                                   progress + heat pump rebates panel that
                                   hadn't appeared on the homepage in a while
                                   — retired outright (vppMw/vppGoal/
                                   heatPumpRebates and sources.vpp/heatPumps
                                   removed from dashboard.ts and the
                                   DashboardData type). Lesson: an orphaned
                                   component can mean its DATA silently
                                   stopped being cited/shown — check what a
                                   "dead" component used to render before
                                   deleting, not just whether it's imported.
                                   FundingTicker.tsx owns its own hand-curated
                                   `deals` array (amount/type/date per round —
                                   the Sheet only has each company's current
                                   cumulative funding as free text, not
                                   itemized deal history, so this can't be
                                   sheet-derived) but takes `companies` as a
                                   prop to color each deal's dot via
                                   getSectorColor(), so at least the sector
                                   half is live instead of hand-typed.
    directory/CompanyTable.tsx  — filterable/sortable table, auto-expands via
                                   ?company= query param (used by map dots and
                                   funding ticker click-throughs)
    blog/PostCard.tsx           — blog card with optional image, colored left
                                   border by post type
    layout/Nav.tsx, Footer.tsx
  data/dashboard.ts             — dashboard metrics, legislation list (NOT
                                   company data or sector counts — both are
                                   computed live from Sheets, see below; also
                                   NOT funding deals, see FundingTicker below)
  lib/
    companies.ts                 — queries the `companies` table via Drizzle
                                   (getCompanies, getCompanyBySlug,
                                   getRelatedCompanies) and maps rows to the
                                   Company type; also owns slugify() (this is
                                   where new DB columns need corresponding
                                   field mapping added if the schema changes)
    posts.ts                    — reads MDX frontmatter + content from
                                   src/content/posts/
    sectors.ts                  — SINGLE SOURCE OF TRUTH for sector color:
                                   SECTOR_COLORS is the only place a sector's
                                   hex color is defined. getSectorColor()
                                   (chart bars / map markers, used in
                                   SectorChart/CompanyMap/MapPanel) and
                                   getSectorStyle() (badge bg/text, used in
                                   the company table + blog) both derive from
                                   it — getSectorStyle mixes the canonical hex
                                   toward white (bg/placeholder) and black
                                   (text) rather than using a second
                                   hand-authored palette. Add new sectors to
                                   SECTOR_COLORS only; the badge colors follow
                                   automatically. (This used to be two
                                   independently-authored maps that drifted
                                   twice: once when SECTOR_STYLES simply
                                   lacked 7 of 15 live sectors, falling back
                                   to gray on /companies, and again when
                                   sectors present in both maps had been given
                                   different hues — e.g. Solar & Storage was
                                   orange on the dashboard and green on
                                   /companies. Both classes of bug are
                                   structurally impossible now since there's
                                   only one color to author per sector.)
                                   Sector labels with no chart/map analog
                                   (blog post types like "Deep dive") still
                                   use their own small NON_SECTOR_STYLES map
                                   in the same file — falls back to gray for
                                   anything in neither.
  content/posts/*.mdx           — blog post source files
  types/index.ts                — Company, Post, DashboardData, etc. The
                                   `Sector` union is meant to list every valid
                                   sector value — it drifted stale (was
                                   missing 5 of the live Sheet's 15 sectors as
                                   of Aug 2026, silently harmless only because
                                   `sheets.ts` casts through it rather than
                                   validating). Fixed, but nothing enforces
                                   it stays in sync — if `/companies` ever
                                   shows an ungraceful sector, check this
                                   union against the live Sheet first.

public/images/                  — blog post images (screenshots of charts, etc.)
```

## Company directory data (Neon Postgres)

- Migrated off a Google Sheets CSV in Sep 2026. The Drive MCP tools Claude
  Code had connected (`mcp__claude_ai_Google_Drive__*`) only support
  whole-file operations (create/copy/rename/move/share/trash) — there is no
  Sheets-API cell/row write call (`values.update`/`batchUpdate`), so Claude
  Code could read the Sheet directly but never edit it in place. Rather than
  set up a separate Sheets OAuth connector just to unblock row edits, Evan
  moved the directory to a real database, which also gives the site actual
  relational tables to grow into instead of a flat CSV.
- Single `companies` table, schema defined in `src/db/schema.ts` via Drizzle
  (`pgTable`). Columns mirror the old Sheet columns 1:1 (see
  `src/lib/companies.ts`'s `toCompany()` mapper for the exact field mapping),
  plus a stored `slug` column (unique, computed once at insert time from
  `slugify(name)` — the profile page route no longer re-derives the slug from
  `name` on every request the way the old in-memory `getCompanyBySlug` did).
- DB client: `src/db/index.ts` exports `getDb()`, a lazily-initialized
  Drizzle client over `@neondatabase/serverless`'s `neon-http` driver. It's
  lazy (not a top-level `neon()` call) so `next build` doesn't crash before
  `DATABASE_URL` exists, and it's a plain function (not a `Proxy` wrapper)
  since Proxies break library introspection in some contexts.
- Query layer: `src/lib/companies.ts` — `getCompanies()`, `getCompanyBySlug(slug)`,
  `getRelatedCompanies(company, limit)` — all return/consume the same `Company`
  type from `src/types/index.ts` as before, so no consumer-side type changes
  were needed. `slugify()` also lives here and is still used at render time
  for building `/companies/[slug]` links throughout the app (CompanyTable,
  CompanyMap, FundingTicker, sitemap) — it stays consistent with the stored
  `slug` column because the backfill script used the same function.
- **Editing data going forward**: no admin UI — ask Claude Code to add/update
  a company and it writes directly via a script against the DB (Drizzle +
  the Neon serverless driver), the same conversational flow as the old
  "paste this row into the Sheet" workflow, except it actually executes.
- Env var: `DATABASE_URL` (plus several other `PG*`/`POSTGRES_*`/`NEON_*` vars),
  auto-provisioned into Vercel's Production/Preview/Development environments
  by the Neon Marketplace integration. **New-machine setup**: `vercel link`
  then `vercel env pull .env.local`. Drizzle Kit and any one-off script run
  via `tsx` do **not** auto-load `.env.local` (only Next.js does) — run them
  as `npx dotenv -e .env.local -- npx drizzle-kit <cmd>` /
  `npx dotenv -e .env.local -- npx tsx <script>`.
- Schema changes: edit `src/db/schema.ts`, then
  `npx dotenv -e .env.local -- npx drizzle-kit generate` (writes a migration
  file under `drizzle/`) and `... drizzle-kit push` (applies it to Neon) —
  any new column also needs a matching field added to the `Company` type
  (`src/types/index.ts`) and to the `toCompany()`/insert mapping in
  `src/lib/companies.ts`.
- The one-time backfill script that populated the table from the live Sheet
  (98 companies, Sep 2026) has been removed now that the migration is
  confirmed live in production — the CSV fetch logic it depended on
  (`src/lib/sheets.ts`) is gone too. Both are recoverable from git history
  (see the "Migrate company directory from Google Sheets to Neon Postgres"
  commit) if a re-import from a spreadsheet is ever needed again.
- **Not migrated / explicitly out of scope**: `FundingTicker.tsx` still owns
  its own hand-curated `deals` array (amount/type/date per funding round —
  the old Sheet only ever had each company's current cumulative funding as
  free text, not itemized deal history, and that didn't change with the DB
  move) — it still takes `companies` as a prop only to color each deal's dot
  via `getSectorColor()`. `src/data/dashboard.ts` (hand-maintained metrics/
  legislation) and `src/app/api/jobs/route.ts` (independent hardcoded
  `ATS_SOURCES` list) were never sourced from the Sheet and remain untouched.
- **Dedup gotcha**: when checking whether a company from a new research batch
  already exists, don't just `ilike` the full name as given (e.g. "Emporia
  Energy") — a prior entry may be stored under a shorter or differently
  formatted name (e.g. just "Emporia"), and a full-string match will miss it,
  producing a silent duplicate. This happened once (Sep 2026) and was
  caught only because Evan noticed it live on the site. Match on just the
  first word of the normalized name (lowercased, punctuation stripped) when
  scanning for existing companies, then eyeball any hits before assuming
  they're unrelated. Also strip hyphens specifically before taking the first
  word — a source spelling a company "X-Cimer" will not match an existing
  "Xcimer" row under naive first-word matching, since the hyphen makes
  "x-cimer" tokenize as two words ("x", "cimer") instead of one. This
  happened once (Sep 2026): a duplicate insert of Xcimer Energy was only
  caught by the database's unique-slug constraint erroring out, not by the
  dedup check itself.
- A second table, `rejected_companies` (`src/db/schema.ts`), records companies
  that came up during research but were deliberately excluded as out of scope
  (name, reason, source URL, timestamp) — added Sep 2026 after repeatedly
  re-litigating the same "is this actually a clean energy company or just an
  industrial company that touches energy/materials" judgment call on
  companies pulled from broad third-party "climate & critical minerals"
  startup lists. Check this table before researching a new company Evan
  hasn't explicitly pre-approved, to avoid redoing a scope decision already
  made.
- **People** (added Sep 2026): `people` (canonical person, independent of any
  company) and `people_roles` (many-to-many join with `title`, `roleType`
  ["executive" | "board" | "founder"], `isCurrent`, optional start/end
  dates, `sourceUrl`) — `src/db/schema.ts`. Query layer is
  `src/lib/people.ts`'s `getCurrentLeadership(companyId)`, rendered as a
  "Leadership" panel on the company profile page
  (`src/app/companies/[slug]/page.tsx`), shown only when a company has at
  least one current person on file. Deliberately scoped narrow to start:
  **current roles only** (no historical/past roles yet — `isCurrent`
  exists for when that's added later), and surfaced **only** on the
  company profile page (no standalone `/people` directory yet). `people`
  carries its own `linkedin_url` since that's the intended join key for
  eventually cross-referencing against Evan's separate podcast-guest
  project (see below), and photos were deliberately skipped (no
  `photo_url` column) to avoid a third logo/avatar-provider dependency
  after already migrating company logos off Clearbit once this month.
  Company profile pages are statically generated with `revalidate = 3600`,
  so adding people via a direct DB script doesn't appear on already-built
  pages immediately — Evan's preference (confirmed Sep 2026) is to let
  each batch pick up naturally on the next ISR revalidation rather than
  force a `vercel deploy --prod` after every batch.
- Sector *colors* (`SECTOR_COLORS` in `src/lib/sectors.ts`) deliberately
  stayed a hardcoded map rather than moving into the DB — `getSectorColor()`
  is imported directly into client components (`CompanyMap.tsx`,
  `SectorChart.tsx`) for synchronous lookups, and DB-backed colors would have
  forced those into async/prop-drilled fetching for no real benefit. Only
  `company.sector` (the string value) comes from the DB now, same as before.
- Dashboard sector counts (`SectorChart` on the homepage) are **dynamic** —
  `page.tsx` calls `getSectorCounts(companies)` (`src/lib/sectors.ts`), which
  tallies `sector` values across the live fetched company list on every
  request. There is no hand-maintained sector-count array anymore (it used to
  live in `dashboard.ts` and had to be updated by hand after every directory
  change — that field was removed from both `dashboard.ts` and the
  `DashboardData` type since it's fully superseded now). `/companies` and the
  map render live from the DB the same way.

## Writing style guide (STRICT — read before drafting any blog content)

Evan's voice, distilled from many editing rounds:

- **Lead with the opinion, then explain it** — don't build up to a conclusion
- **Long, flowing sentences** connected with commas/"which"/"but"/"though" —
  avoid short blunt sentences stacked for emphasis (Evan explicitly does not
  want this pattern, even though it showed up in early drafts)
- **Informal register** — "a whole bunch of," not "a significant number of"
- Comfortable being dismissive/opinionated when something deserves it
- Specific and concrete — explain the actual mechanism, not the abstraction
- **No em-dashes, ever.** Use colons, commas, or restructure. Scan every draft
  for `—` before presenting it. This has been the single most-corrected issue
  across every post.
- No rhetorical questions, no tidy "topic sentence → support → conclusion"
  paragraph structure, no "In conclusion"
- "We" when referring to Colorado as a place/people; "they" for specific
  government agencies or companies acting as actors
- Don't supply psychological narratives Evan hasn't stated himself

**Blog post workflow (always outline-first):**
1. Research using web search, pull real sourced numbers (never estimate/
   interpolate data and present it as real — flag explicitly if a number is
   an approximation)
2. Present an outline as bullet points per section (not full sentences) with
   source URLs attached to each section
3. Evan reviews/edits the outline before any prose is written
4. Write the full draft in Evan's voice per the above
5. Evan edits; Claude does targeted revisions on specific flagged sections
6. Add inline citations last: `<sup>[[1]](#source-1)</sup>` linking down to a
   `sources` array in the MDX frontmatter (see any existing post for the
   pattern) — the sources section renders automatically at the bottom of
   every post via `blog/[slug]/page.tsx`
7. Before publishing: re-scan for em-dashes, verify every cited number traces
   to a real source

**Never use another AI tool to "clean up" a draft** — it tends to formalize
the voice and strip out the things that make it sound like Evan.

## Design system

- Colors: `--color-cc-green: #2d8c5e`, `--color-ink: #111111`,
  `--color-surface-dash: #f7f7f5`
- Fonts: Playfair Display (serif, headings/big numbers), Inter (sans, UI/body)
- Dashboard panels are consistently styled: `text-tag font-sans font-bold
  uppercase tracking-widest text-ink-faint` for section labels
- OG images (site-wide and per-post) use **light mode** (`#f7f7f5` bg) —
  this was deliberately changed from an earlier dark-mode version to match
  the site

## Known quirks / gotchas

- Chart.js components must be client components (`"use client"`) and destroy
  the previous chart instance before creating a new one (React strict mode
  double-invokes effects in dev, causing "already initialized" errors
  otherwise)
- Leaflet map containers need `container._leaflet_id = null` reset before
  re-initializing, for the same reason
- Chart.js tick `callback` functions must not be typed as returning
  `string | void` — TypeScript/Chart.js type mismatch causes Vercel build
  failures. Just let the return type infer naturally.
- MDX + `next-mdx-remote/rsc` custom React components with numeric props
  (e.g. `<Cite num={1} />`) unreliably receive the prop value — the working
  citation pattern is plain markdown instead:
  `<sup>[[1]](#source-1)</sup>` — no custom component needed
- Google Sheets CSV fetch: use `next: { revalidate: 3600 }` only — do NOT
  also set `cache: "no-store"`, they conflict and Next.js will warn/error
- Job counts live in `src/lib/jobs.ts` (one fetcher per ATS + the Colorado
  location rule), shared by `/api/jobs` (dashboard total), the company
  profile page (the "N in CO" badge on the Open jobs link, via
  `getCompanyJobCount(slug)`), and the daily health check. **Which board a
  company uses is DB data, not code** (moved Sep 2026): `companies.ats_type`
  (a `FETCHERS` key — lever/greenhouse/ashby/workable/jobvite/rippling/
  bamboohr/breezy/pinpoint/workday; Workday's `ats_slug` format is
  `tenant.wdN/site`, e.g. `itron.wd5/Itron`), `ats_slug` (the board ID), and
  `ats_remote_nationwide`. Adding a company's board = setting those columns
  (plus `jobs_url`, since the badge renders inside that link) — verify the
  slug returns the right company's postings first (see slug-collision note
  below). Supporting a *new* ATS platform is the only thing that needs code.
- Fetchers **throw** on HTTP errors or an unrecognized response shape (they
  used to silently return 0, which is how Crusoe's 350 jobs went uncounted
  unnoticed). `countSource` turns that into `status: "error"`, and
  `/api/jobs` lists erroring boards under `errors`.
- Daily health check: `/api/cron/job-health` (Vercel Cron, `vercel.json`,
  14:00 UTC; authenticated via the `CRON_SECRET` env var, which Vercel sends
  as a Bearer token) logs every board to the `job_board_checks` table and
  alerts only on *new* problems vs the previous run — a board that starts
  erroring, or drops to 0 postings after having ≥3 — so a board that stays
  broken doesn't re-alert daily. `job_board_checks` also doubles as a daily
  history of open-job counts per company.
- The ATS fetchers hit public APIs directly (Lever, Greenhouse,
  Ashby, Workable, Jobvite, Rippling, BambooHR, Breezy, Pinpoint, Workday).
  Workday has no *documented* public API — the fetcher uses the undocumented
  `/wday/cxs/{tenant}/{site}/jobs` JSON endpoint that every myworkdayjobs.com
  site's own frontend calls (quirks: max 20 per page, `total` only on the
  first page, multi-location postings say "N Locations" and need a detail
  call). It could break without notice; the health check will catch it.
  Paylocity, Dayforce, ADP, JazzHR, TrinetHire, iRecruit, and HRMDirect-based
  career pages still aren't counted. ATS
  endpoints drift silently: in Sep 2026 Ashby's old non-user-facing listing
  endpoint and Workable's v3 GET both started 404ing (Crusoe's 350 jobs and
  every Workable company were counting as 0 with no error, since fetchers
  return 0 on failure) — current endpoints are Ashby
  `api.ashbyhq.com/posting-api/job-board/{slug}`, Workable
  `apply.workable.com/api/v1/widget/accounts/{slug}`, Rippling
  `api.rippling.com/platform/api/ats/v1/board/{slug}/jobs`. If the total
  looks low, curl each source before assuming companies just aren't hiring.
  When adding a source by guessing a slug, verify the board is actually the
  right company (check board name / posting text / locations) — generic
  slugs collide constantly (e.g. Lever `arcadia` is a healthcare company, not
  Arcadia the energy platform; Ashby `ion`/`prometheus`/`terra` were all
  unrelated companies). The dashboard headline counts only jobs located in
  Colorado or fully remote anywhere in the US (`isColoradoOrRemoteUS` in the
  route); the unfiltered count is still returned as `totalAllLocations`.
  Filtering matters: unfiltered, Crusoe (Bay Area/Dublin) and Halter
  (NZ/LatAm, plus region-bound "remote" field roles like "Montana") made up
  ~60% of the total, and only ~40% of all postings are actually in CO.
  Region-bound remote roles ("Remote - East Coast") are deliberately excluded.
  Some ATS boards attach an HQ city to fully remote roles (WeaveGrid's are all
  "San Francisco (Remote)") — set `remoteIsNationwide: true` on that source
  rather than loosening the shared rule.
- `SECTOR_COLORS` in `src/lib/sectors.ts` used to be copy-pasted independently
  into `SectorChart.tsx`, `CompanyMap.tsx`, and `MapPanel.tsx` — if you see a
  local `SECTOR_COLORS` const reappear in a component instead of an import
  from `sectors.ts`, it's drifted and should be removed. See the `sectors.ts`
  entry above for the fuller story on why it's the single canonical color map
  now (badge colors included).

## Current state (as of late Aug 2026)

- ~95 companies in the directory, spanning clean energy through broader
  "climate tech" (the scope was deliberately widened partway through — see
  sectors like Low-Carbon Materials, Circular Economy/Recycling, Aviation,
  Methane/Emissions Monitoring that reflect this)
- 3 blog posts published: "Welcome to Colorado Current," "Colorado Is Already
  Two Years Behind on Its Climate Targets," "The Grid Got Cleaner. The Roads
  Didn't." (Part 1 of a sector-by-sector emissions series)
- Part 2 of the emissions series ("Oil and Gas Is Colorado's Secret Climate
  Win. Buildings Aren't.") is drafted/near-complete
- A company spotlight post on AtmosZero has been drafted
- LinkedIn company page + personal profile are active distribution channels;
  Evan cross-posts each article there, tailored per-post (shorter teaser +
  link for short posts, full article-in-post for longer ones)

## Things Claude Code can likely do that the web chat couldn't

- Read the actual current state of every file directly, no more "please
  upload the current version of X" round-trips
- Run `git status`/`diff`/`commit`/`push` directly instead of generating
  files for manual copy-paste
- Write directly to the company directory (Neon Postgres) via a script run
  against the DB — see "Company directory data" above
