import { sql } from "@vercel/postgres";

import styles from "./page.module.css";
import { getStatus } from "@/lib/getStatus";

function getRecentStatuses() {
  return sql`SELECT * FROM statuses ORDER BY "created_at" DESC`;
}

function getCount() {
  return sql`SELECT COUNT(*) FROM statuses`;
}

export default async function Home() {
  const [currentStatus, recentStatuses, count] = await Promise.all([
    getStatus(),
    getRecentStatuses(),
    getCount(),
  ]);

  if (typeof currentStatus === "undefined") return <span>error</span>;

  return (
    <main className={styles.main}>
      <h2>
        The Base to Base is currently{" "}
        <span color={currentStatus.statusColour}>{currentStatus.status}</span>
      </h2>
      <section>
        <h3>
          {`We have currently collected ${count.rows[0].count} Base to Base statuses. We will use these to figure out how much of the scheduled time the Base to Base is down`}
        </h3>
        <p>Here are some recent statuses:</p>
        <pre>
          <code>{JSON.stringify(recentStatuses.rows, null, 2)}</code>
        </pre>
      </section>
    </main>
  );
}
