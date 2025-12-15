import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const statuses = pgTable("statuses", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 255 }).notNull(),
  within_hours: boolean("within_hours"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type SelectStatus = typeof statuses.$inferSelect;
