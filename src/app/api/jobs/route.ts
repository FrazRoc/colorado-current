import { NextResponse } from "next/server";
import { getJobCounts } from "@/lib/jobs";

// Cache the whole response: some ATS payloads (Ashby includes full job
// descriptions, ~7.5MB for Crusoe) exceed Next's 2MB per-fetch cache limit,
// so without this every dashboard load would re-download them.
export const revalidate = 3600;

export async function GET() {
  const companies = await getJobCounts();

  const total = companies.reduce((sum, c) => sum + c.count, 0);
  const totalAllLocations = companies.reduce((sum, c) => sum + c.allLocations, 0);

  return NextResponse.json({
    total,
    totalAllLocations,
    companies: companies
      .filter((c) => c.allLocations > 0)
      .map(({ name, count, allLocations }) => ({ name, count, allLocations })),
    errors: companies.filter((c) => c.status === "error").map(({ name, error }) => ({ name, error })),
    updatedAt: new Date().toISOString(),
    sources: companies.length,
  });
}
