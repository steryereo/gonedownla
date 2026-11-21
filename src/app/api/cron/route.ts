import { revalidatePath } from "next/cache";

import { getStatus } from "@/lib/getStatus";
import { isWithinOperatingHours } from "@/lib/operatingHours";
import { insertStatus } from "@/db/query";

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

    const within_hours = isWithinOperatingHours(new Date(), status);

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
