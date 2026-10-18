import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./password";

export const dataDir = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || "data");
export const uploadsDir = path.join(dataDir, "uploads");

const migrations = [
  `CREATE TABLE IF NOT EXISTS content (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL,
     updated_at TEXT NOT NULL DEFAULT (datetime('now')),
     updated_by INTEGER
   );
   CREATE TABLE IF NOT EXISTS revisions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     key TEXT NOT NULL,
     value TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     user_id INTEGER
   );
   CREATE INDEX IF NOT EXISTS revisions_key ON revisions (key, id DESC);
   CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT NOT NULL UNIQUE COLLATE NOCASE,
     name TEXT NOT NULL DEFAULT '',
     password_hash TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   );
   CREATE TABLE IF NOT EXISTS sessions (
     token_hash TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
     expires_at INTEGER NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   );
   CREATE TABLE IF NOT EXISTS media (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     file TEXT NOT NULL UNIQUE,
     original_name TEXT NOT NULL DEFAULT '',
     mime TEXT NOT NULL,
     width INTEGER,
     height INTEGER,
     size INTEGER NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   );`,
  `CREATE TABLE IF NOT EXISTS leads (
     id TEXT PRIMARY KEY,
     created_at TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'new',
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT,
     appliance TEXT,
     zip TEXT,
     urgency TEXT,
     data TEXT NOT NULL,
     note TEXT NOT NULL DEFAULT '',
     delivery TEXT,
     updated_at TEXT,
     updated_by INTEGER
   );
   CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at DESC);
   CREATE INDEX IF NOT EXISTS leads_status ON leads (status, created_at DESC);`,
];

function migrate(db: DatabaseSync) {
  const version = () => (db.prepare("PRAGMA user_version").get() as { user_version: number }).user_version;
  while (version() < migrations.length) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const v = version();
      if (v < migrations.length) {
        db.exec(migrations[v]);
        db.exec(`PRAGMA user_version = ${v + 1}`);
      }
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
}

function seedAdmin(db: DatabaseSync) {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const { n } = db.prepare("SELECT count(*) AS n FROM users").get() as { n: number };
  if (n > 0) return;
  db.prepare(
    `INSERT OR IGNORE INTO users (email, name, password_hash)
     SELECT ?, 'Admin', ? WHERE NOT EXISTS (SELECT 1 FROM users)`,
  ).run(email, hashPassword(password));
}

function open() {
  mkdirSync(uploadsDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "kind.db"), { timeout: 5000 });
  db.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA foreign_keys = ON;");
  migrate(db);
  seedAdmin(db);
  return db;
}

const g = globalThis as unknown as { __kindDb?: DatabaseSync };

export function getDb() {
  return (g.__kindDb ??= open());
}
