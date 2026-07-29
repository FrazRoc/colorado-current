import type { FundingRound, DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

interface Props {
  rounds: FundingRound[];
  sources: DashboardSource[];
}

export default function FundingPanel({ rounds, sources }: Props) {
  return (
    <div className="px-5 py-5 border-r border-surface-border flex flex-col">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3.5">
        Recent funding
      </div>
      <div className="space-y-0 flex-1">
        {rounds.map((r, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between py-1.5 border-b border-surface-divider last:border-b-0"
          >
            <div>
              <div className="text-xs font-sans font-semibold text-ink">
                {r.company}
              </div>
              <div className="text-2xs font-sans text-ink-faint">
                {r.type} · {r.date}
              </div>
            </div>
            <div
              className={`text-sm font-sans font-extrabold ml-3 flex-shrink-0 ${
                r.isIpo ? "text-cc-amber" : "text-cc-green"
              }`}
            >
              {r.amount}
            </div>
          </div>
        ))}
      </div>
      <SourceLinks sources={sources} />
    </div>
  );
}
