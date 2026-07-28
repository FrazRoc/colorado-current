import type { Metadata } from "next";
import PostCard from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Analysis and company spotlights from Colorado's clean energy ecosystem.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="px-8 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-extrabold text-ink tracking-tight mb-2">
          Analysis
        </h1>
        <p className="text-sm font-sans text-ink-secondary max-w-xl">
          Company spotlights, industry deep-dives, and policy analysis covering Colorado's clean energy ecosystem.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border border-surface-border rounded p-16 text-center">
          <p className="text-sm font-sans text-ink-muted">
            Posts coming soon. Subscribe to be notified at launch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-7">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
