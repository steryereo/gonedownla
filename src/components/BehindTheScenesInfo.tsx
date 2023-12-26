"use client";

import type { QueryResultRow } from "@vercel/postgres";
import { useState } from "react";

import styles from "../app/page.module.css";

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
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* TODO: a11y text for button*/}
      <button className={styles.button} onClick={() => setShowInfo(!showInfo)}>
        ⓘ
      </button>
      {showInfo ? (
        <>
          <section>
            <p>
              collected {count} Base to Base statuses (every 5 minutes since{" "}
              {new Date(firstStatusDate).toLocaleString()}). {withinHoursCount}{" "}
              within normal operating hours. the Base to Base has been open for{" "}
              {openCount} of those
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
      ) : null}
    </>
  );
}
