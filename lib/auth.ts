import { betterAuth } from "better-auth";
import { SqliteDialect } from "kysely";
import Database from "better-sqlite3";

// Separate better-sqlite3 instance for BetterAuth (WAL mode allows multiple readers)
const globalForAuth = globalThis as unknown as { _authDb: Database.Database | undefined };

const authDb =
  globalForAuth._authDb ?? new Database(process.env.DATABASE_URL ?? "./db.sqlite");

if (process.env.NODE_ENV !== "production") {
  globalForAuth._authDb = authDb;
}

export const auth = betterAuth({
  database: new SqliteDialect({ database: authDb }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});
