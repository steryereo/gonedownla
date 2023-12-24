import { sql } from "@vercel/postgres";

import styles from "./page.module.css";
import { getStatus } from "@/lib/getStatus";

function getRecentStatuses() {
  return sql`SELECT * FROM statuses ORDER BY created_at DESC LIMIT 10`;
}

function getCount() {
  return sql`SELECT COUNT(*) FROM statuses`;
}

function getFirstStatusDate() {
  return sql`SELECT created_at FROM statuses ORDER BY created_at ASC LIMIT 1`;
}

export default async function Home() {
  const [currentStatus, recentStatuses, count, firstStatusDate] =
    await Promise.all([
      getStatus(),
      getRecentStatuses(),
      getCount(),
      getFirstStatusDate(),
    ]);

  if (typeof currentStatus === "undefined") return <span>error</span>;

  return (
    <main className={styles.main}>
      <h2>
        The Base to Base is currently{" "}
        <span color={currentStatus.statusColour}>
          ✨{currentStatus.status}✨
        </span>
      </h2>
      <section>
        <p>
          {`We have currently collected ${
            count.rows[0].count
          } Base to Base statuses (every 5 minutes since ${new Date(
            firstStatusDate.rows[0].created_at
          ).toLocaleString()}).`}
        </p>
        <p>
          We will use these to figure out how much of the scheduled time the
          Base to Base is down
        </p>
      </section>
      <section>
        <h3>Here are some recent statuses</h3>
        <ul>
          {recentStatuses.rows.map(({ id, status, created_at }) => (
            <li key={id}>
              {`${status} ${new Date(created_at).toLocaleString()}`}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
