"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

const deals = [
  { company: "Zero Homes", amount: "$16.8M", type: "Series A", date: "Feb 2026" },
  { company: "AtmosZero", amount: "$28.5M", type: "Series B", date: "Mar 2026" },
  { company: "Fervo Energy", amount: "FRVO ↗", type: "IPO", date: "May 2026", isIpo: true },
  { company: "Outrider", amount: "$62M", type: "Series D", date: "Oct 2024" },
  { company: "Koloma", amount: "$50M", type: "Series B ext", date: "Oct 2024" },
  { company: "Pivot Energy", amount: "$450M", type: "Project finance", date: "Nov 2024" },
  { company: "Xcimer Energy", amount: "$100M", type: "Series B", date: "2024" },
  { company: "Steelhead Composites", amount: "$57.5M", type: "Series B", date: "2024" },
  { company: "Emporia", amount: "$16M", type: "Strategic", date: "2025" },
  { company: "Lightship", amount: "$81M", type: "Series B", date: "2023" },
  { company: "Crusoe Energy Systems", amount: "$686M", type: "Series D", date: "2023" },
];

export default function FundingTicker() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...deals, ...deals];

  function pause() {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  }
  function play() {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  }

  return (
    <div
      className="border-t border-surface-border border-b border-surface-border bg-surface-dash overflow-hidden relative"
      style={{ height: 36 }}
      onMouseEnter={pause}
      onMouseLeave={play}
    >
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="absolute left-0 top-0 h-full flex items-center gap-1.5 border-r border-surface-border bg-surface-dash z-10"
        style={{ padding: "0 12px" }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2d8c5e", flexShrink: 0 }} />
        <span className="font-sans font-bold uppercase text-ink-faint" style={{ fontSize: 9, letterSpacing: "1.4px", whiteSpace: "nowrap" }}>
          Funding
        </span>
      </div>

      <div
        ref={trackRef}
        className="flex items-center h-full"
        style={{
          paddingLeft: 110,
          whiteSpace: "nowrap",
          animation: "ticker-scroll 60s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((deal, i) => (
          <span key={i} className="inline-flex items-center gap-1.5" style={{ paddingRight: 28 }}>
            <button
              onClick={() => router.push(`/companies?company=${encodeURIComponent(deal.company)}`)}
              className="font-sans font-semibold text-ink hover:text-cc-green transition-colors cursor-pointer bg-transparent border-0 p-0"
              style={{ fontSize: 12 }}
            >
              {deal.company}
            </button>
            <span
              className="font-sans font-semibold"
              style={{ fontSize: 12, color: deal.isIpo ? "#c47d1a" : "#2d8c5e" }}
            >
              {deal.amount}
            </span>
            <span className="font-sans text-ink-faint" style={{ fontSize: 11 }}>
              {deal.type} · {deal.date}
            </span>
            <span className="text-ink-faint" style={{ fontSize: 14, paddingLeft: 4 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
