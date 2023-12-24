"use client";

import type { QueryResultRow } from "@vercel/postgres";

export default function BehindTheScenesInfo({
  count,
  firstStatusDate,
  statuses,
}: {
  count: number;
  firstStatusDate: string;
  statuses: QueryResultRow[];
}) {
  return (
    <>
      <section>
        <p> We have currently collected {count} Base to Base statuses</p>
        <p>
          (every 5 minutes since {new Date(firstStatusDate).toLocaleString()})
        </p>
        <p>
          We will use these to figure out how much of the scheduled time the
          Base to Base is down
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
