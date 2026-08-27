"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import type { Company } from "@/types";
import { getSectorColor } from "@/lib/sectors";
import { slugify } from "@/lib/companies";

interface Props {
  companies: Company[];
}

// Deal-level history (amount/type/date per round) isn't in the Sheet — it
// only tracks each company's current cumulative funding as free text, not
// an itemized log of rounds. This list stays hand-curated; the sector dot
// per deal below is the part that comes from the live Sheet.
const deals = [
  { company: "Zero Homes", amount: "$16.8M", type: "Series A", date: "Feb 2026" },
  { company: "AtmosZero", amount: "$28.5M", type: "Series B", date: "Mar 2026" },
  { company: "Fervo Energy", amount: "FRVO ↗", type: "IPO", date: "May 2026", isIpo: true },
  { company: "Jetson Home", amount: "$50M", type: "Series A", date: "Jan 2026" },
  { company: "Outrider", amount: "$62M", type: "Series D", date: "Oct 2024" },
  { company: "Koloma", amount: "$50M", type: "Series B ext", date: "Oct 2024" },
  { company: "Pivot Energy", amount: "$450M", type: "Project finance", date: "Nov 2024" },
  { company: "Xcimer Energy", amount: "$100M", type: "Series B", date: "2024" },
  { company: "Forge Nano", amount: "$40M", type: "Growth", date: "Apr 2025" },
  { company: "LongPath Technologies", amount: "$162.4M", type: "DOE loan", date: "Oct 2024" },
  { company: "Steelhead Composites", amount: "$57.5M", type: "Series B", date: "2024" },
  { company: "Emporia", amount: "$16M", type: "Strategic", date: "2025" },
  { company: "Lightship", amount: "$81M", type: "Series B", date: "2023" },
  { company: "Crusoe Energy Systems", amount: "$600M", type: "Series D", date: "2023" },
  { company: "King Energy", amount: "$10M", type: "Seed", date: "Oct 2024" },
  { company: "ION Clean Energy", amount: "$45M", type: "Series A", date: "Apr 2024" },
];

export default function FundingTicker({ companies }: Props) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...deals, ...deals];

  const sectorByCompany = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of companies) map.set(c.name, c.sector);
    return map;
  }, [companies]);

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
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: getSectorColor(sectorByCompany.get(deal.company) ?? ""),
                flexShrink: 0,
              }}
              title={sectorByCompany.get(deal.company)}
            />
            <button
              onClick={() => router.push(`/companies/${slugify(deal.company)}`)}
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
