import type { Company, SectorCount } from "@/types";

export interface SectorStyle {
  bg: string;
  text: string;
  placeholder: string;
  label: string;
}

// Canonical hex color per company sector — the ONLY place a sector's color
// is defined. Chart bars, map markers, and company-table/blog badges all
// derive from this (see getSectorColor / getSectorStyle below), so a sector
// reads as the same color everywhere by construction instead of by two
// hand-authored palettes staying in sync (they didn't — Solar & Storage was
// orange on the dashboard and green on /companies before this).
export const SECTOR_COLORS: Record<string, string> = {
  "Solar & Storage": "#BA7517",
  "Grid Software": "#185FA5",
  "Geothermal": "#0F6E56",
  "Home Electrification": "#3B6D11",
  "Hydrogen": "#534AB7",
  "Industrial Decarb": "#993C1D",
  "EV & Transportation": "#993556",
  "Carbon Removal": "#888780",
  "Fusion": "#A32D2D",
  "Research / Policy": "#444441",
  "Low-Carbon Materials": "#7A5C3E",
  "Agriculture Tech": "#6B8E23",
  "Methane/Emissions Monitoring": "#C0392B",
  "Circular Economy/Recycling": "#1F9E89",
  "Aviation": "#2E6F95",
};

const SECTOR_COLOR_FALLBACK = "#888780";

export function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || SECTOR_COLOR_FALLBACK;
}

// Badge styles for labels that aren't company sectors (blog post types) and
// so have no chart/map color to derive from.
const NON_SECTOR_STYLES: Record<string, SectorStyle> = {
  "Community Solar": {
    bg: "#fef6e4",
    text: "#7a4f00",
    placeholder: "#fae8b8",
    label: "Community Solar",
  },
  "Industry analysis": {
    bg: "#fef6e4",
    text: "#7a4f00",
    placeholder: "#fae8b8",
    label: "Industry analysis",
  },
  "Company spotlight": {
    bg: "#edf7f2",
    text: "#1a6b42",
    placeholder: "#d4ede0",
    label: "Company spotlight",
  },
  "Deep dive": {
    bg: "#fff4ea",
    text: "#7a3800",
    placeholder: "#fde0c0",
    label: "Deep dive",
  },
  "Policy": {
    bg: "#ede8fb",
    text: "#4a2d8a",
    placeholder: "#ddd5f8",
    label: "Policy",
  },
};

export const LEGISLATION_STYLES: Record<string, { bg: string; text: string }> = {
  Signed: { bg: "#ede8fb", text: "#4a2d8a" },
  Active: { bg: "#edf7f2", text: "#1a6b42" },
  Committee: { bg: "#fef6e4", text: "#7a4f00" },
  "At risk": { bg: "#fef0f0", text: "#8a1a1a" },
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHexChannel(value: number): string {
  return Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, "0");
}

// Mixes `hex` toward `target` (white or black) by `amount` (0-1) — used to
// derive a light badge bg/placeholder and a slightly-darkened, legible text
// color from the same canonical sector hue.
function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const [tr, tg, tb] = target;
  return `#${toHexChannel(r + (tr - r) * amount)}${toHexChannel(g + (tg - g) * amount)}${toHexChannel(b + (tb - b) * amount)}`;
}

function deriveSectorStyle(color: string, label: string): SectorStyle {
  return {
    bg: mix(color, [255, 255, 255], 0.9),
    placeholder: mix(color, [255, 255, 255], 0.72),
    text: mix(color, [0, 0, 0], 0.15),
    label,
  };
}

export function getSectorStyle(sector: string): SectorStyle {
  if (SECTOR_COLORS[sector]) {
    return deriveSectorStyle(SECTOR_COLORS[sector], sector);
  }
  return (
    NON_SECTOR_STYLES[sector] || {
      bg: "#f5f5f3",
      text: "#444",
      placeholder: "#e0e0dc",
      label: sector,
    }
  );
}

export function getSectorCounts(companies: Company[]): SectorCount[] {
  const counts = new Map<string, number>();
  for (const company of companies) {
    if (!company.sector) continue;
    counts.set(company.sector, (counts.get(company.sector) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }));
}
