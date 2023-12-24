import { sql } from "@vercel/postgres";

import styles from "./page.module.css";
import { getStatus } from "@/lib/getStatus";
import BehindTheScenesInfo from "@/components/BehindTheScenesInfo";

async function getRecentStatuses() {
  const result =
    await sql`SELECT * FROM statuses ORDER BY created_at DESC LIMIT 10`;

  return result.rows;
}

async function getCount() {
  const result = await sql`SELECT COUNT(*) FROM statuses`;

  return result.rows[0].count;
}

async function getFirstStatusDate() {
  const result =
    await sql`SELECT created_at FROM statuses ORDER BY created_at ASC LIMIT 1`;

  return result.rows[0].created_at;
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
      <BehindTheScenesInfo
        count={count}
        firstStatusDate={firstStatusDate}
        statuses={recentStatuses}
      />
    </main>
  );
}
