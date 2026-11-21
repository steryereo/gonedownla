import { count, desc, eq, and, inArray, min, notIlike, sql } from "drizzle-orm";
import { db } from "./index";
import { statuses, type SelectStatus } from "./schema";

export async function getRecentStatuses(): Promise<SelectStatus[]> {
  return await db
    .select()
    .from(statuses)
    .orderBy(desc(statuses.created_at))
    .limit(10);
}

// The feed switched from sentence case to snake_case in Nov 2024
const OPEN_STATUSES = ["Open", "No Offload at KT-22", "open", "no_offload_at_kt22"];

export interface UptimeStats {
  count: number;
  withinHoursCount: number;
  openCount: number;
  firstStatusDate: string;
}

export async function getUptimeStats(): Promise<UptimeStats> {
  // "scheduled" means the lift hasn't reached its opening time yet (e.g. the
  // 8:45 poll most mornings, and Friday's later start), so it isn't downtime.
  const withinHours = and(
    eq(statuses.within_hours, true),
    notIlike(statuses.status, "scheduled")
  );
  const isOpen = and(withinHours, inArray(statuses.status, OPEN_STATUSES));

  const [result] = await db
    .select({
      count: count(),
      withinHoursCount: sql<number>`count(*) filter (where ${withinHours})`.mapWith(Number),
      openCount: sql<number>`count(*) filter (where ${isOpen})`.mapWith(Number),
      firstStatusDate: min(statuses.created_at),
    })
    .from(statuses);

  return {
    count: result?.count ?? 0,
    withinHoursCount: result?.withinHoursCount ?? 0,
    openCount: result?.openCount ?? 0,
    firstStatusDate: result?.firstStatusDate?.toISOString() ?? "",
  };
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

