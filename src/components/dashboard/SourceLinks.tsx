import type { DashboardSource } from "@/types";

interface Props {
  sources: DashboardSource[];
}

export default function SourceLinks({ sources }: Props) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-2.5 border-t border-surface-divider">
      <span className="text-2xs font-sans text-ink-faint uppercase tracking-widest mr-1.5">
        Sources:
      </span>
      {sources.map((s, i) => (
        <span key={i}>
          <a
            href={s.url}
            target={s.url.startsWith("http") ? "_blank" : undefined}
            rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-2xs font-sans text-cc-green hover:underline"
          >
            {s.label}
          </a>
          {i < sources.length - 1 && (
            <span className="text-ink-faint text-2xs mx-1">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
