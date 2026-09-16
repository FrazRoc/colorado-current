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
  | "Fusion"
  | "Low-Carbon Materials"
  | "Circular Economy/Recycling"
  | "Agriculture Tech"
  | "Aviation"
  | "Methane/Emissions Monitoring"
  | "Marine/Wave Energy";

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
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  crunchbase_url?: string;
  pitchbook_url?: string;
  builtin_url?: string;
  notes?: string;
  jobs_url?: string;
  lat?: number;
  lng?: number;
}

export type PostType = "Company spotlight" | "Industry analysis" | "Deep dive" | "Policy";

export interface PostSource {
  label: string;
  url: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  type: PostType;
  sector?: string;
  content?: string;
  sources?: PostSource[];
  image?: string | null;
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
  legislation: LegislationItem[];
  emissions?: EmissionsData;
  sources: {
    ecosystemFunding: DashboardSource[];
    legislation: DashboardSource[];
    emissions?: DashboardSource[];
  };
}
