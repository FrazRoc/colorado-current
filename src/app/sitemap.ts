import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { fetchCompanies } from "@/lib/sheets";
import { slugify } from "@/lib/companies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://coloradocurrent.com";

  const posts = getAllPosts();
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const companies = await fetchCompanies();
  const companyUrls = companies.map((company) => ({
    url: `${baseUrl}/companies/${slugify(company.name)}`,
    lastModified: company.last_updated ? new Date(company.last_updated) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...postUrls,
    ...companyUrls,
  ];
}
