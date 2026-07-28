import type { DashboardData } from "@/types";

const dashboardData: DashboardData = {
  updatedAt: "July 2026",

  metrics: [
    {
      value: "40",
      label: "Tracked companies",
      delta: "+6 since Jan 2026",
      deltaPositive: true,
    },
    {
      value: "$4.1B",
      label: "Ecosystem funding",
      delta: "28 funded companies",
      deltaPositive: false,
    },
    {
      value: "312",
      label: "Open jobs",
      delta: "Across 18 companies",
      deltaPositive: false,
    },
    {
      value: "44%",
      label: "Renewable generation",
      delta: "of CO electricity, 2025",
      deltaPositive: true,
    },
  ],

  sectorCounts: [
    { name: "Solar & Storage", count: 10 },
    { name: "Grid Software", count: 6 },
    { name: "Geothermal", count: 5 },
    { name: "Home Electrification", count: 3 },
    { name: "Hydrogen", count: 3 },
    { name: "Industrial Decarb", count: 3 },
    { name: "EV & Transportation", count: 3 },
    { name: "Carbon Removal", count: 1 },
  ],

  recentFunding: [
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
    {
      company: "Elephant Energy",
      amount: "$12.4M",
      type: "Series A",
      sector: "Home Electrification",
      date: "2024",
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

  vppMw: 15,
  vppGoal: 125,
  heatPumpRebates: 10640,
};

export default dashboardData;
