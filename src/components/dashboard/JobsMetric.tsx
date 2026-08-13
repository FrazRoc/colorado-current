"use client";

import { useEffect, useState } from "react";

interface JobsData {
  total: number;
  sources: number;
  companies: { name: string; count: number }[];
}

export default function JobsMetric() {
  const [data, setData] = useState<JobsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="px-4 md:px-5 py-4 md:py-5 border-r border-surface-border border-b md:border-b-0 flex flex-col">
      <div className="text-3xl md:text-4xl font-serif font-extrabold text-ink leading-none tracking-tight">
        {data ? data.total : error ? "—" : <span className="text-ink-faint">—</span>}
      </div>
      <div className="text-2xs font-sans text-ink-muted uppercase tracking-widest mt-1.5 mb-1">
        Open jobs tracked
      </div>
      <div className="text-xs font-sans text-ink-muted">
        {data ? `Across ${data.sources} companies with public ATS` : "Loading..."}
      </div>
    </div>
  );
}
