import Image from "next/image";
import styles from "./page.module.css";
import { getStatus } from "@/lib/getStatus";

export default async function Home() {
  const status = await getStatus();

  if (typeof status === "undefined") return <span>error</span>;

  return (
    <main className={styles.main}>
      <h2>
        The Base to Base is currently{" "}
        <span color={status.statusColour}>{status.status}</span>
      </h2>
    </main>
  );
}
