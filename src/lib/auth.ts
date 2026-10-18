import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password";
import { createLimiter } from "./rate-limit";
import { clientIp } from "./request";

const COOKIE = "kind_admin";
const SESSION_DAYS = 30;

export type User = { id: number; email: string; name: string };

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function isHttps() {
  if (process.env.ADMIN_COOKIE_SECURE) return process.env.ADMIN_COOKIE_SECURE === "true";
  return (await headers()).get("x-forwarded-proto")?.split(",")[0]?.trim() === "https";
}

export async function getUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as User | undefined;
  return row ? { ...row } : null;
}

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/admin/login");
  return user;
}

const failedLogins = createLimiter(15 * 60 * 1000, 8);

export async function login(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const h = await headers();
  const ip = clientIp(h);
  const keys = [`ip:${ip}`, `email:${email.toLowerCase()}`];
  if (keys.some(failedLogins.isLimited)) return { ok: false, error: "Too many attempts. Wait 15 minutes." };

  const db = getDb();
  const user = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;
  const ok = user ? verifyPassword(password, user.password_hash) : (verifyPassword(password, DUMMY_HASH), false);
  if (!user || !ok) {
    keys.forEach(failedLogins.hit);
    return { ok: false, error: "Wrong email or password" };
  }

  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 864e5;
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(sha256(token), user.id, expires);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: await isHttps(),
    path: "/",
    expires: new Date(expires),
  });
  return { ok: true };
}
const DUMMY_HASH = hashPassword(randomBytes(12).toString("hex"));

export async function logout() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  jar.delete(COOKIE);
}

export function listUsers() {
  const rows = getDb().prepare("SELECT id, email, name, created_at FROM users ORDER BY id").all() as (User & { created_at: string })[];
  return rows.map((r) => ({ ...r }));
}

export function createUser(email: string, name: string, password: string) {
  getDb().prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)").run(email, name, hashPassword(password));
}

export function deleteUser(id: number) {
  getDb().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function countUsers() {
  return (getDb().prepare("SELECT count(*) AS n FROM users").get() as { n: number }).n;
}

export function checkPassword(userId: number, password: string) {
  const row = getDb().prepare("SELECT password_hash FROM users WHERE id = ?").get(userId) as { password_hash: string } | undefined;
  return row ? verifyPassword(password, row.password_hash) : false;
}

export async function setPassword(userId: number, password: string) {
  const db = getDb();
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(password), userId);
  const token = (await cookies()).get(COOKIE)?.value;
  db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").run(userId, token ? sha256(token) : "");
}

export const passwordRule = "At least 10 characters";
export const isStrongEnough = (p: string) => p.length >= 10;
