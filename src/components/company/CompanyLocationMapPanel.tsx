"use client";

import dynamic from "next/dynamic";

const CompanyLocationMap = dynamic(() => import("@/components/company/CompanyLocationMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 160, background: "var(--color-surface-dash)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="text-xs font-sans text-ink-muted">Loading map...</span>
    </div>
  ),
});

interface Props {
  name: string;
  sector: string;
  lat: number;
  lng: number;
}

export default function CompanyLocationMapPanel(props: Props) {
  return <CompanyLocationMap {...props} />;
}
