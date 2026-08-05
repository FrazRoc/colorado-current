import type { DashboardMetric, DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

const SOURCE_KEYS = [
  "trackedCompanies",
  "ecosystemFunding",
  "coal",
] as const;

interface Props {
  metrics: DashboardMetric[];
  sources: Record<string, DashboardSource[]>;
  companyCount?: number;
}

export default function MetricsRow({ metrics, sources, companyCount }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 border-t-[3px] border-ink border-l border-surface-border">
      {metrics.map((m, i) => {
        // Override company count dynamically if provided
        const value = i === 0 && companyCount !== undefined
          ? String(companyCount)
          : m.value;

        // Coal metric gets red warning styling
        const isCoal = i === 2;

        return (
          <div
            key={i}
            className="px-4 md:px-5 py-4 md:py-5 border-r border-surface-border border-b md:border-b-0 flex flex-col"
          >
            <div className="text-3xl md:text-4xl font-serif font-extrabold text-ink leading-none tracking-tight">
              {value}
            </div>
            <div className="text-2xs font-sans text-ink-muted uppercase tracking-widest mt-1.5 mb-1">
              {m.label}
            </div>
            {m.delta && (
              <div className={`text-xs font-sans font-semibold ${
                isCoal
                  ? "text-red-700"
                  : m.deltaPositive
                  ? "text-cc-green"
                  : "text-ink-muted"
              }`}>
                {m.delta}
              </div>
            )}
            <div className="mt-auto pt-2">
              <SourceLinks sources={sources[SOURCE_KEYS[i]] || []} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
