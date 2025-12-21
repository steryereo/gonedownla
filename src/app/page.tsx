import styles from "./page.module.css";
import { getStatus } from "@/lib/getStatus";
import BehindTheScenesInfo from "@/components/BehindTheScenesInfo";
import {
  getRecentStatuses,
  getCount,
  getFirstStatusDate,
  getWithinHoursCount,
  getOpenCount,
} from "@/db/query";

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
        {currentStatus ? <>The Base to Base is currently <span>✨{currentStatus.Status}✨</span></> : "error getting current status"}
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
