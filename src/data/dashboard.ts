import type { DashboardData } from "@/types";

function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const dashboardData: DashboardData = {
  updatedAt: getCurrentMonthYear(),

  metrics: [
    {
      value: "–",
      label: "Tracked companies",
      deltaPositive: true,
    },
    {
      value: "$6.5B",
      label: "Ecosystem funding",
      delta: "53 companies with disclosed funding",
      deltaPositive: false,
    },
  ],

  legislation: [
    { name: "Inclusive Community Solar (SB 24-207)", status: "Signed" },
    { name: "Grid of the Future (SB 218)", status: "Signed" },
    { name: "Geothermal Development", status: "Active" },
    { name: "Split-Rate Tax (HB26-1119)", status: "Committee" },
    { name: "Solar for All ($156M EPA grant)", status: "At risk" },
  ],

  sources: {
    ecosystemFunding: [
      { label: "Crunchbase", url: "https://crunchbase.com" },
      { label: "PitchBook", url: "https://pitchbook.com" },
    ],
    legislation: [
      { label: "SB 24-207", url: "https://leg.colorado.gov/bills/sb24-207" },
      { label: "SB 23-218", url: "https://leg.colorado.gov/bills/sb23-218" },
      { label: "HB 26-1119", url: "https://leg.colorado.gov/bills/hb26-1119" },
      { label: "EPA Solar for All", url: "https://www.epa.gov/greenhouse-gas-reduction-fund/solar-all" },
    ],
    emissions: [
      { label: "Colorado Sun", url: "https://coloradosun.com/2025/12/23/colorado-greenhouse-gas-cuts-falling-behind/" },
      { label: "Colorado Newsline", url: "https://coloradonewsline.com/2025/12/29/colorado-officially-falls-short-greenhouse-gas/" },
    ],
  },
};

export default dashboardData;
