"use client";

import dynamic from "next/dynamic";
import type { Company } from "@/types";
import { SECTOR_COLORS, getSectorColor } from "@/lib/sectors";

const CompanyMap = dynamic(() => import("@/components/dashboard/CompanyMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 280, background: "var(--surface-dash)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="text-xs font-sans text-ink-muted">Loading map...</span>
    </div>
  ),
});

interface Props {
  companies: Company[];
}

export default function MapPanel({ companies }: Props) {
  const sectors = Object.keys(SECTOR_COLORS);

  return (
    <div className="px-4 py-4 border-r border-surface-border flex flex-col">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">
        Company HQ locations
      </div>
      <CompanyMap companies={companies} />
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
        {sectors.map((sector) => (
          <div key={sector} className="flex items-center gap-1">
            <div
              className="rounded-full flex-shrink-0"
              style={{ width: 6, height: 6, background: getSectorColor(sector) }}
            />
            <span style={{ fontSize: "9px" }} className="font-sans text-ink-muted uppercase tracking-wide">{sector}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
