import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Singleton pattern — one connection reused across the lifetime of the Node.js process
const globalForDb = globalThis as unknown as { _sqlite: Database.Database | undefined };

const sqlite = globalForDb._sqlite ?? new Database(process.env.DATABASE_URL ?? "./db.sqlite");

if (process.env.NODE_ENV !== "production") {
  globalForDb._sqlite = sqlite;
}

// WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
