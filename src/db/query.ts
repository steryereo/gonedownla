import { count, desc, asc, eq, and, inArray } from "drizzle-orm";
import { db } from "./index";
import { statuses, type SelectStatus } from "./schema";

export async function getRecentStatuses(): Promise<SelectStatus[]> {
  return await db
    .select()
    .from(statuses)
    .orderBy(desc(statuses.created_at))
    .limit(10);
}

export async function getCount(): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(statuses);
  
  return result[0]?.count ?? 0;
}

export async function getFirstStatusDate(): Promise<string> {
  const result = await db
    .select({ created_at: statuses.created_at })
    .from(statuses)
    .orderBy(asc(statuses.created_at))
    .limit(1);
  
  return result[0]?.created_at?.toISOString() ?? "";
}

export async function getWithinHoursCount(): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(statuses)
    .where(eq(statuses.within_hours, true));
  
  return result[0]?.count ?? 0;
}

export async function getOpenCount(): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(statuses)
    .where(
      and(
        eq(statuses.within_hours, true),
        inArray(statuses.status, ["Open", "No Offload at KT-22"])
      )
    );
  
  return result[0]?.count ?? 0;
}

export async function insertStatus(
  status: string,
  within_hours: boolean
): Promise<SelectStatus> {
  const result = await db
    .insert(statuses)
    .values({
      status,
      within_hours,
    })
    .returning();
  
  return result[0];
}

