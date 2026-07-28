import type { Legislation } from "@/types";
import { LEGISLATION_STYLES } from "@/lib/sectors";

interface Props {
  legislation: Legislation[];
}

export default function PolicyPanel({ legislation }: Props) {
  return (
    <div className="px-5 py-5">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-3.5">
        CO legislation
      </div>
      <div className="space-y-0">
        {legislation.map((item, i) => {
          const style = LEGISLATION_STYLES[item.status] || {
            bg: "#f5f5f3",
            text: "#444",
          };
          return (
            <div
              key={i}
              className="flex items-start gap-2 py-1.5 border-b border-surface-divider last:border-b-0"
            >
              <span
                className="text-tag font-sans font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm flex-shrink-0 mt-0.5"
                style={{ background: style.bg, color: style.text }}
              >
                {item.status}
              </span>
              <span className="text-xs font-sans text-ink-secondary leading-snug">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
