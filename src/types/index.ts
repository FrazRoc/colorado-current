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
  | "Energy Storage"
  | "Fusion";

export type Stage =
  | "Pre-seed"
  | "Early"
  | "Early (Series A)"
  | "Growth"
  | "Late"
  | "Public"
  | "Acquired"
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
  website?: string;
  founded?: string;
  b_corp?: string;
  target_customer?: string;
  last_updated?: string;
  sources?: string;
  notes?: string;
  lat?: number;
  lng?: number;
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

export interface DashboardSource {
  label: string;
  url: string;
}

export interface SectorCount {
  name: string;
  count: number;
}

export interface FundingRound {
  company: string;
  amount: string;
  type: string;
  sector: string;
  date: string;
  isIpo?: boolean;
}

export interface LegislationItem {
  name: string;
  status: string;
}

export interface EmissionsData {
  year: number;
  actual?: number;
  target: number;
  projected?: number;
}

export interface DashboardData {
  updatedAt: string;
  metrics: DashboardMetric[];
  sectorCounts: SectorCount[];
  recentFunding: FundingRound[];
  legislation: LegislationItem[];
  vppMw: number;
  vppGoal: number;
  heatPumpRebates: number;
  emissions?: EmissionsData;
  sources: {
    trackedCompanies: DashboardSource[];
    ecosystemFunding: DashboardSource[];
    openJobs: DashboardSource[];
    renewableGeneration: DashboardSource[];
    coal?: DashboardSource[];
    vpp: DashboardSource[];
    heatPumps: DashboardSource[];
    legislation: DashboardSource[];
    recentFunding: DashboardSource[];
    emissions?: DashboardSource[];
  };
}
