import { QueryResult, sql } from "@vercel/postgres";

import styles from "./page.module.css";
import { getStatus } from "@/lib/getStatus";
import BehindTheScenesInfo from "@/components/BehindTheScenesInfo";

async function getRecentStatuses() {
  const result =
    await sql`SELECT * FROM statuses ORDER BY created_at DESC LIMIT 10`;

  return result.rows;
}

function getCountFromQueryResult(result: QueryResult) {
  return result.rows[0].count;
}

async function getCount() {
  const result = await sql`SELECT COUNT(*) FROM statuses`;

  return getCountFromQueryResult(result);
}

async function getFirstStatusDate() {
  const result =
    await sql`SELECT created_at FROM statuses ORDER BY created_at ASC LIMIT 1`;

  return result.rows[0].created_at;
}

// TODO: probably can combine queries
async function getWithinHoursCount() {
  const result =
    await sql`SELECT COUNT(*) FROM statuses WHERE within_hours = TRUE`;

  return getCountFromQueryResult(result);
}

async function getOpenCount() {
  const result =
    await sql`SELECT COUNT(*) FROM statuses WHERE within_hours = TRUE AND status IN ('Open', 'No Offload at KT-22')`;

  return getCountFromQueryResult(result);
}

export const metadata = {
  title: "GoneDownLa",
};

export default async function Home() {
  const [
    currentStatus,
    recentStatuses,
    count,
    firstStatusDate,
    withinHoursCount,
    openCount,
  ] = await Promise.all([
    getStatus(),
    getRecentStatuses(),
    getCount(),
    getFirstStatusDate(),
    getWithinHoursCount(),
    getOpenCount(),
  ]);

  if (typeof currentStatus === "undefined") return <span>error</span>;

  const percentUptime = Math.round((openCount / withinHoursCount) * 100);

  return (
    <main className={styles.main}>
      <h2>
        The Base to Base is currently <span>✨{currentStatus.Status}✨</span>
      </h2>
      <h2>{`${percentUptime}% Uptime`}</h2>
      <BehindTheScenesInfo
        count={count}
        withinHoursCount={withinHoursCount}
        openCount={openCount}
        firstStatusDate={firstStatusDate}
        statuses={recentStatuses}
      />
    </main>
  );
}
