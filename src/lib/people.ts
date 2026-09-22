import { eq, and, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { people, peopleRoles } from "@/db/schema";
import type { PersonRole } from "@/types";

const ROLE_TYPE_ORDER: Record<string, number> = { founder: 0, executive: 1, board: 2 };

export async function getCurrentLeadership(companyId: number): Promise<PersonRole[]> {
  const rows = await getDb()
    .select({
      name: people.name,
      slug: people.slug,
      linkedinUrl: people.linkedinUrl,
      title: peopleRoles.title,
      roleType: peopleRoles.roleType,
    })
    .from(peopleRoles)
    .innerJoin(people, eq(peopleRoles.personId, people.id))
    .where(and(eq(peopleRoles.companyId, companyId), eq(peopleRoles.isCurrent, true)))
    .orderBy(asc(people.name));

  return rows
    .map((r) => ({
      name: r.name,
      slug: r.slug,
      title: r.title,
      roleType: r.roleType as PersonRole["roleType"],
      linkedinUrl: r.linkedinUrl ?? undefined,
    }))
    .sort((a, b) => (ROLE_TYPE_ORDER[a.roleType] ?? 9) - (ROLE_TYPE_ORDER[b.roleType] ?? 9));
}
