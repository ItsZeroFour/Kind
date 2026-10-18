#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { randomBytes, scryptSync } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const dataDir = path.resolve(process.env.DATA_DIR || "data");
mkdirSync(path.join(dataDir, "uploads"), { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "kind.db"));
db.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;");
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

function hashPassword(password) {
  const N = 16384, r = 8, p = 1;
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize("NFKC"), salt, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

function ask(question, { hidden = false } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) {
    rl._writeToOutput = (s) => {
      if (s.includes(question)) rl.output.write(s);
      else if (s === "\r\n" || s === "\n") rl.output.write("\n");
      else rl.output.write("*");
    };
  }
  return new Promise((resolve) => rl.question(question, (a) => (rl.close(), resolve(a.trim()))));
}

const email = process.argv[2] || process.env.ADMIN_EMAIL || (await ask("Email: "));
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Invalid email");
  process.exit(1);
}
const password = process.env.ADMIN_PASSWORD || (await ask("Password (at least 10 characters): ", { hidden: true }));
if (password.length < 10) {
  console.error("The password is too short: at least 10 characters");
  process.exit(1);
}

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
if (existing) {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(password), existing.id);
  try {
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(existing.id);
  } catch {}
  console.log(`Password for ${email} updated.`);
} else {
  db.prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)").run(email, "Admin", hashPassword(password));
  console.log(`Admin ${email} created. Sign in at /admin`);
}
db.close();
