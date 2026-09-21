import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { slugify, getCompanies, getCompanyBySlug, getRelatedCompanies } from "@/lib/companies";
import { getSectorStyle } from "@/lib/sectors";
import CompanyLocationMapPanel from "@/components/company/CompanyLocationMapPanel";
import CompanyLogo from "@/components/company/CompanyLogo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((c) => ({ slug: slugify(c.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return {};

  const description = `${company.what_they_do} ${company.name} is based in ${company.hq} and tracked in Colorado Current's ${company.sector.toLowerCase()} directory.`.trim();
  const url = `https://coloradocurrent.com/companies/${slug}`;

  return {
    title: company.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${company.name} | Colorado Current`,
      description,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} | Colorado Current`,
      description,
    },
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const style = getSectorStyle(company.sector);
  const related = await getRelatedCompanies(company);
  const sources = company.sources ? company.sources.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.what_they_do,
    url: company.website || undefined,
    address: company.hq ? { "@type": "PostalAddress", addressLocality: company.hq } : undefined,
    industry: company.sector,
    foundingDate: company.founded || undefined,
    sameAs: [
      company.linkedin_url,
      company.twitter_url,
      company.bluesky_url,
      company.facebook_url,
      company.instagram_url,
      company.youtube_url,
      company.crunchbase_url,
    ].filter(Boolean),
  };

  return (
    <div className="px-5 md:px-8 py-10 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/companies" className="text-xs font-sans text-ink-muted hover:text-cc-green inline-flex items-center gap-1 mb-6">
        ← All companies
      </Link>

      {/* Header */}
      <div className="flex gap-5 items-start pb-6 border-b border-surface-border mb-7">
        <CompanyLogo name={company.name} website={company.website} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-ink tracking-tight">{company.name}</h1>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs font-sans font-semibold text-cc-green hover:underline whitespace-nowrap">
                {company.website.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
              </a>
            )}
          </div>

          {company.what_they_do && (
            <p className="text-sm font-sans text-ink-secondary leading-relaxed mt-2 mb-3 max-w-xl">{company.what_they_do}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-tag font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm" style={{ background: style.bg, color: style.text }}>
              {company.sector}
            </span>
            <span className="text-xs font-sans text-ink-muted">{company.stage}</span>
            <span className="text-xs font-sans text-ink-muted">{company.hq}</span>
            {company.founded && <span className="text-xs font-sans text-ink-muted">Founded {company.founded}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-6 items-start">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          {company.interesting_angle && (
            <div className="border-l-2 border-cc-green pl-4">
              <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-1.5">The interesting angle</p>
              <p className="text-sm font-sans text-ink-muted italic leading-relaxed">{company.interesting_angle}</p>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">Related in {company.sector}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {related.map((r) => (
                  <Link
                    key={r.name}
                    href={`/companies/${slugify(r.name)}`}
                    className="border border-surface-border rounded px-3 py-2.5 hover:border-cc-green transition-colors"
                  >
                    <div className="text-sm font-sans font-semibold text-ink">{r.name}</div>
                    <div className="text-2xs font-sans text-ink-muted mt-0.5">{r.hq}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(company.last_updated || sources.length > 0) && (
            <div className="pt-4 border-t border-surface-divider flex flex-wrap justify-between gap-2 text-2xs font-sans text-ink-faint">
              {company.last_updated && (
                <span>Last updated {new Date(company.last_updated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              )}
              {sources.length > 0 && (
                <span>
                  Sources:{" "}
                  {sources.map((s, i) => (
                    <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="text-ink-faint hover:text-cc-green mx-0.5">[{i + 1}]</a>
                  ))}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="border border-surface-border rounded px-4 py-4">
            <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">Snapshot</p>
            <dl className="flex flex-col">
              {[
                ["Funding", company.funding],
                ["Stage", company.stage],
                ["HQ", company.hq],
                ["Founded", company.founded],
                ["Target customer", company.target_customer],
              ]
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 py-2 border-b border-surface-divider last:border-b-0 last:pb-0 first:pt-0 text-xs font-sans">
                    <dt className="text-ink-faint">{label}</dt>
                    <dd className="font-semibold text-ink text-right">{value}</dd>
                  </div>
                ))}
              {company.b_corp === "Yes" && (
                <div className="flex justify-between gap-3 py-2 text-xs font-sans">
                  <dt className="text-ink-faint">B Corp</dt>
                  <dd className="font-semibold text-cc-green text-right">✓ Certified</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border border-surface-border rounded px-4 py-4">
            <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">Links</p>
            <ul className="flex flex-col">
              {[
                ["Website", company.website],
                ["Open jobs", company.jobs_url],
                ["LinkedIn", company.linkedin_url],
                ["X / Twitter", company.twitter_url],
                ["Bluesky", company.bluesky_url],
                ["Facebook", company.facebook_url],
                ["Instagram", company.instagram_url],
                ["YouTube", company.youtube_url],
                ["Crunchbase", company.crunchbase_url],
                ["Pitchbook", company.pitchbook_url],
                ["Built In", company.builtin_url],
              ]
                .filter(([, url]) => Boolean(url))
                .map(([label, url], i, arr) => (
                  <li key={label} className={i < arr.length - 1 ? "border-b border-surface-divider" : ""}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2.5 text-xs font-sans font-semibold text-ink hover:text-cc-green">
                      {label} <span>→</span>
                    </a>
                  </li>
                ))}
              {!company.website &&
                !company.jobs_url &&
                !company.linkedin_url &&
                !company.twitter_url &&
                !company.bluesky_url &&
                !company.facebook_url &&
                !company.instagram_url &&
                !company.youtube_url &&
                !company.crunchbase_url &&
                !company.pitchbook_url &&
                !company.builtin_url && (
                  <li className="text-xs font-sans text-ink-faint py-1">No links yet.</li>
                )}
            </ul>
          </div>

          {company.lat && company.lng && (
            <div className="border border-surface-border rounded px-4 py-4">
              <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">HQ location</p>
              <CompanyLocationMapPanel name={company.name} sector={company.sector} lat={company.lat} lng={company.lng} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
