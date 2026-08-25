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
- Data layer: a public Google Sheet (published as CSV) is the live source of
  truth for the company directory — fetched server-side, not stored in the repo
- Charts: Chart.js (loaded dynamically client-side, `"use client"` components)
- Map: Leaflet with CartoDB light tiles
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
    api/jobs/route.ts           — live ATS job count aggregator
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
    sheets.ts                   — fetches + parses the Google Sheets CSV into
                                   Company[] objects (this is where new
                                   spreadsheet columns need to be added if the
                                   sheet schema changes)
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

## The Google Sheet (company directory)

- Sheet ID: `1CQnsYyfnOMImK-3F5U03xGbNX8baoT8eUCw0rwdFROw`
- Published-to-web CSV URL lives in `NEXT_PUBLIC_SHEETS_CSV_URL` env var
  (set in `.env.local` locally and in Vercel's dashboard for production)
- **New-machine setup**: `.env.local` is gitignored, so a fresh clone has no
  value for this. Run `vercel link` then `vercel env pull .env.local`. If
  that pull comes back without `NEXT_PUBLIC_SHEETS_CSV_URL`, it's because the
  var was only added for Production/Preview, not Development — `vercel env
  ls` will confirm which environments it's set for. If it shows type
  "Sensitive" for Production/Preview, note that Sensitive-type values are
  write-only in Vercel (CLI and dashboard both refuse to show them once
  saved) — `vercel env add NEXT_PUBLIC_SHEETS_CSV_URL development` needs the
  actual URL re-supplied, which you get from the Sheet itself (File → Share →
  Publish to web — reopening it shows the existing published CSV link, no
  need to republish). Since this var is `NEXT_PUBLIC_*` anyway (visible to
  anyone visiting the site), there's no benefit to marking it Sensitive.
- Columns: `name, hq, sector, stage, funding, what_they_do, interesting_angle,
  website, founded, b_corp, target_customer, last_updated, sources, notes,
  lat, lng, jobs_url`
- `sheets.ts` parses headers case-insensitively and lowercases them — any new
  column needs a matching field added to both the `Company` type
  (`src/types/index.ts`) and the parse logic in `sheets.ts`
- I (Claude, in the web chat) cannot edit the Sheet directly — the workflow so
  far has been: research a company → build a spreadsheet row → export as
  xlsx → Evan pastes it into the live Sheet manually. If Claude Code has
  Sheets API / MCP access this could become more direct — check with Evan.
- Dashboard sector counts (`SectorChart` on the homepage) are **dynamic** —
  `page.tsx` calls `getSectorCounts(companies)` (`src/lib/sectors.ts`), which
  tallies `sector` values across the live fetched company list on every
  request. There is no hand-maintained sector-count array anymore (it used to
  live in `dashboard.ts` and had to be updated by hand after every directory
  change — that field was removed from both `dashboard.ts` and the
  `DashboardData` type since it's fully superseded now). `/companies` and the
  map render live from the Sheet the same way.

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
- The `/api/jobs` route hits public ATS APIs directly (Lever, Greenhouse,
  Ashby, Workable, Jobvite, Rippling, BambooHR) — Workday, Paylocity,
  Dayforce, TrinetHire, iRecruit, and HRMDirect-based career pages don't have
  usable public APIs and are not counted
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
- Potentially interact with the Google Sheet directly if Sheets API/MCP
  access is set up — ask Evan if this is available before assuming it isn't
