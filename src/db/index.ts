import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as schema from "./schema";

// Single shared SQLite connection for the whole app (drizzle + better-auth).
// Resolve to an absolute path so it never depends on the process cwd (Next's
// standalone server runs from a different dir than `next dev`), and ensure the
// parent dir exists — better-sqlite3 throws SQLITE_CANTOPEN instead of creating
// missing directories.
const dbPath = resolve(
  (process.env.DATABASE_URL ?? "file:./warungos.db").replace(/^file:/, "")
);
mkdirSync(dirname(dbPath), { recursive: true });

export const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent reads
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
