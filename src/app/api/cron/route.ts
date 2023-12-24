import { isWithinInterval, set } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";

import { sql } from "@vercel/postgres";

import { getStatus } from "@/lib/getStatus";

const TAHOE_TIMEZONE = "America/Los_Angeles";

function getTimeInTahoe(date = new Date()) {
  return utcToZonedTime(date.toISOString(), TAHOE_TIMEZONE);
}

function isWithinOperatingHours(now: Date) {
  const nowLocal = getTimeInTahoe(now);

  const openToday = set(getTimeInTahoe(), { hours: 8, minutes: 45 });
  const closeToday = set(getTimeInTahoe(), { hours: 16, minutes: 0 });

  return isWithinInterval(nowLocal, { start: openToday, end: closeToday });
}

function isAuthorized(req: Request) {
  if (process.env.NODE_ENV === "development") return true;

  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");

  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const status = await getStatus();

    if (!status) return Response.error();

    const now = new Date();

    // TODO: uncomment this after verifying that it works in prod
    // if (!isWithinOperatingHours(now)) {
    //   return new Response("Outside of normal operation time, nothing added");
    // }

    // NOTE: if this timestamp isn't specified explicitly,
    // the insert command replaces existing rows instead of inserting a new one.
    // This may be a quirk of @vercel/postgres
    // TODO: explore further or go elsewhere
    const created_at = now.toISOString();

    const within_hours = isWithinOperatingHours(now);

    const response =
      await sql`INSERT INTO statuses (status, created_at, within_hours) VALUES (${status.status}, ${created_at}, ${within_hours});`;

    revalidatePath("/");

    return Response.json(response);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
