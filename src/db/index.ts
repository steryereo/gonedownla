import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// prepare: false is required for drizzle to work with supabase https://supabase.com/docs/guides/database/drizzle
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({ client });
