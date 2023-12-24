"use client";

import type { QueryResultRow } from "@vercel/postgres";

export default function BehindTheScenesInfo({
  count,
  firstStatusDate,
  statuses,
  openCount,
  withinHoursCount,
}: {
  count: number;
  firstStatusDate: string;
  statuses: QueryResultRow[];
  openCount: number;
  withinHoursCount: number;
}) {
  return (
    <>
      <section>
        <p>
          {" "}
          collected {count} Base to Base statuses (every 5 minutes since{" "}
          {new Date(firstStatusDate).toLocaleString()}). {withinHoursCount}{" "}
          within normal operating hours. For {openCount} of those, the Base to
          Base has been open
        </p>
      </section>
      <section>
        <h3>Here are some recent statuses</h3>
        <ul>
          {statuses.map(({ id, status, created_at }) => (
            <li key={id}>
              <strong>{status}</strong>
              {` ${new Date(created_at).toLocaleString()}`}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
