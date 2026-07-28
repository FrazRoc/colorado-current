export interface SectorStyle {
  bg: string;
  text: string;
  placeholder: string;
  label: string;
}

export const SECTOR_STYLES: Record<string, SectorStyle> = {
  "Solar & Storage": {
    bg: "#edf7f2",
    text: "#1a6b42",
    placeholder: "#d4ede0",
    label: "Solar & Storage",
  },
  "Grid Software": {
    bg: "#edf3fb",
    text: "#1a4280",
    placeholder: "#c8ddf5",
    label: "Grid Software",
  },
  "Geothermal": {
    bg: "#fff4ea",
    text: "#7a3800",
    placeholder: "#fde0c0",
    label: "Geothermal",
  },
  "Home Electrification": {
    bg: "#fef0f0",
    text: "#8a1a1a",
    placeholder: "#f8d0d0",
    label: "Home Electrification",
  },
  "Hydrogen": {
    bg: "#f3effe",
    text: "#4a2d8a",
    placeholder: "#ddd5f8",
    label: "Hydrogen",
  },
  "Industrial Decarb": {
    bg: "#fff4ea",
    text: "#7a3800",
    placeholder: "#fce8cc",
    label: "Industrial Decarb",
  },
  "EV & Transportation": {
    bg: "#edf7f2",
    text: "#1a5a38",
    placeholder: "#c8e8d8",
    label: "EV & Transportation",
  },
  "Carbon Removal": {
    bg: "#f5f5f3",
    text: "#444",
    placeholder: "#e0e0dc",
    label: "Carbon Removal",
  },
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

export function getSectorStyle(sector: string): SectorStyle {
  return (
    SECTOR_STYLES[sector] || {
      bg: "#f5f5f3",
      text: "#444",
      placeholder: "#e0e0dc",
      label: sector,
    }
  );
}
