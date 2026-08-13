import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      date: data.date || "",
      readTime: data.readTime || "5 min read",
      type: data.type || "Industry analysis",
      sector: data.sector || "",
    } as Post;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || "",
    excerpt: data.excerpt || "",
    date: data.date || "",
    readTime: data.readTime || "5 min read",
    type: data.type || "Industry analysis",
    sector: data.sector || "",
    content,
    sources: data.sources || [],
  } as Post;
}
