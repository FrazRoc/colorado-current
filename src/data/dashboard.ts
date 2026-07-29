import type { DashboardData } from "@/types";

const dashboardData: DashboardData = {
  updatedAt: "July 2026",

  metrics: [
    {
      value: "46",
      label: "Tracked companies",
      delta: "+6 since Jan 2026",
      deltaPositive: true,
    },
    {
      value: "$4.4B",
      label: "Ecosystem funding",
      delta: "31 funded companies",
      deltaPositive: false,
    },
    {
      value: "312",
      label: "Open jobs",
      delta: "Across 18 companies",
      deltaPositive: false,
    },
    {
      value: "43%",
      label: "Renewable generation",
      delta: "of CO electricity, 2025",
      deltaPositive: true,
    },
  ],

  sectorCounts: [
    { name: "Solar & Storage", count: 11 },
    { name: "Grid Software", count: 8 },
    { name: "Geothermal", count: 5 },
    { name: "Home Electrification", count: 4 },
    { name: "Hydrogen", count: 3 },
    { name: "Industrial Decarb", count: 3 },
    { name: "EV & Transportation", count: 4 },
    { name: "Carbon Removal", count: 3 },
    { name: "Fusion", count: 1 },
  ],

  recentFunding: [
    {
      company: "Zero Homes",
      amount: "$16.8M",
      type: "Series A",
      sector: "Home Electrification",
      date: "Feb 2026",
    },
    {
      company: "AtmosZero",
      amount: "$28.5M",
      type: "Series B",
      sector: "Industrial Decarb",
      date: "Mar 2026",
    },
    {
      company: "Fervo Energy",
      amount: "FRVO ↗",
      type: "IPO",
      sector: "Geothermal",
      date: "May 2026",
      isIpo: true,
    },
    {
      company: "Koloma",
      amount: "$50M",
      type: "Series B ext",
      sector: "Hydrogen",
      date: "Oct 2024",
    },
    {
      company: "Pivot Energy",
      amount: "$450M",
      type: "Project finance",
      sector: "Solar",
      date: "Nov 2024",
    },
  ],

  legislation: [
    {
      name: "Inclusive Community Solar (SB 24-207)",
      status: "Signed",
    },
    {
      name: "Grid of the Future (SB 218)",
      status: "Signed",
    },
    {
      name: "Geothermal Development",
      status: "Active",
    },
    {
      name: "Split-Rate Tax (HB26-1119)",
      status: "Committee",
    },
    {
      name: "Solar for All ($156M EPA grant)",
      status: "At risk",
    },
  ],

  vppMw: 10,
  vppGoal: 125,
  heatPumpRebates: 10640,

  // Sources for every dashboard metric — displayed as citations on the site
  sources: {
    trackedCompanies: [],
    ecosystemFunding: [
      { label: "Crunchbase", url: "https://crunchbase.com" },
      { label: "PitchBook", url: "https://pitchbook.com" },
    ],
    openJobs: [
      { label: "ClimateTechList", url: "https://climatetechlist.com" },
    ],
    renewableGeneration: [
      { label: "Colorado Sun — 43% renewable in 2025 (EIA data)", url: "https://coloradosun.com/2026/04/10/colorado-renewable-energy/" },
      { label: "EIA — Colorado State Energy Profile", url: "https://www.eia.gov/state/print.php?sid=CO" },
      { label: "Independence Institute — Fast Facts About Colorado's Electricity Sector in 2025", url: "https://i2i.org/fast-facts-about-colorados-electricity-sector-in-2025/" },
    ],
    vpp: [
      { label: "Utility Dive — Enphase expands VPP support in Colorado (Feb 2025)", url: "https://www.utilitydive.com/news/enphase-vpp-colorado-xcel-energy-battery-connect/739834/" },
      { label: "Itron — Xcel Energy to Deploy Advanced VPP in Colorado (Mar 2025)", url: "https://investors.itron.com/news-releases/news-release-details/xcel-energy-deploy-advanced-virtual-power-plant-colorado-itron" },
      { label: "SEPA/NCCETC — States and utilities took 106 VPP actions in 2025", url: "https://pv-magazine-usa.com/2026/02/02/states-and-utilities-took-106-actions-to-advance-vpps-in-2025-sepa-report/" },
    ],
    heatPumps: [
      { label: "Colorado Sun — Heat pump installations more than doubled in 2025 (Feb 2026)", url: "https://coloradosun.com/2026/02/19/heat-pump-colorado-rebates-contractors/" },
    ],
    legislation: [
      { label: "Colorado General Assembly — SB 24-207 (Inclusive Community Solar)", url: "https://leg.colorado.gov/bills/sb24-207" },
      { label: "Colorado General Assembly — SB 23-218 (Grid of the Future)", url: "https://leg.colorado.gov/bills/sb23-218" },
      { label: "Colorado General Assembly — HB 26-1119 (Split-Rate Tax)", url: "https://leg.colorado.gov/bills/hb26-1119" },
      { label: "EPA — Solar for All program status", url: "https://www.epa.gov/greenhouse-gas-reduction-fund/solar-all" },
    ],
    recentFunding: [
      { label: "Zero Homes Series A announcement (Feb 2026)", url: "https://www.zerohomes.com/blog/series-a-announcement" },
      { label: "AtmosZero Series B (Mar 2026)", url: "https://www.businesswire.com/news/home/20260301/en/AtmosZero-Raises-Series-B" },
      { label: "Fervo Energy IPO (May 2026)", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=fervo&CIK=&type=S-1" },
      { label: "Koloma Series B extension (Oct 2024)", url: "https://tracxn.com/d/companies/koloma" },
      { label: "Pivot Energy project finance (Nov 2024)", url: "https://inven.ai/company/pivot-energy" },
    ],
  },
};

export default dashboardData;
