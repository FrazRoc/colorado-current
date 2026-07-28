import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { getSectorStyle } from "@/lib/sectors";
import { MDXRemote } from "next-mdx-remote/rsc";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const style = getSectorStyle(post.type);

  return (
    <article className="px-8 py-10 max-w-3xl mx-auto">
      {/* Type tag */}
      <div className="mb-4">
        <span
          className="text-tag font-sans font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm"
          style={{ background: style.bg, color: style.text }}
        >
          {post.type}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-serif font-extrabold text-ink leading-tight tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="text-xs font-sans text-ink-faint mb-8 pb-8 border-b border-surface-border">
        {post.date} · {post.readTime}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none font-sans text-ink leading-relaxed">
        {post.content && <MDXRemote source={post.content} />}
      </div>
    </article>
  );
}
