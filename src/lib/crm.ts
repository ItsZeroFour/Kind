import "server-only";
import { getCrmWebhook } from "@/content/store";
import { getDb } from "./db";
import { campaignTags, describeTouch } from "./lead-labels";
import { normalizeUSPhone, type Lead } from "./leads";
import type { Attribution } from "./tracking";

// server only - every lead triggers paid sms/calls

export const CRM_RETRY_MS = 5 * 60 * 1000;
export const CRM_RETRY_FOR_MS = 24 * 60 * 60 * 1000;
const TIME_ZONE = process.env.ADMIN_TIMEZONE || "America/Los_Angeles";

export type CrmState = "pending" | "delivered" | "failed";

const formType = (formId = "") => (formId === "book_page" ? "book_full" : formId === "contact_page" ? "contact" : "callback_short");

// e.g. 2026-10-24T09:15:00-07:00
export function zonedIso(date: Date, timeZone = TIME_ZONE) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  const offset = Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  const abs = Math.abs(offset);
  const hhmm = `${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offset < 0 ? "-" : "+"}${hhmm}`;
}

// all keys always present, "" if missing
export function crmPayload(lead: Lead) {
  const [firstName = "", ...rest] = lead.name.trim().split(/\s+/);
  const visits = (lead.attribution ?? {}) as Attribution;
  return {
    form_type: formType(lead.formId),
    page_url: lead.pageUrl ?? "",
    first_name: firstName,
    last_name: rest.join(" "),
    phone: normalizeUSPhone(lead.phone) ?? "",
    zip: lead.zip ?? "",
    appliance: lead.applianceType ?? "",
    brand: lead.brand ?? "",
    customer_type: lead.customerType ?? "residential",
    issue: lead.problem ?? "",
    urgency: lead.urgency ?? "",
    preferred_date: lead.preferredDate ?? "",
    preferred_time: lead.preferredTime ?? "",
    ...campaignTags(lead.attribution, "first"),
    consent: lead.consent === true,
    consent_text: lead.consentText ?? "",
    submitted_at: zonedIso(new Date(lead.createdAt)),
    // extras for the AI agent
    email: lead.email ?? "",
    lead_id: lead.id,
    form_name: lead.formLabel ?? "",
    // first visit
    source: describeTouch(visits.first) ?? describeTouch(visits.last) ?? "",
  };
}

// null = ok (2xx), otherwise error text
async function post(url: string, body: string) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? null : `HTTP ${res.status}`;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

// fallback when db is down, single attempt
export async function postToCrmOnce(lead: Lead) {
  const url = getCrmWebhook();
  if (!url) return;
  const error = await post(url, JSON.stringify(crmPayload(lead)));
  if (error) console.error(`[crm] lead ${lead.id} not delivered and not saved: ${error}. Lead:`, JSON.stringify(lead));
}

// true = delivered, false = failed (will retry), null = nothing to do
export async function deliverToCrm(id: string) {
  const db = getDb();
  const now = Date.now();
  // claim first so parallel runs don't send twice
  const claimed = db
    .prepare("UPDATE leads SET crm_next_at = ?, crm_attempts = crm_attempts + 1 WHERE id = ? AND crm_state = 'pending' AND crm_next_at <= ?")
    .run(now + CRM_RETRY_MS, id, now);
  if (!claimed.changes) return null;

  const row = db.prepare("SELECT crm_payload, crm_until FROM leads WHERE id = ?").get(id) as { crm_payload: string; crm_until: number };
  const url = getCrmWebhook();
  const error = url ? await post(url, row.crm_payload) : "No CRM webhook set (Integrations → CRM)";

  if (!error) {
    db.prepare("UPDATE leads SET crm_state = 'delivered', crm_error = NULL, crm_next_at = NULL, crm_sent_at = ? WHERE id = ?").run(
      new Date().toISOString(),
      id,
    );
    return true;
  }
  const giveUp = now + CRM_RETRY_MS > row.crm_until;
  db.prepare("UPDATE leads SET crm_state = ?, crm_error = ?, crm_next_at = CASE WHEN ? THEN NULL ELSE crm_next_at END WHERE id = ?").run(
    giveUp ? "failed" : "pending",
    error.slice(0, 300),
    giveUp ? 1 : 0,
    id,
  );
  console.error(`[crm] lead ${id} not delivered: ${error}.${giveUp ? " Giving up after 24 hours." : " Next try in 5 minutes."}`);
  return false;
}

export function crmQueue(lead: Lead) {
  if (!getCrmWebhook()) return null;
  const now = Date.now();
  return { payload: JSON.stringify(crmPayload(lead)), nextAt: now, until: now + CRM_RETRY_FOR_MS };
}

// manual resend from admin, new 24h window, same payload
export async function resendToCrm(id: string, lead: Lead) {
  const now = Date.now();
  getDb()
    .prepare(
      `UPDATE leads SET crm_state = 'pending', crm_payload = COALESCE(crm_payload, ?), crm_next_at = ?, crm_until = ?, crm_error = NULL
       WHERE id = ? AND (crm_state IS NULL OR crm_state = 'failed')`,
    )
    .run(JSON.stringify(crmPayload(lead)), now, now + CRM_RETRY_FOR_MS, id);
  return deliverToCrm(id);
}

export async function retryDueCrm() {
  const due = getDb()
    .prepare("SELECT id FROM leads WHERE crm_state = 'pending' AND crm_next_at <= ? ORDER BY crm_next_at LIMIT 20")
    .all(Date.now()) as { id: string }[];
  for (const { id } of due) await deliverToCrm(id);
}

const g = globalThis as unknown as { __kindCrmTimer?: ReturnType<typeof setInterval> };

// retry loop, once per process
export function startCrmRetries() {
  if (g.__kindCrmTimer) return;
  const tick = () => retryDueCrm().catch((e) => console.error("[crm] retry run failed:", e));
  g.__kindCrmTimer = setInterval(tick, 60_000);
  g.__kindCrmTimer.unref?.();
  tick();
}
