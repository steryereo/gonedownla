import { format, isValid, isWithinInterval, parse } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import type { LiftStatus } from "@/lib/getStatus";

const TAHOE_TIMEZONE = "America/Los_Angeles";

// Used when the feed's hours for today are missing or can't be parsed
const DEFAULT_OPEN = "8:45 AM";
const DEFAULT_CLOSE = "4:00 PM";

type Day = keyof LiftStatus["Hours"];

function getTimeInTahoe(date: Date) {
  return utcToZonedTime(date.toISOString(), TAHOE_TIMEZONE);
}

// Parses feed times like "8:45 AM" onto the given day
function parseClockTime(value: string | undefined, day: Date): Date | null {
  if (!value) return null;

  const time = parse(value.trim(), "h:mm a", day);
  return isValid(time) ? time : null;
}

export function isWithinOperatingHours(
  now: Date,
  status: Pick<LiftStatus, "Hours" | "StatusEnglish">
): boolean {
  if (status.StatusEnglish === "closed_for_season") return false;

  const nowLocal = getTimeInTahoe(now);
  const day = format(nowLocal, "EEEE") as Day;
  const hours = status.Hours?.[day];

  let open = parseClockTime(hours?.Open, nowLocal);
  let close = parseClockTime(hours?.Close, nowLocal);

  if (!open || !close || close <= open) {
    console.warn("Unusable operating hours from feed, using default", { day, hours });
    open = parseClockTime(DEFAULT_OPEN, nowLocal)!;
    close = parseClockTime(DEFAULT_CLOSE, nowLocal)!;
  }

  return isWithinInterval(nowLocal, { start: open, end: close });
}
