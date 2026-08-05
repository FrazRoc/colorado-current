import type { DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

interface Props {
  rebates: number;
  sources: DashboardSource[];
}

export default function HeatPumpPanel({ rebates, sources }: Props) {
  return (
    <div className="px-4 md:px-5 py-4 border-r border-surface-border flex flex-col">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">
        Heat pump momentum
      </div>
      <div className="text-3xl font-serif font-extrabold text-ink leading-none tracking-tight mb-1">
        {rebates.toLocaleString()}
      </div>
      <div className="text-xs font-sans text-ink-muted mb-1">
        Xcel rebates in 2025 · $57M total
      </div>
      <div className="text-xs font-sans font-semibold text-cc-green mb-3">
        ↑ nearly 2× vs 2024
      </div>
      <div className="mt-auto">
        <SourceLinks sources={sources} />
      </div>
    </div>
  );
}
