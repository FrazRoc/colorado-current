export type Sector =
  | "Solar & Storage"
  | "Grid Software"
  | "Geothermal"
  | "Home Electrification"
  | "Hydrogen"
  | "Industrial Decarb"
  | "EV & Transportation"
  | "Carbon Removal"
  | "Community Solar"
  | "Wind & Solar Development"
  | "Energy Data / Software"
  | "Clean Power / AI Infrastructure"
  | "Research / Policy"
  | "Utility / Renewable Power"
  | "Energy Efficiency / Finance"
  | "Distributed Solar"
  | "Energy Storage";

export type Stage =
  | "Pre-seed"
  | "Early"
  | "Growth"
  | "Late"
  | "Public"
  | "Established nonprofit"
  | "Established"
  | "R&D / Pilot";

export interface Company {
  name: string;
  hq: string;
  sector: Sector;
  stage: Stage;
  funding: string;
  what_they_do: string;
  interesting_angle: string;
  source: string;
  website?: string;
  founded?: string;
}

export type PostType = "Company spotlight" | "Industry analysis" | "Deep dive" | "Policy";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  type: PostType;
  sector?: string;
  content?: string;
}

export interface DashboardMetric {
  value: string;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface FundingRound {
  company: string;
  amount: string;
  type: string;
  sector: string;
  date: string;
  isIpo?: boolean;
}

export interface Legislation {
  name: string;
  status: "Signed" | "Active" | "Committee" | "At risk";
  bill?: string;
}

export interface DashboardSource {
  label: string;
  url: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  sectorCounts: { name: string; count: number }[];
  recentFunding: FundingRound[];
  legislation: Legislation[];
  vppMw: number;
  vppGoal: number;
  heatPumpRebates: number;
  updatedAt: string;
  sources: {
    trackedCompanies: DashboardSource[];
    ecosystemFunding: DashboardSource[];
    openJobs: DashboardSource[];
    renewableGeneration: DashboardSource[];
    vpp: DashboardSource[];
    heatPumps: DashboardSource[];
    legislation: DashboardSource[];
    recentFunding: DashboardSource[];
  };
}
