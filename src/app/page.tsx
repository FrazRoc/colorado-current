import Link from "next/link";
import MetricsRow from "@/components/dashboard/MetricsRow";
import SectorChart from "@/components/dashboard/SectorChart";
import FundingPanel from "@/components/dashboard/FundingPanel";
import PolicyPanel from "@/components/dashboard/PolicyPanel";
import StatPanel from "@/components/dashboard/StatPanel";
import PostCard from "@/components/blog/PostCard";
import dashboardData from "@/data/dashboard";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const featured = posts[0];
  const sidebar = posts.slice(1, 3);
  const lower = posts.slice(3, 6);
  const { sources } = dashboardData;

  return (
    <>
      {/* Dashboard section */}
      <section className="bg-surface-dash border-b border-surface-border px-5 md:px-8 pb-0">
        {/* Header */}
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

        {/* Top 4 metrics — 2x2 on mobile, 4 across on desktop */}
        <MetricsRow metrics={dashboardData.metrics} sources={sources} />

        {/* Second row — stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] border-t border-surface-border border-l border-surface-border">
          <SectorChart sectors={dashboardData.sectorCounts} sources={[]} />
          <FundingPanel rounds={dashboardData.recentFunding} sources={sources.recentFunding} />
          <PolicyPanel legislation={dashboardData.legislation} sources={sources.legislation} />
        </div>

        {/* Third row — stacks on mobile */}
        <StatPanel
          vppMw={dashboardData.vppMw}
          vppGoal={dashboardData.vppGoal}
          heatPumpRebates={dashboardData.heatPumpRebates}
          vppSources={sources.vpp}
          heatPumpSources={sources.heatPumps}
        />
      </section>

      {/* Blog section */}
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
            {/* Featured + sidebar — stacks on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 md:gap-8 border-b border-surface-border pb-7 mb-7">
              {featured && <PostCard post={featured} featured />}
              {sidebar.length > 0 && (
                <div className="md:border-l md:border-surface-border md:pl-7 flex flex-col gap-0">
                  {sidebar.map((post, i) => (
                    <div
                      key={post.slug}
                      className={i < sidebar.length - 1 ? "pb-5 mb-5 border-b border-surface-border" : ""}
                    >
                      <PostCard post={post} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lower grid — 1 col on mobile, 3 on desktop */}
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
