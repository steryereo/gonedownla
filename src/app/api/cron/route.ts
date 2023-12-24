import { sql } from "@vercel/postgres";

import { getStatus } from "@/lib/getStatus";

function isAuthorized(req: Request) {
  if (process.env.NODE_ENV === "development") return true;

  return (
    req.headers.get("Authorization") === `Bearer ${process.env.CRON_SECRET}`
  );
}

export async function GET(req: Request) {
  //   if (!isAuthorized(req)) {
  //     return new Response("Unauthorized", { status: 401 });
  //   }

  try {
    const status = await getStatus();

    if (!status) return Response.error();

    const response =
      await sql`INSERT INTO statuses (status) VALUES (${status.status});`;

    return Response.json(response);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
