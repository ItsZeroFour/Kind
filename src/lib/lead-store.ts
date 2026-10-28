import "server-only";
import { getDb } from "./db";
import type { Lead } from "./leads";
import { describeForm, describeSource } from "./lead-labels";

export const leadStatuses = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Declined" },
  { value: "spam", label: "Spam" },
] as const;
export type LeadStatus = (typeof leadStatuses)[number]["value"];
export const isLeadStatus = (s: unknown): s is LeadStatus => leadStatuses.some((x) => x.value === s);

export type Delivery = { destination: string; ok: boolean; error?: string }[];

export type LeadRow = {
  id: string;
  createdAt: string;
  status: LeadStatus;
  name: string;
  phone: string;
  email: string | null;
  appliance: string | null;
  zip: string | null;
  urgency: string | null;
  problem: string | null;
  note: string;
  /** Form and traffic source in words */
  formLabel: string;
  channel: string;
};

export type LeadDetail = LeadRow & { lead: Lead; delivery: Delivery | null; updatedAt: string | null; updatedBy: string | null };

const parse = <T>(s: string | null): T | null => {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
};

type DbRow = {
  id: string;
  created_at: string;
  status: string;
  name: string;
  phone: string;
  email: string | null;
  appliance: string | null;
  zip: string | null;
  urgency: string | null;
  data: string;
  note: string;
};

const toRow = (r: DbRow): LeadRow => {
  const data = parse<Lead>(r.data);
  return {
    id: r.id,
    createdAt: r.created_at,
    status: isLeadStatus(r.status) ? r.status : "new",
    name: r.name,
    phone: r.phone,
    email: r.email,
    appliance: r.appliance,
    zip: r.zip,
    urgency: r.urgency,
    problem: data?.problem ?? null,
    note: r.note,
    formLabel: data?.formLabel ?? describeForm(data?.formId, data?.pageUrl),
    channel: data?.channel ?? describeSource(data?.attribution),
  };
};

export function saveLead(lead: Lead) {
  getDb()
    .prepare(
      `INSERT INTO leads (id, created_at, name, phone, email, appliance, zip, urgency, data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      lead.id,
      lead.createdAt,
      lead.name,
      lead.phone,
      lead.email ?? null,
      lead.applianceType ?? null,
      lead.zip ?? null,
      lead.urgency ?? null,
      JSON.stringify(lead),
    );
}

export function setLeadDelivery(id: string, delivery: Delivery) {
  getDb().prepare("UPDATE leads SET delivery = ? WHERE id = ?").run(JSON.stringify(delivery), id);
}

export type LeadFilter = { status?: LeadStatus | "all" | "open"; q?: string; limit?: number; offset?: number };

function where({ status = "all", q }: LeadFilter) {
  const parts: string[] = [];
  const args: string[] = [];
  if (status === "open") parts.push("status IN ('new', 'in_progress')");
  else if (status !== "all") {
    parts.push("status = ?");
    args.push(status);
  }
  const term = q?.trim();
  if (term) {
    const digits = term.replace(/\D/g, "");
    const like = `%${term.replace(/[%_\\]/g, "\\$&")}%`;
    const cond = ["name LIKE ? ESCAPE '\\'", "email LIKE ? ESCAPE '\\'", "zip LIKE ? ESCAPE '\\'", "appliance LIKE ? ESCAPE '\\'", "data LIKE ? ESCAPE '\\'"];
    args.push(like, like, like, like, like);
    if (digits.length >= 3) {
      cond.push("replace(replace(replace(replace(replace(phone, '(', ''), ')', ''), '-', ''), ' ', ''), '+', '') LIKE ?");
      args.push(`%${digits}%`);
    }
    parts.push(`(${cond.join(" OR ")})`);
  }
  return { sql: parts.length ? `WHERE ${parts.join(" AND ")}` : "", args };
}

export function listLeads(filter: LeadFilter = {}) {
  const { sql, args } = where(filter);
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM leads ${sql} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...args, filter.limit ?? 50, filter.offset ?? 0) as DbRow[];
  const { n } = db.prepare(`SELECT count(*) AS n FROM leads ${sql}`).get(...args) as { n: number };
  return { items: rows.map(toRow), total: n };
}

export function countLeadsByStatus() {
  const rows = getDb().prepare("SELECT status, count(*) AS n FROM leads GROUP BY status").all() as { status: string; n: number }[];
  const out = Object.fromEntries(leadStatuses.map((s) => [s.value, 0])) as Record<LeadStatus, number>;
  for (const r of rows) if (isLeadStatus(r.status)) out[r.status] = r.n;
  return out;
}

export const countNewLeads = () => (getDb().prepare("SELECT count(*) AS n FROM leads WHERE status = 'new'").get() as { n: number }).n;

export function getLead(id: string): LeadDetail | null {
  const r = getDb()
    .prepare("SELECT l.*, u.email AS updated_by_email FROM leads l LEFT JOIN users u ON u.id = l.updated_by WHERE l.id = ?")
    .get(id) as (DbRow & { delivery: string | null; updated_at: string | null; updated_by_email: string | null }) | undefined;
  if (!r) return null;
  return {
    ...toRow(r),
    lead: parse<Lead>(r.data) ?? ({} as Lead),
    delivery: parse<Delivery>(r.delivery),
    updatedAt: r.updated_at,
    updatedBy: r.updated_by_email,
  };
}

export function updateLead(id: string, patch: { status?: LeadStatus; note?: string }, userId: number) {
  const cur = getLead(id);
  if (!cur) return false;
  getDb()
    .prepare("UPDATE leads SET status = ?, note = ?, updated_at = ?, updated_by = ? WHERE id = ?")
    .run(patch.status ?? cur.status, patch.note ?? cur.note, new Date().toISOString(), userId, id);
  return true;
}

export function deleteLead(id: string) {
  getDb().prepare("DELETE FROM leads WHERE id = ?").run(id);
}

export function exportLeads(filter: LeadFilter = {}) {
  const { sql, args } = where(filter);
  return (getDb().prepare(`SELECT * FROM leads ${sql} ORDER BY created_at DESC`).all(...args) as DbRow[]).map((r) => ({
    ...toRow(r),
    lead: parse<Lead>(r.data) ?? ({} as Lead),
  }));
}
