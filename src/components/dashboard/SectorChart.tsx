import type { DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

interface Props {
  sectors: { name: string; count: number }[];
  sources: DashboardSource[];
}

export default function SectorChart({ sectors, sources }: Props) {
  const max = Math.max(...sectors.map((s) => s.count));

  return (
    <div className="px-5 py-5 border-r border-surface-border flex flex-col">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3.5">
        Companies by sector
      </div>
      <div className="space-y-2.5 flex-1">
        {sectors.map((s) => (
          <div key={s.name} className="flex items-center gap-2.5">
            <div className="text-xs font-sans text-ink-secondary w-36 flex-shrink-0">
              {s.name}
            </div>
            <div className="flex-1 h-2 bg-surface-border rounded-sm overflow-hidden">
              <div
                className="h-full bg-cc-green rounded-sm transition-all"
                style={{ width: `${(s.count / max) * 100}%` }}
              />
            </div>
            <div className="text-xs font-sans font-bold text-ink w-4 text-right flex-shrink-0">
              {s.count}
            </div>
          </div>
        ))}
      </div>
      <SourceLinks sources={sources} />
    </div>
  );
}
