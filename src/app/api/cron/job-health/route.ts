import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { jobBoardChecks } from "@/db/schema";
import { getJobCounts, type JobCount } from "@/lib/jobs";

// Daily job-board health check (scheduled in vercel.json). Logs every board's
// result to job_board_checks and alerts on problems that are *new* since the
// previous run, so a board that stays broken doesn't re-alert every day:
//   - a board that errors (HTTP failure / unrecognized response) and didn't
//     error last run, or
//   - a board that reads fine but dropped to 0 postings after having at least
//     DROP_THRESHOLD last run (usually a moved/renamed board, not a hiring
//     freeze).
const DROP_THRESHOLD = 3;

interface JobBoardProblem {
  name: string;
  companySlug: string;
  kind: "error" | "dropped_to_zero";
  detail: string;
}

export async function GET(request: Request) {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically.
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const results = await getJobCounts();

  // Most recent previous check per company
  const history = await db.select().from(jobBoardChecks).orderBy(desc(jobBoardChecks.checkedAt)).limit(2000);
  const previous = new Map<number, (typeof history)[number]>();
  for (const row of history) if (!previous.has(row.companyId)) previous.set(row.companyId, row);

  const problems: JobBoardProblem[] = [];
  for (const r of results) {
    const prev = previous.get(r.companyId);
    if (r.status === "error" && prev?.status !== "error") {
      problems.push({ name: r.name, companySlug: r.companySlug, kind: "error", detail: r.error ?? "Unknown error" });
    } else if (r.status === "ok" && r.allLocations === 0 && prev?.status === "ok" && prev.allLocationsCount >= DROP_THRESHOLD) {
      problems.push({
        name: r.name,
        companySlug: r.companySlug,
        kind: "dropped_to_zero",
        detail: `Dropped from ${prev.allLocationsCount} postings to 0 since the last check`,
      });
    }
  }

  await db.insert(jobBoardChecks).values(
    results.map((r: JobCount) => ({
      companyId: r.companyId,
      status: r.status,
      error: r.error ?? null,
      coloradoCount: r.count,
      allLocationsCount: r.allLocations,
    }))
  );

  if (problems.length > 0) await sendAlert(problems);

  return NextResponse.json({
    checked: results.length,
    coloradoTotal: results.reduce((s, r) => s + r.count, 0),
    erroring: results.filter((r) => r.status === "error").map((r) => r.name),
    newProblems: problems,
  });
}

async function sendAlert(problems: JobBoardProblem[]) {
  // Email delivery is wired up once the Resend integration is provisioned.
  console.warn("Job board health problems:", JSON.stringify(problems));
}
