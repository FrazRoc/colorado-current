"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Company } from "@/types";
import { getSectorStyle } from "@/lib/sectors";

interface Props {
  companies: Company[];
}

const ALL = "All";

type SortKey = "name" | "sector" | "stage" | "funding" | "hq";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`ml-1 inline-block ${active ? "text-ink" : "text-ink-faint"}`}>
      {active ? (dir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );
}

export default function CompanyTable({ companies }: Props) {
  const searchParams = useSearchParams();
  const [sectorFilter, setSectorFilter] = useState(ALL);
  const [stageFilter, setStageFilter] = useState(ALL);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const expandedRef = useRef<HTMLTableRowElement | HTMLDivElement | null>(null);

  // Auto-expand company from query param (e.g. ?company=Uplight from map click)
  useEffect(() => {
    const companyParam = searchParams.get("company");
    if (companyParam) {
      setExpanded(companyParam);
      // Clear filters so the company is visible
      setSectorFilter(ALL);
      setStageFilter(ALL);
      setSearch("");
      // Scroll to expanded row after render
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [searchParams]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sectors = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((c) => c.sector))).sort()],
    [companies]
  );

  const stages = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((c) => c.stage))).sort()],
    [companies]
  );

  const filtered = useMemo(() => {
    const result = companies.filter((c) => {
      if (sectorFilter !== ALL && c.sector !== sectorFilter) return false;
      if (stageFilter !== ALL && c.stage !== stageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.hq.toLowerCase().includes(q) ||
          c.what_they_do.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return result.sort((a, b) => {
      const valA = (a[sortKey] ?? "").toLowerCase();
      const valB = (b[sortKey] ?? "").toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [companies, sectorFilter, stageFilter, search, sortKey, sortDir]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-surface-border rounded px-3 py-2 text-sm font-sans text-ink placeholder-ink-faint focus:outline-none focus:border-cc-green w-full sm:w-56"
        />
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="border border-surface-border rounded px-3 py-2 text-sm font-sans text-ink focus:outline-none focus:border-cc-green bg-white"
        >
          {sectors.map((s) => (
            <option key={s} value={s}>{s === ALL ? "All sectors" : s}</option>
          ))}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border border-surface-border rounded px-3 py-2 text-sm font-sans text-ink focus:outline-none focus:border-cc-green bg-white"
        >
          {stages.map((s) => (
            <option key={s} value={s}>{s === ALL ? "All stages" : s}</option>
          ))}
        </select>
        <span className="text-xs font-sans text-ink-muted sm:ml-auto">
          {filtered.length} {filtered.length === 1 ? "company" : "companies"}
        </span>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-sm font-sans text-ink-muted text-center py-8">No companies match your filters.</p>
        ) : (
          filtered.map((company) => {
            const style = getSectorStyle(company.sector);
            const isExpanded = expanded === company.name;
            return (
              <div
                key={company.name}
                ref={isExpanded ? (el) => { expandedRef.current = el; } : null}
                className="border border-surface-border rounded overflow-hidden"
                onClick={() => setExpanded(isExpanded ? null : company.name)}
              >
                <div className="px-4 py-3 bg-surface cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-sans font-semibold text-ink">{company.name}</span>
                    <span
                      className="text-tag font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm flex-shrink-0"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {company.sector}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-sans text-cc-green font-semibold">{company.funding}</span>
                    <span className="text-xs font-sans text-ink-muted">{company.hq}</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-4 py-3 bg-surface-dash border-t border-surface-divider" onClick={(e) => e.stopPropagation()}>
                    <p className="text-sm font-sans text-ink-secondary leading-relaxed mb-2">{company.what_they_do}</p>
                    {company.interesting_angle && (
                      <p className="text-xs font-sans text-ink-muted leading-relaxed border-l-2 border-cc-green pl-3 mb-3">{company.interesting_angle}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                      {company.target_customer && (
                        <span className="text-2xs font-sans text-ink-muted"><span className="font-semibold text-ink-secondary">Customers:</span> {company.target_customer}</span>
                      )}
                      {company.b_corp === "Yes" && (
                        <span className="text-2xs font-sans font-semibold text-cc-green">✓ B Corp</span>
                      )}
                      {company.last_updated && (
                        <span className="text-2xs font-sans text-ink-faint">Updated {new Date(company.last_updated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-cc-green hover:underline font-semibold">Website →</a>
                      )}
                      {company.sources && company.sources.split(",").map((s, i) => (
                        <a key={i} href={s.trim()} target="_blank" rel="noopener noreferrer" className="text-2xs text-ink-faint hover:text-cc-green">[{i + 1}]</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-surface-border rounded overflow-hidden">
        <table className="w-full text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b-2 border-ink bg-surface-dash">
              {(["name", "sector", "stage", "funding", "hq"] as SortKey[]).map((key) => (
                <th
                  key={key}
                  className="text-left px-4 py-3 text-2xs font-bold uppercase tracking-widest text-ink-muted cursor-pointer hover:text-ink select-none"
                  onClick={() => handleSort(key)}
                >
                  {key === "hq" ? "HQ" : key.charAt(0).toUpperCase() + key.slice(1)}
                  <SortIcon active={sortKey === key} dir={sortDir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-muted text-sm">No companies match your filters.</td>
              </tr>
            ) : (
              filtered.map((company) => {
                const style = getSectorStyle(company.sector);
                const isExpanded = expanded === company.name;
                return (
                  <tr key={company.name}>
                    <td colSpan={5} className="p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr
                            ref={isExpanded ? (el) => { expandedRef.current = el; } : null}
                            className="border-b border-surface-divider hover:bg-surface-dash cursor-pointer transition-colors"
                            onClick={() => setExpanded(isExpanded ? null : company.name)}
                          >
                            <td className="px-4 py-3 font-semibold text-ink w-1/5">{company.name}</td>
                            <td className="px-4 py-3 w-1/5">
                              <span className="text-tag font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm" style={{ background: style.bg, color: style.text }}>
                                {company.sector}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ink-secondary w-1/5">{company.stage}</td>
                            <td className="px-4 py-3 font-semibold text-cc-green w-1/5">{company.funding}</td>
                            <td className="px-4 py-3 text-ink-secondary w-1/5">{company.hq}</td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-surface-dash border-b border-surface-divider">
                              <td colSpan={5} className="px-4 py-4">
                                <div className="max-w-3xl">
                                  <p className="text-sm text-ink-secondary leading-relaxed mb-2">{company.what_they_do}</p>
                                  {company.interesting_angle && (
                                    <p className="text-xs text-ink-muted leading-relaxed border-l-2 border-cc-green pl-3 mb-3">{company.interesting_angle}</p>
                                  )}
                                  <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2">
                                    {company.target_customer && (
                                      <span className="text-2xs font-sans text-ink-muted"><span className="font-semibold text-ink-secondary">Customers:</span> {company.target_customer}</span>
                                    )}
                                    {company.founded && (
                                      <span className="text-2xs font-sans text-ink-muted"><span className="font-semibold text-ink-secondary">Founded:</span> {company.founded}</span>
                                    )}
                                    {company.b_corp === "Yes" && (
                                      <span className="text-2xs font-sans font-semibold text-cc-green">✓ Certified B Corp</span>
                                    )}
                                    {company.last_updated && (
                                      <span className="text-2xs font-sans text-ink-faint">Updated {new Date(company.last_updated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    {company.website && (
                                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-cc-green hover:underline font-semibold">Website →</a>
                                    )}
                                    {company.sources && (
                                      <span className="text-2xs text-ink-faint">
                                        Sources:{" "}
                                        {company.sources.split(",").map((s, i) => (
                                          <a key={i} href={s.trim()} target="_blank" rel="noopener noreferrer" className="text-cc-green hover:underline mx-0.5">[{i + 1}]</a>
                                        ))}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
