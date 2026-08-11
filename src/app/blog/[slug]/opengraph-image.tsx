import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

const TYPE_COLORS: Record<string, string> = {
  "Company spotlight": "#2d8c5e",
  "Industry analysis": "#c47d1a",
  "Deep dive": "#185FA5",
  "Policy": "#534AB7",
};

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  const title = post?.title ?? "Colorado Current";
  const type = post?.type ?? "Analysis";
  const excerpt = post?.excerpt ?? "Independent analysis of Colorado's clean energy ecosystem.";
  const accentColor = TYPE_COLORS[type] || "#2d8c5e";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#f7f7f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{ width: "100%", height: 6, background: accentColor }} />

        {/* Left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 6, height: "100%", background: accentColor }} />

        {/* Main content */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "48px 80px 48px 88px", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>

            {/* Type tag */}
            <div
              style={{
                display: "inline-flex",
                background: accentColor,
                color: "white",
                fontSize: 13,
                fontFamily: "sans-serif",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 3,
                marginBottom: 28,
                width: "fit-content",
              }}
            >
              {type}
            </div>

            {/* Title */}
            <div
              style={{
                color: "#111111",
                fontSize: title.length > 60 ? 44 : 52,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              {title}
            </div>

            {/* Excerpt */}
            <div
              style={{
                color: "#666666",
                fontSize: 20,
                fontFamily: "sans-serif",
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              {excerpt.length > 120 ? excerpt.slice(0, 120) + "..." : excerpt}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 80px 20px 88px",
            borderTop: "1px solid #e8e8e4",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="32" height="36" viewBox="-18 -24 36 52" fill="none">
              <line x1="-13" y1="20" x2="0" y2="-20" stroke="#2d8c5e" strokeWidth="5" strokeLinecap="round" />
              <line x1="13" y1="20" x2="0" y2="-20" stroke="#2d8c5e" strokeWidth="5" strokeLinecap="round" />
              <path d="M-8,8 C-5,3 -2,3 0,8 C3,13 6,13 8,8" stroke="#2d8c5e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            <span style={{ color: "#111111", fontSize: 22, fontWeight: 700, fontFamily: "serif" }}>
              Colorado Current
            </span>
          </div>
          <span style={{ color: "#aaaaaa", fontSize: 16, fontFamily: "sans-serif" }}>
            coloradocurrent.com
          </span>
        </div>

        {/* Bottom accent bar */}
        <div style={{ width: "100%", height: 4, background: accentColor }} />
      </div>
    ),
    { ...size }
  );
}
