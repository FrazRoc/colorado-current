import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { slugify, getCompanies, getCompanyBySlug, getRelatedCompanies } from "@/lib/companies";
import { getCurrentLeadership } from "@/lib/people";
import { getSectorStyle, getSectorColor } from "@/lib/sectors";
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

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const style = getSectorStyle(company.sector);
  const sectorColor = getSectorColor(company.sector);
  const related = await getRelatedCompanies(company);
  const leadership = await getCurrentLeadership(company.id);
  const sources = company.sources ? company.sources.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const hasSnapshotExtras = Boolean(company.target_customer || company.b_corp === "Yes");

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
      <style>{`
        .profile-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
          grid-template-areas: "leadership" "links" "angle" "map" "related" "sources";
        }
        @media (min-width: 768px) {
          .profile-grid {
            grid-template-columns: 1.6fr 1fr;
            column-gap: 20px;
            grid-template-areas:
              "angle       links"
              "leadership  map"
              ".           related"
              "sources     sources";
          }
        }
        .area-angle { grid-area: angle; }
        .area-leadership { grid-area: leadership; }
        .area-links { grid-area: links; }
        .area-map { grid-area: map; }
        .area-related { grid-area: related; }
        .area-sources { grid-area: sources; }
      `}</style>

      <Link href="/companies" className="text-xs font-sans text-ink-muted hover:text-cc-green inline-flex items-center gap-1 mb-6">
        ← All companies
      </Link>

      {/* Header */}
      <div className="border border-surface-border rounded-lg bg-surface px-6 md:px-7 pt-6 shadow-sm mb-4">
        <div className="flex gap-5 items-start flex-wrap">
          <CompanyLogo name={company.name} website={company.website} />

          <div className="flex-1 min-w-[240px]">
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

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-tag font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm" style={{ background: style.bg, color: style.text }}>
                {company.sector}
              </span>
              {company.b_corp === "Yes" && (
                <span className="text-tag font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-cc-green-light text-cc-green-dark">
                  ✓ B Corp
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stat row -- funding promoted out of a plain list into a scannable header stat */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-surface-border mt-5">
          <div className="py-3.5 px-4 border-r border-b sm:border-b-0 border-surface-border">
            <div className="text-2xs font-sans font-bold uppercase tracking-widest text-ink-faint mb-1">Funding</div>
            <div className="text-[16px] font-sans font-extrabold tabular-nums text-cc-green-dark">{company.funding || "—"}</div>
          </div>
          <div className="py-3.5 px-4 border-b sm:border-b-0 sm:border-r border-surface-border">
            <div className="text-2xs font-sans font-bold uppercase tracking-widest text-ink-faint mb-1">Stage</div>
            <div className="text-[16px] font-sans font-extrabold tabular-nums text-ink">{company.stage}</div>
          </div>
          <div className="py-3.5 px-4 border-r border-surface-border">
            <div className="text-2xs font-sans font-bold uppercase tracking-widest text-ink-faint mb-1">HQ</div>
            <div className="text-[16px] font-sans font-extrabold tabular-nums text-ink">{company.hq}</div>
          </div>
          <div className="py-3.5 px-4">
            <div className="text-2xs font-sans font-bold uppercase tracking-widest text-ink-faint mb-1">Founded</div>
            <div className="text-[16px] font-sans font-extrabold tabular-nums text-ink">{company.founded || "—"}</div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {company.interesting_angle && (
          <div className="area-angle border-l-[3px] border-cc-green rounded pl-5 pr-5 py-4 bg-surface">
            <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-2">The Current Angle</p>
            <p className="text-[13px] font-sans text-ink-secondary italic leading-relaxed">{company.interesting_angle}</p>
          </div>
        )}

        {leadership.length > 0 && (
          <div className="area-leadership border border-surface-border rounded px-4 py-4 bg-surface">
            <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">Leadership</p>
            <ul className="flex flex-col">
              {leadership.map((person, i) => (
                <li
                  key={person.slug}
                  className={`flex items-center gap-2.5 py-2 text-xs font-sans ${i < leadership.length - 1 ? "border-b border-surface-divider" : ""}`}
                >
                  <span
                    className="flex-none w-7 h-7 rounded-full flex items-center justify-center text-2xs font-bold"
                    style={{ background: style.placeholder, color: sectorColor }}
                  >
                    {initials(person.name)}
                  </span>
                  <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                    {person.linkedinUrl ? (
                      <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink hover:text-cc-green truncate">
                        {person.name}
                      </a>
                    ) : (
                      <span className="font-semibold text-ink truncate">{person.name}</span>
                    )}
                    <span className="text-ink-faint text-right flex-shrink-0">{person.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="area-links flex flex-col gap-4">
          <div className="border border-surface-border rounded px-4 py-4 bg-surface">
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

          {hasSnapshotExtras && (
            <div className="border border-surface-border rounded px-4 py-4 bg-surface">
              <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">Snapshot</p>
              <dl className="flex flex-col">
                {company.target_customer && (
                  <div className="flex justify-between gap-3 py-2 text-xs font-sans border-b border-surface-divider last:border-b-0 last:pb-0 first:pt-0">
                    <dt className="text-ink-faint flex-shrink-0">Target customer</dt>
                    <dd className="font-semibold text-ink text-right">{company.target_customer}</dd>
                  </div>
                )}
                {company.b_corp === "Yes" && (
                  <div className="flex justify-between gap-3 py-2 text-xs font-sans">
                    <dt className="text-ink-faint">B Corp</dt>
                    <dd className="font-semibold text-cc-green text-right">✓ Certified</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {company.lat && company.lng && (
          <div className="area-map border border-surface-border rounded px-4 py-4 bg-surface">
            <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">HQ location</p>
            <CompanyLocationMapPanel name={company.name} sector={company.sector} lat={company.lat} lng={company.lng} />
          </div>
        )}

        {related.length > 0 && (
          <div className="area-related border border-surface-border rounded px-4 py-4 bg-surface">
            <p className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">Related in Colorado {company.sector}</p>
            <ul className="flex flex-col">
              {related.map((r, i) => (
                <li key={r.name} className={i < related.length - 1 ? "border-b border-surface-divider" : ""}>
                  <Link
                    href={`/companies/${slugify(r.name)}`}
                    className="flex items-baseline justify-between gap-2 py-2 text-xs font-sans hover:text-cc-green"
                  >
                    <span className="font-semibold text-ink-secondary">{r.name}</span>
                    <span className="text-2xs text-ink-faint whitespace-nowrap">{r.hq}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(company.last_updated || sources.length > 0) && (
          <div className="area-sources pt-4 border-t border-surface-divider flex flex-wrap justify-between gap-2 text-2xs font-sans text-ink-faint">
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
    </div>
  );
}
