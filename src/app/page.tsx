import Link from "next/link";
import MetricsRow from "@/components/dashboard/MetricsRow";
import SectorChart from "@/components/dashboard/SectorChart";
import PolicyPanel from "@/components/dashboard/PolicyPanel";
import EmissionsPanel from "@/components/dashboard/EmissionsPanel";
import MapPanel from "@/components/dashboard/MapPanel";
import SectorEmissionsPanel from "@/components/dashboard/SectorEmissionsPanel";
import FundingTicker from "@/components/dashboard/FundingTicker";
import JobsMetric from "@/components/dashboard/JobsMetric";
import PostCard from "@/components/blog/PostCard";
import dashboardData from "@/data/dashboard";
import { getAllPosts } from "@/lib/posts";
import { fetchCompanies } from "@/lib/sheets";

export default async function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const featured = posts[0];
  const sidebar = posts.slice(1, 3);
  const lower = posts.slice(3, 6);
  const { sources } = dashboardData;
  const companies = await fetchCompanies();

  return (
    <>
      <section className="bg-surface-dash border-b border-surface-border px-5 md:px-8 pb-0">

        <div className="pt-6 pb-4 md:pt-7 md:pb-5">
          <div className="flex items-baseline gap-2.5 mb-1.5">
            <span className="text-tag font-sans font-bold uppercase tracking-widest text-cc-green">
              Ecosystem Pulse
            </span>
            <span className="text-2xs font-sans text-ink-faint">
              Updated {dashboardData.updatedAt}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-ink tracking-tight">
            Colorado's clean energy economy, by the numbers
          </h1>
        </div>

        {/* Row 1: companies, funding, open jobs */}
        <div className="grid grid-cols-2 md:grid-cols-3 border-t-[3px] border-ink border-l border-surface-border">
          {/* Companies — dynamic */}
          <div className="px-4 md:px-5 py-4 md:py-5 border-r border-surface-border border-b md:border-b-0 flex flex-col">
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-ink leading-none tracking-tight">
              {companies.length}
            </div>
            <div className="text-2xs font-sans text-ink-muted uppercase tracking-widest mt-1.5 mb-1">
              Tracked companies
            </div>
            <div className="text-xs font-sans font-semibold text-cc-green">
              Across 11 sectors
            </div>
          </div>

          {/* Ecosystem funding */}
          <div className="px-4 md:px-5 py-4 md:py-5 border-r border-surface-border border-b md:border-b-0 flex flex-col">
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-ink leading-none tracking-tight">
              $4.5B
            </div>
            <div className="text-2xs font-sans text-ink-muted uppercase tracking-widest mt-1.5 mb-1">
              Ecosystem funding
            </div>
            <div className="text-xs font-sans text-ink-muted">
              24 companies with disclosed funding
            </div>
          </div>

          {/* Open jobs — live from ATS APIs */}
          <JobsMetric />
        </div>

        {/* Funding ticker */}
        <FundingTicker />

        {/* Row 2: Sector chart + Legislation */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] border-t border-surface-border border-l border-surface-border">
          <SectorChart sectors={dashboardData.sectorCounts} sources={[]} />
          <PolicyPanel legislation={dashboardData.legislation} sources={sources.legislation} />
        </div>

        {/* Row 3: Emissions progress tracker */}
        <EmissionsPanel sources={sources.emissions ?? []} />

        {/* Row 4: Map + Sector emissions chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-surface-border border-l border-surface-border">
          <MapPanel companies={companies} />
          <div className="border-l border-surface-border">
            <SectorEmissionsPanel />
          </div>
        </div>

      </section>

      <section className="px-5 md:px-8 py-6 md:py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <span className="text-tag font-sans font-bold uppercase tracking-widest text-ink">
            Latest analysis
          </span>
          <Link href="/blog" className="text-xs font-sans font-semibold text-cc-green no-underline hover:underline">
            All posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="border border-surface-border rounded p-12 text-center">
            <p className="text-sm font-sans text-ink-muted">Posts coming soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 md:gap-8 border-b border-surface-border pb-7 mb-7">
              {featured && <PostCard post={featured} featured />}
              {sidebar.length > 0 && (
                <div className="md:border-l md:border-surface-border md:pl-7 flex flex-col gap-0">
                  {sidebar.map((post, i) => (
                    <div key={post.slug} className={i < sidebar.length - 1 ? "pb-5 mb-5 border-b border-surface-border" : ""}>
                      <PostCard post={post} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {lower.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {lower.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
