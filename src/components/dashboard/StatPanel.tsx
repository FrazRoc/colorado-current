interface Props {
  vppMw: number;
  vppGoal: number;
  heatPumpRebates: number;
}

export default function StatPanel({ vppMw, vppGoal, heatPumpRebates }: Props) {
  const pct = Math.round((vppMw / vppGoal) * 100);

  return (
    <div className="grid grid-cols-2 border-t border-surface-border border-l border-surface-border">
      {/* VPP */}
      <div className="px-5 py-4 border-r border-surface-border border-b border-surface-border">
        <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">
          Xcel VPP program
        </div>
        <div className="flex items-baseline gap-3 mb-2">
          <div>
            <span className="text-2xl font-serif font-extrabold text-ink">{vppMw}</span>
            <span className="text-xs font-sans text-ink-muted ml-1">MW enrolled</span>
          </div>
          <div>
            <span className="text-xl font-serif font-extrabold text-cc-green">{vppGoal}</span>
            <span className="text-xs font-sans text-ink-muted ml-1">MW goal</span>
          </div>
        </div>
        <div className="h-1.5 bg-surface-border rounded-sm overflow-hidden mb-1.5">
          <div
            className="h-full bg-ink rounded-sm"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-2xs font-sans text-ink-faint">
          {pct}% of 2030 target · ~2,000 home batteries
        </div>
      </div>

      {/* Heat pumps */}
      <div className="px-5 py-4 border-b border-surface-border">
        <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3">
          Heat pump momentum
        </div>
        <div className="text-2xl font-serif font-extrabold text-ink mb-1">
          {heatPumpRebates.toLocaleString()}
        </div>
        <div className="text-xs font-sans text-ink-muted mb-2">
          Xcel rebates in 2025 · $57M total
        </div>
        <div className="text-xs font-sans font-semibold text-cc-green">
          ↑ nearly 2× vs 2024
        </div>
      </div>
    </div>
  );
}
