import type { Company } from "@/types";

// Publish your Google Sheet as CSV:
// File → Share → Publish to web → CSV → Copy URL
// Then set NEXT_PUBLIC_SHEETS_CSV_URL in .env.local
const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_CSV_URL || "";

export async function fetchCompanies(): Promise<Company[]> {
  if (!SHEETS_URL) {
    console.warn("NEXT_PUBLIC_SHEETS_CSV_URL not set — returning empty company list");
    return [];
  }

  try {
    const res = await fetch(SHEETS_URL, {
      // Revalidate every hour in production
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Sheets fetch failed: ${res.status}`);

    const csv = await res.text();
    return parseCSV(csv);
  } catch (err) {
    console.error("Failed to fetch company data:", err);
    return [];
  }
}

function parseCSV(csv: string): Company[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  // Parse header row
  const headers = parseCSVRow(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.trim()] = values[i]?.trim() || "";
    });

    return {
      name: row.name || row.Name || "",
      hq: row.hq || row.HQ || "",
      sector: (row.sector || row.Sector || "Grid Software") as Company["sector"],
      stage: (row.stage || row.Stage || "Early") as Company["stage"],
      funding: row.funding || row.Funding || "",
      what_they_do: row.what_they_do || row["What they do"] || "",
      interesting_angle: row.interesting_angle || row["Interesting angle"] || "",
      source: row.source || row.Source || "",
      website: row.website || row.Website || "",
      founded: row.founded || row.Founded || "",
    } as Company;
  }).filter((c) => c.name.length > 0);
}

// Handle quoted CSV values correctly
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
