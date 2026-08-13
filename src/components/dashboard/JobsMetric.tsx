"use client";

import { useEffect, useState } from "react";
import SourceLinks from "./SourceLinks";

export default function JobsMetric() {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setTotal(d.total))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="px-4 md:px-5 py-4 md:py-5 border-r border-surface-border flex flex-col">
      <div className="text-3xl md:text-4xl font-serif font-extrabold text-ink leading-none tracking-tight">
        {total === null && !error ? (
          <span className="text-ink-faint">—</span>
        ) : error ? (
          <span className="text-ink-faint">—</span>
        ) : (
          total
        )}
      </div>
      <div className="text-2xs font-sans text-ink-muted uppercase tracking-widest mt-1.5 mb-1">
        Open jobs tracked
      </div>
      <div className="text-xs font-sans text-ink-muted">
        Across {total !== null ? "10" : "—"} companies with public ATS
      </div>
    </div>
  );
}
