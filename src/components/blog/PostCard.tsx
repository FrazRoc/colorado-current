import Link from "next/link";
import type { Post } from "@/types";
import { getSectorStyle } from "@/lib/sectors";

interface Props {
  post: Post;
  featured?: boolean;
  compact?: boolean;
}

export default function PostCard({ post, featured = false, compact = false }: Props) {
  const style = getSectorStyle(post.type);
  const imgHeight = featured ? "h-48" : compact ? "h-20" : "h-28";

  return (
    <Link href={`/blog/${post.slug}`} className="no-underline group block">
      {/* Image placeholder — replace with next/image when photos are available */}
      <div
        className={`${imgHeight} rounded-md mb-3 flex items-center justify-center`}
        style={{ background: style.placeholder }}
      >
        <span
          className="text-tag font-sans font-semibold uppercase tracking-wider"
          style={{ color: style.text }}
        >
          {post.sector || post.type}
        </span>
      </div>

      {/* Type tag + date */}
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-tag font-sans font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm"
          style={{ background: style.bg, color: style.text }}
        >
          {post.type}
        </span>
        <span className="text-2xs font-sans text-ink-faint">
          {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readTime}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`font-serif font-bold text-ink leading-snug tracking-tight group-hover:text-cc-green transition-colors ${
          featured ? "text-xl mb-2" : compact ? "text-sm" : "text-base"
        }`}
      >
        {post.title}
      </h3>

      {/* Excerpt — only on non-compact */}
      {!compact && post.excerpt && (
        <p className="text-sm font-sans text-ink-secondary leading-relaxed mt-1">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}
