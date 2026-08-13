"use client";

import { useRef, useEffect } from "react";
import type { DashboardSource } from "@/types";
import SourceLinks from "./SourceLinks";

interface Props {
  sources: DashboardSource[];
}

export default function EmissionsPanel({ sources }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    import("chart.js").then((ChartModule) => {
      const { Chart, registerables } = ChartModule;
      Chart.register(...registerables);

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const grid = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
      const muted = "#898781";

      const years: number[] = [];
      for (let y = 2015; y <= 2035; y++) years.push(y);

      const hPts: Record<number, number> = { 2015: 143, 2018: 138, 2020: 132, 2022: 130, 2023: 129 };
      const hKeys = Object.keys(hPts).map(Number).sort((a, b) => a - b);
      function ih(y: number): number | null {
        if (y > 2023) return null;
        for (let i = 0; i < hKeys.length - 1; i++) {
          if (y >= hKeys[i] && y <= hKeys[i + 1]) {
            const t = (y - hKeys[i]) / (hKeys[i + 1] - hKeys[i]);
            return hPts[hKeys[i]] + t * (hPts[hKeys[i + 1]] - hPts[hKeys[i]]);
          }
        }
        return hPts[y] ?? null;
      }

      const pPts: Record<number, number> = { 2023: 129, 2025: 115, 2027: 100, 2028: 95, 2030: 83, 2032: 76, 2035: 70 };
      const pKeys = Object.keys(pPts).map(Number).sort((a, b) => a - b);
      function ip(y: number): number | null {
        if (y < 2023) return null;
        for (let i = 0; i < pKeys.length - 1; i++) {
          if (y >= pKeys[i] && y <= pKeys[i + 1]) {
            const t = (y - pKeys[i]) / (pKeys[i + 1] - pKeys[i]);
            return pPts[pKeys[i]] + t * (pPts[pKeys[i + 1]] - pPts[pKeys[i]]);
          }
        }
        return null;
      }

      function tgt(y: number): number | null {
        if (y < 2025) return null;
        if (y <= 2030) return 113 + (76.5 - 113) * (y - 2025) / 5;
        if (y <= 2035) return 76.5 + (53.6 - 76.5) * (y - 2030) / 5;
        return null;
      }

      const actual   = years.map(y => y <= 2023 ? ih(y) : null);
      const proj     = years.map(y => y >= 2023 ? ip(y) : null);
      const gapUpper = years.map(y => y >= 2025 ? ip(y) : null);
      const gapLower = years.map(y => tgt(y));
      const tgtDots  = years.map(y => [2025, 2030, 2035].includes(y) ? tgt(y) : null);

      const annotPlugin = {
        id: "ann2019",
        afterDraw(chart: any) {
          const ctx = chart.ctx, xs = chart.scales.x, ys = chart.scales.y;
          const idx = years.indexOf(2019);
          if (idx === -1) return;
          const x = xs.getPixelForValue(idx);
          const yTop = ys.getPixelForValue(ys.max);
          const yBot = ys.getPixelForValue(ys.min);
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([4, 3]);
          ctx.strokeStyle = "rgba(0,0,0,0.22)";
          ctx.lineWidth = 1;
          ctx.moveTo(x, yTop); ctx.lineTo(x, yBot); ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = "10px system-ui,sans-serif";
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.textAlign = "center";
          ctx.fillText("HB 19-1261", x, yTop + 11);
          ctx.restore();
        },
      };

      chartRef.current = new Chart(canvasRef.current!, {
        type: "line",
        plugins: [annotPlugin],
        data: {
          labels: years,
          datasets: [
            { label: "_gU", data: gapUpper, borderColor: "transparent", backgroundColor: "rgba(163,45,45,0.15)", pointRadius: 0, tension: 0, fill: "+1", spanGaps: false, order: 10 } as any,
            { label: "_gL", data: gapLower, borderColor: "#2d8c5e", borderWidth: 1.5, borderDash: [4, 3], backgroundColor: "transparent", pointRadius: 0, tension: 0, fill: false, spanGaps: false, order: 3 } as any,
            { label: "Actual", data: actual, borderColor: "#c47d1a", backgroundColor: "transparent", borderWidth: 2.5, pointRadius: 0, tension: 0.3, fill: false, spanGaps: false, order: 2 },
            { label: "Projected", data: proj, borderColor: "#c47d1a", backgroundColor: "transparent", borderWidth: 2.5, borderDash: [6, 4], pointRadius: 0, tension: 0, fill: false, spanGaps: false, order: 2 } as any,
            { label: "Targets", data: tgtDots, type: "scatter", borderColor: "#2d8c5e", backgroundColor: "#2d8c5e", pointRadius: 3, showLine: false, order: 1 } as any,
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              filter: (i: any) => !i.dataset.label.startsWith("_"),
              callbacks: {
                label: (ctx: any): string | void => {
                  if (ctx.raw === null || ctx.raw === undefined) return;
                  const map: Record<string, string> = { Actual: "Actual", Projected: "Projected", Targets: "Target" };
                  const n = map[ctx.dataset.label];
                  if (!n) return;
                  return `${n}: ${Math.round(ctx.raw)}M tons`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: { color: muted, font: { size: 11 }, maxRotation: 0, callback: (_: any, i: number) => [2015, 2019, 2020, 2025, 2030, 2035].includes(years[i]) ? years[i] : "" },
              grid: { color: grid },
              border: { color: grid },
            },
            y: {
              min: 45, max: 155,
              ticks: { color: muted, font: { size: 11 }, stepSize: 25, callback: (v: any) => v + "M" },
              grid: { color: grid },
              border: { color: grid },
              title: { display: true, text: "MMT CO₂e", color: muted, font: { size: 11 } },
            },
          },
        },
      });
    });

    return () => {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, []);

  return (
    <div className="border-t border-surface-border border-l border-surface-border px-4 md:px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint">
          Colorado emissions progress
        </div>
        {/* Coal warning — moved from Row 1 */}
        <div className="text-xs font-sans font-semibold" style={{ color: "#8a1a1a" }}>
          ⚠ Coal generation 24.7% · Retirements delayed to 2031
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: "220px" }}>
        <canvas ref={canvasRef} role="img" aria-label="Colorado GHG emissions trajectory vs statutory targets 2015–2035" />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-2">
        <span className="flex items-center gap-1.5 text-2xs font-sans text-ink-muted">
          <span style={{ display: "inline-block", width: 16, height: 2.5, background: "#c47d1a" }} />
          Actual
        </span>
        <span className="flex items-center gap-1.5 text-2xs font-sans text-ink-muted">
          <span style={{ display: "inline-block", width: 16, height: 0, borderTop: "2.5px dashed #c47d1a" }} />
          Projected
        </span>
        <span className="flex items-center gap-1.5 text-2xs font-sans text-ink-muted">
          <span style={{ display: "inline-block", width: 8, height: 8, background: "#2d8c5e", borderRadius: "50%" }} />
          Statutory targets
        </span>
        <span className="flex items-center gap-1.5 text-2xs font-sans text-ink-muted">
          <span style={{ display: "inline-block", width: 12, height: 8, background: "rgba(163,45,45,0.15)", border: "1px solid rgba(163,45,45,0.3)", borderRadius: 2 }} />
          Gap
        </span>
      </div>

      <SourceLinks sources={sources} />
    </div>
  );
}
