#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const KEEP = 14;
const dataDir = path.resolve(process.env.DATA_DIR || "data");
const root = path.resolve(process.argv[2] || "backups");
const dbFile = path.join(dataDir, "kind.db");

if (!existsSync(dbFile)) {
  console.error(`No database at ${dbFile}. Check DATA_DIR.`);
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");
const dest = path.join(root, stamp);
mkdirSync(dest, { recursive: true });

const db = new DatabaseSync(dbFile);
db.exec("PRAGMA busy_timeout = 5000");
db.prepare("VACUUM INTO ?").run(path.join(dest, "kind.db"));
db.close();

const uploads = path.join(dataDir, "uploads");
if (existsSync(uploads)) cpSync(uploads, path.join(dest, "uploads"), { recursive: true });

const old = readdirSync(root).filter((d) => /^\d{4}-\d{2}-\d{2}_\d{4}$/.test(d)).sort().slice(0, -KEEP);
for (const d of old) rmSync(path.join(root, d), { recursive: true, force: true });

console.log(`Backup ready: ${dest}`);
