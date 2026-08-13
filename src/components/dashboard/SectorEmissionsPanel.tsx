"use client";

import { useEffect, useRef } from "react";

export default function SectorEmissionsPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    import("chart.js").then((ChartModule) => {
      const { Chart, registerables } = ChartModule;
      Chart.register(...registerables);

      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const grid = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
      const muted = "#898781";

      const sectors = ["Electric Power", "Transportation", "Buildings", "Oil & Gas", "Agriculture", "Coal Mining"];
      const data2005 = [42.20, 29.28, 25.03, 15.73, 14.21, 8.67];
      const data2023 = [28.25, 29.38, 25.42, 11.90, 14.93, 1.80];

      // One color per sector from CC palette
      const sectorColors = [
        "#185FA5", // Electric Power — blue
        "#993556", // Transportation — pink/red
        "#3B6D11", // Buildings — dark green
        "#534AB7", // Oil & Gas — purple
        "#c47d1a", // Agriculture — amber
        "#2d8c5e", // Coal Mining — cc-green
      ];

      // Percentage change labels plugin
      const pctLabelPlugin = {
        id: "pctLabels",
        afterDatasetsDraw(chart: any) {
          const { ctx, scales } = chart;
          const xScale = scales.x;
          const yScale = scales.y;

          ctx.save();
          ctx.font = "bold 9px system-ui, sans-serif";
          ctx.textAlign = "center";

          data2023.forEach((v, i) => {
            const diff = v - data2005[i];
            const pct = Math.round((diff / data2005[i]) * 100);
            const sign = pct > 0 ? "+" : "";
            const label = `${sign}${pct}%`;

            const x = xScale.getPixelForValue(i);
            const yTop = yScale.getPixelForValue(v);

            ctx.fillStyle = pct < 0 ? "#2d8c5e" : pct > 0 ? "#c47d1a" : "#888780";
            ctx.fillText(label, x, yTop - 5);
          });

          ctx.restore();
        },
      };

      const overlay2005Plugin = {
        id: "overlay2005",
        beforeDatasetsDraw(chart: any) {
          const { ctx, scales } = chart;
          const xScale = scales.x;
          const yScale = scales.y;
          const slotWidth = xScale.width / sectors.length;
          const barWidth = slotWidth * 0.55;

          ctx.save();
          data2005.forEach((value, i) => {
            const x = xScale.getPixelForValue(i);
            const yTop = yScale.getPixelForValue(value);
            const yBottom = yScale.getPixelForValue(0);

            ctx.fillStyle = "rgba(150,150,150,0.18)";
            ctx.fillRect(x - barWidth / 2, yTop, barWidth, yBottom - yTop);

            ctx.strokeStyle = "rgba(130,130,130,0.55)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.strokeRect(x - barWidth / 2, yTop, barWidth, yBottom - yTop);
          });

          ctx.setLineDash([]);
          ctx.restore();
        },
      };

      chartRef.current = new Chart(canvasRef.current!, {
        type: "bar",
        plugins: [overlay2005Plugin, pctLabelPlugin],
        data: {
          labels: sectors,
          datasets: [
            {
              label: "2023 actual",
              data: data2023,
              backgroundColor: sectorColors,
              borderColor: "transparent",
              borderWidth: 0,
              barPercentage: 0.35,
              categoryPercentage: 1.0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any): string | void => `2023: ${ctx.raw} Tg`,
                afterBody: (items: any[]) => {
                  const i = items[0].dataIndex;
                  const diff = data2023[i] - data2005[i];
                  const pct = Math.round((diff / data2005[i]) * 100);
                  const sign = diff > 0 ? "+" : "";
                  return [
                    `2005: ${data2005[i]} Tg`,
                    `Change: ${sign}${pct}%`,
                  ];
                },
              },
            },
          },
          layout: {
            padding: { top: 20 }, // room for pct labels
          },
          scales: {
            x: {
              ticks: { color: muted, font: { size: 9 }, maxRotation: 15 },
              grid: { display: false },
              border: { color: grid },
            },
            y: {
              min: 0,
              max: 45,
              ticks: {
                color: muted,
                font: { size: 10 },
                stepSize: 10,
                callback: (v: any): string | void => v + " Tg",
              },
              grid: { color: grid },
              border: { color: grid },
              title: { display: true, text: "Tg CO₂e", color: muted, font: { size: 10 } },
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
    <div className="px-4 py-4 flex flex-col h-full">
      <div className="text-tag font-sans font-bold uppercase tracking-widest text-ink-faint mb-1">
        Emissions by sector
      </div>
      <div className="text-2xs font-sans text-ink-faint mb-3">
        2005 baseline vs 2023 actual (Tg CO₂e)
      </div>
      <div style={{ position: "relative", width: "100%", flex: 1, minHeight: "220px" }}>
        <canvas ref={canvasRef} role="img" aria-label="Colorado GHG emissions by sector, 2005 vs 2023" />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span style={{ display: "inline-block", width: 14, height: 8, background: "rgba(150,150,150,0.18)", border: "1px dashed rgba(130,130,130,0.55)", borderRadius: 1 }} />
        <span className="text-2xs font-sans text-ink-muted">2005 baseline · % change shown above each bar</span>
      </div>
      <div className="mt-1.5 text-2xs font-sans" style={{ color: "#bbb" }}>
        Source: CO GHG Inventory 2025 (July 2026)
      </div>
    </div>
  );
}
