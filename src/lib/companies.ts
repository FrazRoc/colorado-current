import type { Company } from "@/types";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCompanyBySlug(companies: Company[], slug: string): Company | undefined {
  return companies.find((c) => slugify(c.name) === slug);
}

export function getRelatedCompanies(companies: Company[], company: Company, limit = 3): Company[] {
  return companies
    .filter((c) => c.sector === company.sector && c.name !== company.name)
    .slice(0, limit);
}
