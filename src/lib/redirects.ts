import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { defaults } from "@/content/model";

/**
 * Admin-managed 301 redirects (Integrations → Redirects), read by the proxy on every page request.
 * The proxy cannot use the server-only store, so it keeps its own read-only connection and re-reads
 * the list only when the database changes.
 */
type Rule = { from: string; to: string };

const norm = (p: string) => {
  let s = p;
  try {
    s = decodeURI(p);
  } catch {}
  return s.toLowerCase().replace(/\/+$/, "") || "/";
};

const toMap = (rules: Rule[]) => new Map(rules.filter((r) => r.from && r.to).map((r) => [norm(r.from), r.to]));

const fallback = toMap(defaults.integrations.redirects);
let db: DatabaseSync | undefined;
let cache: { version: number; map: Map<string, string> } | undefined;

function rules() {
  try {
    db ??= new DatabaseSync(path.join(path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || "data"), "kind.db"), { readOnly: true });
    const { data_version: version } = db.prepare("PRAGMA data_version").get() as { data_version: number };
    if (cache?.version === version) return cache.map;
    const row = db.prepare("SELECT value FROM content WHERE key = 'integrations'").get() as { value: string } | undefined;
    const saved = row ? (JSON.parse(row.value) as { redirects?: unknown }).redirects : undefined;
    const map = Array.isArray(saved) ? toMap(saved as Rule[]) : fallback;
    cache = { version, map };
    return map;
  } catch {
    // No database yet (fresh install) or it is busy: the default rules still apply.
    db = undefined;
    return cache?.map ?? fallback;
  }
}

/** The target for an old address, or null. Query strings (UTM tags) carry over. */
export function findRedirect(pathname: string, search: string) {
  const to = rules().get(norm(pathname));
  if (!to || norm(to) === norm(pathname)) return null;
  return search && !to.includes("?") ? `${to}${search}` : to;
}
