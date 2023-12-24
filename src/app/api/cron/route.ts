import { sql } from "@vercel/postgres";

import { getStatus } from "@/lib/getStatus";

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

    // NOTE: if this timestamp isn't specified explicitly,
    // the insert command updates instead of inserting.
    // This may be a quirk of @vercel/postgres
    // TODO: explore further or go elsewhere
    const created_at = new Date().toISOString();

    const response =
      await sql`INSERT INTO statuses (status, created_at) VALUES (${status.status}, ${created_at});`;

    return Response.json(response);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
