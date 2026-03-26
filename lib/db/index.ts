import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import * as schema from "./schema";
import { seedDatabase } from "./seed";

// Singleton pattern — one connection reused across the lifetime of the Node.js process
const globalForDb = globalThis as unknown as { _sqlite: Database.Database | undefined };

const sqlite = globalForDb._sqlite ?? new Database(process.env.DATABASE_URL ?? "./db.sqlite");

if (process.env.NODE_ENV !== "production") {
  globalForDb._sqlite = sqlite;
}

// WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Run migrations automatically — creates or updates all custom tables on startup
// In Next.js app environment, call async IIFE to avoid Promise chain type mismatch.
(async () => {
  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "lib/db/migrations") });
    console.log("Drizzle migrations applied successfully.");
    await seedDatabase(db);
  } catch (err) {
    console.error("Drizzle migration error:", err);
  }
})();
