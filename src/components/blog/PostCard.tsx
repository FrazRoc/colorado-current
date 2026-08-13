import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";
import { getSectorStyle } from "@/lib/sectors";

interface Props {
  post: Post;
  featured?: boolean;
  compact?: boolean;
}

const BORDER_COLORS: Record<string, string> = {
  "Company spotlight": "#2d8c5e",
  "Industry analysis": "#c47d1a",
  "Deep dive": "#185FA5",
  "Policy": "#534AB7",
};

export default function PostCard({ post, featured = false, compact = false }: Props) {
  const style = getSectorStyle(post.type);
  const borderColor = BORDER_COLORS[post.type] || "#2d8c5e";

  return (
    <Link href={`/blog/${post.slug}`} className="no-underline group block">
      <div
        className="pl-3 transition-opacity group-hover:opacity-80"
        style={{ borderLeft: `2px solid ${borderColor}` }}
      >
        {/* Type tag + date */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-sans font-bold uppercase whitespace-nowrap"
            style={{ background: style.bg, color: style.text, fontSize: "9px", letterSpacing: "0.08em", padding: "2px 6px", borderRadius: "2px" }}
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

        {/* Image — non-compact cards only, capped at 280px tall */}
        {!compact && post.image && (
          <div className="rounded overflow-hidden mb-3" style={{ maxWidth: 600 }}>
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={600}
              className="w-full h-auto"
              style={{ display: "block", maxHeight: 280, objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        )}

        {/* Excerpt — only on non-compact */}
        {!compact && post.excerpt && (
          <p className="text-sm font-sans text-ink-secondary leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
