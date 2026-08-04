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

  return (
    <Link href={`/blog/${post.slug}`} className="no-underline group block">
      {/* Type tag + date */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-sans font-bold uppercase px-1.5 py-0.5 rounded-sm whitespace-nowrap"
          style={{ background: style.bg, color: style.text, fontSize: "9px", letterSpacing: "0.08em" }}
        >
          {post.type}
        </span>
        <span className="font-sans text-ink-faint" style={{ fontSize: "10px" }}>
          {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readTime}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`font-serif font-bold text-ink leading-snug tracking-tight group-hover:text-cc-green transition-colors mb-2 ${
          featured ? "text-xl" : compact ? "text-sm" : "text-base"
        }`}
      >
        {post.title}
      </h3>

      {/* Excerpt — only on non-compact */}
      {!compact && post.excerpt && (
        <p className="text-sm font-sans text-ink-secondary leading-relaxed">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}
