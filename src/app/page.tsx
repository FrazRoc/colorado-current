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

  return (
    <>
      {/* Dashboard section */}
      <section className="bg-surface-dash border-b border-surface-border px-8 pb-0">
        {/* Header */}
        <div className="pt-7 pb-5">
          <div className="flex items-baseline gap-2.5 mb-1.5">
            <span className="text-tag font-sans font-bold uppercase tracking-widest text-cc-green">
              Ecosystem Pulse
            </span>
            <span className="text-2xs font-sans text-ink-faint">
              Updated {dashboardData.updatedAt}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-ink tracking-tight">
            Colorado's clean energy economy, by the numbers
          </h1>
        </div>

        {/* Top 4 metrics */}
        <MetricsRow metrics={dashboardData.metrics} />

        {/* Second row: sector chart + funding + policy */}
        <div className="grid grid-cols-[2fr_1fr_1fr] border-t border-surface-border border-l border-surface-border">
          <SectorChart sectors={dashboardData.sectorCounts} />
          <FundingPanel rounds={dashboardData.recentFunding} />
          <PolicyPanel legislation={dashboardData.legislation} />
        </div>

        {/* Third row: VPP + heat pumps */}
        <StatPanel
          vppMw={dashboardData.vppMw}
          vppGoal={dashboardData.vppGoal}
          heatPumpRebates={dashboardData.heatPumpRebates}
        />
      </section>

      {/* Blog section */}
      <section className="px-8 py-8 max-w-7xl">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-tag font-sans font-bold uppercase tracking-widest text-ink">
            Latest analysis
          </span>
          <Link
            href="/blog"
            className="text-xs font-sans font-semibold text-cc-green no-underline hover:underline"
          >
            All posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="border border-surface-border rounded p-12 text-center">
            <p className="text-sm font-sans text-ink-muted">
              Posts coming soon. Check back after launch.
            </p>
          </div>
        ) : (
          <>
            {/* Featured + sidebar */}
            <div className="grid grid-cols-[3fr_1fr] gap-8 border-b border-surface-border pb-7 mb-7">
              {featured && (
                <PostCard post={featured} featured />
              )}
              <div className="border-l border-surface-border pl-7 flex flex-col gap-0">
                {sidebar.map((post, i) => (
                  <div
                    key={post.slug}
                    className={i < sidebar.length - 1 ? "pb-5 mb-5 border-b border-surface-border" : ""}
                  >
                    <PostCard post={post} compact />
                  </div>
                ))}
              </div>
            </div>

            {/* Lower 3-col grid */}
            {lower.length > 0 && (
              <div className="grid grid-cols-3 gap-6">
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
