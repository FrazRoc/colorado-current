import type { SectorCount, DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

interface Props {
  sectors: SectorCount[];
  sources: DashboardSource[];
}

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

const TOP_N = 6;

export default function SectorChart({ sectors, sources }: Props) {
  const sorted = [...sectors].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const max = top[0]?.count ?? 1;

  return (
    <div className="px-4 md:px-5 py-4 border-r border-surface-border">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-4">
        Companies by Industry
      </div>

      <div className="flex flex-col gap-2.5 mb-4">
        {top.map((sector) => {
          const color = SECTOR_COLORS[sector.name] || "#888780";
          const widthPct = (sector.count / max) * 100;
          return (
            <div key={sector.name} className="flex items-center gap-3">
              <span className="text-xs font-sans text-ink-secondary w-[168px] flex-shrink-0 truncate">
                {sector.name}
              </span>
              <div className="flex-1 h-2 bg-surface-border rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all"
                  style={{ width: `${widthPct}%`, background: color }}
                />
              </div>
              <span className="text-xs font-sans font-bold text-ink w-5 text-right flex-shrink-0">
                {sector.count}
              </span>
            </div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="pt-3 border-t border-surface-border">
          <div className="text-2xs font-sans text-ink-faint uppercase tracking-widest mb-2">
            Also tracking
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {rest.map((sector) => {
              const color = SECTOR_COLORS[sector.name] || "#888780";
              return (
                <span key={sector.name} className="flex items-center gap-1.5 text-xs font-sans text-ink-muted">
                  <span
                    className="rounded-full flex-shrink-0"
                    style={{ width: 7, height: 7, background: color }}
                  />
                  {sector.name} <span className="font-semibold text-ink">({sector.count})</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3">
        <SourceLinks sources={sources} />
      </div>
    </div>
  );
}
