import { isWithinInterval, set } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";

import { getStatus } from "@/lib/getStatus";
import { insertStatus } from "@/db/query";

const TAHOE_TIMEZONE = "America/Los_Angeles";

function getTimeInTahoe(date = new Date()) {
  return utcToZonedTime(date.toISOString(), TAHOE_TIMEZONE);
}

function isWithinOperatingHours(now: Date) {
  return false; // TODO: temporarily disabled for end of season

  // const nowLocal = getTimeInTahoe(now);

  // const openToday = set(getTimeInTahoe(), {
  //   hours: 8,
  //   minutes: 45,
  //   seconds: 0,
  // });
  // const closeToday = set(getTimeInTahoe(), {
  //   hours: 16,
  //   minutes: 0,
  //   seconds: 0,
  // });

  // return isWithinInterval(nowLocal, { start: openToday, end: closeToday });
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

    const within_hours = isWithinOperatingHours(now);

    const insertedStatus = await insertStatus(
      status.StatusEnglish,
      within_hours
    );

    revalidatePath("/");

    return Response.json(insertedStatus);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
