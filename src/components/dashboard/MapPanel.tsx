"use client";

import dynamic from "next/dynamic";
import type { Company } from "@/types";

const CompanyMap = dynamic(() => import("@/components/dashboard/CompanyMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 280, background: "var(--surface-dash)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="text-xs font-sans text-ink-muted">Loading map...</span>
    </div>
  ),
});

const SECTOR_COLORS: Record<string, string> = {
  "Solar & Storage": "#BA7517",
  "Grid Software": "#185FA5",
  "Geothermal": "#0F6E56",
  "Home Electrification": "#3B6D11",
  "Hydrogen": "#534AB7",
  "Industrial Decarb": "#993C1D",
  "EV & Transportation": "#993556",
  "Carbon Removal": "#888780",
  "Fusion": "#A32D2D",
  "Research / Policy": "#444441",
  "Low-Carbon Materials": "#7A5C3E",
  "Agriculture Tech": "#6B8E23",
  "Methane/Emissions Monitoring": "#C0392B",
  "Circular Economy/Recycling": "#1F9E89",
  "Aviation": "#2E6F95",
};

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
              style={{ width: 6, height: 6, background: SECTOR_COLORS[sector] }}
            />
            <span style={{ fontSize: "9px" }} className="font-sans text-ink-muted uppercase tracking-wide">{sector}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
