import type { DashboardMetric } from "@/types";

interface Props {
  metrics: DashboardMetric[];
}

export default function MetricsRow({ metrics }: Props) {
  return (
    <div className="grid grid-cols-4 border-t-[3px] border-ink border-l border-surface-border">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="px-5 py-5 border-r border-surface-border last:border-r-0"
        >
          <div className="text-4xl font-serif font-extrabold text-ink leading-none tracking-tight">
            {m.value}
          </div>
          <div className="text-2xs font-sans text-ink-muted uppercase tracking-widest mt-1.5 mb-1">
            {m.label}
          </div>
          {m.delta && (
            <div
              className={`text-xs font-sans font-semibold ${
                m.deltaPositive ? "text-cc-green" : "text-ink-muted"
              }`}
            >
              {m.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
