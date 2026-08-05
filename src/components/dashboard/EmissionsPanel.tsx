import type { DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

interface Props {
  sources: DashboardSource[];
}

export default function EmissionsPanel({ sources }: Props) {
  const target2025 = 109;
  const actual2025 = 115;
  const target2030 = 73.4;
  const projected2030 = 76.9;

  // Bar fill: how far actual is toward target (capped at 100%)
  const pct2025 = Math.min(100, Math.round((target2025 / actual2025) * 100));
  const pct2030 = Math.min(100, Math.round((target2030 / projected2030) * 100));

  return (
    <div className="border-t border-surface-border border-l border-surface-border px-4 md:px-5 py-4">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-4">
        Colorado emissions progress
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 2025 target */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-sans font-semibold text-ink">2025 statutory target</span>
            <span className="text-2xs font-sans text-ink-faint">26% below 2005</span>
          </div>
          <div className="relative h-2 bg-surface-border rounded-sm mb-2">
            <div
              className="absolute left-0 top-0 h-full bg-cc-green rounded-sm"
              style={{ width: `${pct2025}%` }}
            />
            {/* Target tick mark */}
            <div className="absolute top-[-3px] h-[14px] w-[2px] bg-ink" style={{ left: "95%" }} />
          </div>
          <div className="flex justify-between items-baseline mb-1">
            <div>
              <div className="text-2xs font-sans text-ink-faint">Target</div>
              <div className="text-xs font-sans font-bold text-ink">{target2025}M tons</div>
            </div>
            <div className="text-right">
              <div className="text-2xs font-sans text-ink-faint">Actual</div>
              <div className="text-xs font-sans font-bold" style={{ color: "#c47d1a" }}>{actual2025}M tons</div>
            </div>
          </div>
          <div className="text-2xs font-sans font-semibold" style={{ color: "#8a1a1a" }}>
            ⚠ Running ~2 years behind — expected 2027
          </div>
        </div>

        {/* 2030 target */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-sans font-semibold text-ink">2030 statutory target</span>
            <span className="text-2xs font-sans text-ink-faint">50% below 2005</span>
          </div>
          <div className="relative h-2 bg-surface-border rounded-sm mb-2">
            <div
              className="absolute left-0 top-0 h-full rounded-sm"
              style={{ width: `${pct2030}%`, background: "#c47d1a", opacity: 0.7 }}
            />
            <div className="absolute top-[-3px] h-[14px] w-[2px] bg-ink" style={{ left: "95%" }} />
          </div>
          <div className="flex justify-between items-baseline mb-1">
            <div>
              <div className="text-2xs font-sans text-ink-faint">Target</div>
              <div className="text-xs font-sans font-bold text-ink">{target2030}M tons</div>
            </div>
            <div className="text-right">
              <div className="text-2xs font-sans text-ink-faint">Projected</div>
              <div className="text-xs font-sans font-bold" style={{ color: "#c47d1a" }}>{projected2030}M tons</div>
            </div>
          </div>
          <div className="text-2xs font-sans font-semibold" style={{ color: "#8a1a1a" }}>
            ⚠ Tracking to 2031 — gap of 3.5M tons
          </div>
        </div>

      </div>

      <div className="mt-3">
        <SourceLinks sources={sources} />
      </div>
    </div>
  );
}
