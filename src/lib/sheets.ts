import type { Company } from "@/types";

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_CSV_URL || "";

export async function fetchCompanies(): Promise<Company[]> {
  if (!SHEETS_URL) {
    console.warn("NEXT_PUBLIC_SHEETS_CSV_URL not set — returning empty company list");
    return [];
  }

  try {
    const res = await fetch(SHEETS_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Sheets fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const csv = await res.text();

    if (!csv || csv.trim().length === 0) {
      console.error("Sheets returned empty response");
      return [];
    }

    if (csv.trim().startsWith("<")) {
      console.error("Sheets returned HTML instead of CSV — check publish settings");
      return [];
    }

    const companies = parseCSV(csv);
    console.log(`Fetched ${companies.length} companies from Google Sheets`);
    return companies;
  } catch (err) {
    console.error("Failed to fetch company data:", err);
    return [];
  }
}

function parseCSV(csv: string): Company[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]).map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCSVRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i]?.trim() || "";
    });

    return {
      name: row.name || "",
      hq: row.hq || "",
      sector: (row.sector || "Grid Software") as Company["sector"],
      stage: (row.stage || "Early") as Company["stage"],
      funding: row.funding || "",
      what_they_do: row.what_they_do || "",
      interesting_angle: row.interesting_angle || "",
      website: row.website || "",
      founded: row.founded || "",
      b_corp: row.b_corp || "",
      target_customer: row.target_customer || "",
      last_updated: row.last_updated || "",
      sources: row.sources || row.source || "",
      notes: row.notes || "",
      jobs_url: row.jobs_url || "",
      lat: row.lat ? parseFloat(row.lat) : undefined,
      lng: row.lng ? parseFloat(row.lng) : undefined,
    } as Company;
  }).filter((c) => c.name.length > 0);
}

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
