import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { getSectorStyle } from "@/lib/sectors";
import { MDXRemote } from "next-mdx-remote/rsc";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const style = getSectorStyle(post.type);

  return (
    <article className="px-5 md:px-8 py-10 max-w-2xl mx-auto">
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
      <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-ink leading-tight tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="text-xs font-sans text-ink-faint mb-8 pb-8 border-b border-surface-border">
        {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readTime}
      </div>

      {/* Content */}
      <div className="prose prose-sm md:prose-base max-w-none font-sans text-ink-secondary leading-relaxed
        prose-headings:font-serif prose-headings:text-ink
        prose-p:mb-4 prose-p:leading-relaxed
        prose-a:text-cc-green prose-a:no-underline hover:prose-a:underline">
        {post.content && <MDXRemote source={post.content} />}
      </div>

      {/* Byline */}
      <div className="mt-12 pt-8 border-t border-surface-border">
        <p className="text-sm font-sans text-ink-muted">
          Written by{" "}
          <a href="https://linkedin.com/in/evanfrasz" className="text-cc-green hover:underline" target="_blank" rel="noopener noreferrer">
            Evan Frasz
          </a>
          {" "}· <a href="/" className="text-cc-green hover:underline">Colorado Current</a>
        </p>
      </div>
    </article>
  );
}
