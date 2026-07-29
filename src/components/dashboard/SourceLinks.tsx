import type { DashboardSource } from "@/types";

interface Props {
  sources: DashboardSource[];
}

export default function SourceLinks({ sources }: Props) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5">
      {sources.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target={s.url.startsWith("http") ? "_blank" : undefined}
          rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-ink-faint hover:text-cc-green transition-colors"
          style={{ fontSize: "9px", letterSpacing: "0.02em" }}
          title={s.label}
        >
          [{i + 1}]
        </a>
      ))}
    </div>
  );
}
