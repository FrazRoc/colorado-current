"use client";

import { useState, useMemo } from "react";
import type { Company } from "@/types";
import { getSectorStyle } from "@/lib/sectors";

interface Props {
  companies: Company[];
}

const ALL = "All";

export default function CompanyTable({ companies }: Props) {
  const [sectorFilter, setSectorFilter] = useState(ALL);
  const [stageFilter, setStageFilter] = useState(ALL);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sectors = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((c) => c.sector))).sort()],
    [companies]
  );

  const stages = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((c) => c.stage))).sort()],
    [companies]
  );

  const filtered = useMemo(() => {
    return companies.filter((c) => {
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
  }, [companies, sectorFilter, stageFilter, search]);

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-surface-border rounded px-3 py-1.5 text-sm font-sans text-ink placeholder-ink-faint focus:outline-none focus:border-cc-green w-56"
        />
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="border border-surface-border rounded px-3 py-1.5 text-sm font-sans text-ink focus:outline-none focus:border-cc-green bg-white"
        >
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s === ALL ? "All sectors" : s}
            </option>
          ))}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border border-surface-border rounded px-3 py-1.5 text-sm font-sans text-ink focus:outline-none focus:border-cc-green bg-white"
        >
          {stages.map((s) => (
            <option key={s} value={s}>
              {s === ALL ? "All stages" : s}
            </option>
          ))}
        </select>
        <span className="text-xs font-sans text-ink-muted ml-auto">
          {filtered.length} {filtered.length === 1 ? "company" : "companies"}
        </span>
      </div>

      {/* Table */}
      <div className="border border-surface-border rounded overflow-hidden">
        <table className="w-full text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b-2 border-ink bg-surface-dash">
              <th className="text-left px-4 py-3 text-2xs font-bold uppercase tracking-widest text-ink-muted">Company</th>
              <th className="text-left px-4 py-3 text-2xs font-bold uppercase tracking-widest text-ink-muted">Sector</th>
              <th className="text-left px-4 py-3 text-2xs font-bold uppercase tracking-widest text-ink-muted">Stage</th>
              <th className="text-left px-4 py-3 text-2xs font-bold uppercase tracking-widest text-ink-muted">Funding</th>
              <th className="text-left px-4 py-3 text-2xs font-bold uppercase tracking-widest text-ink-muted">HQ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-muted text-sm">
                  No companies match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((company) => {
                const style = getSectorStyle(company.sector);
                const isExpanded = expanded === company.name;
                return (
                  <>
                    <tr
                      key={company.name}
                      className="border-b border-surface-divider hover:bg-surface-dash cursor-pointer transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : company.name)}
                    >
                      <td className="px-4 py-3 font-semibold text-ink">
                        {company.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-tag font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm"
                          style={{ background: style.bg, color: style.text }}
                        >
                          {company.sector}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">{company.stage}</td>
                      <td className="px-4 py-3 font-semibold text-cc-green">{company.funding}</td>
                      <td className="px-4 py-3 text-ink-secondary">{company.hq}</td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${company.name}-expanded`} className="bg-surface-dash border-b border-surface-divider">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="max-w-2xl">
                            <p className="text-sm text-ink-secondary leading-relaxed mb-2">
                              {company.what_they_do}
                            </p>
                            {company.interesting_angle && (
                              <p className="text-xs text-ink-muted leading-relaxed border-l-2 border-cc-green pl-3">
                                {company.interesting_angle}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
