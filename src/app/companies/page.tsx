import type { Metadata } from "next";
import { fetchCompanies } from "@/lib/sheets";
import CompanyTable from "@/components/directory/CompanyTable";

export const metadata: Metadata = {
  title: "Companies",
  description: "Directory of 40+ Colorado clean energy companies tracked by Colorado Current.",
};

export default async function CompaniesPage() {
  const companies = await fetchCompanies();

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-extrabold text-ink tracking-tight mb-2">
          Company directory
        </h1>
        <p className="text-sm font-sans text-ink-secondary max-w-xl">
          {companies.length > 0 ? companies.length : "40"}+ Colorado clean energy companies across solar, storage, grid software, geothermal, hydrogen, and more.
        </p>
      </div>
      <CompanyTable companies={companies} />
    </div>
  );
}
