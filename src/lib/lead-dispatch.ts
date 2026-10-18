import "server-only";
import { getIntegrations, getSite } from "@/content/store";
import type { Lead } from "./leads";

type Result = { destination: string; ok: boolean; error?: string };

async function toWebhooks(lead: Lead): Promise<Result[]> {
  const urls = (process.env.LEAD_WEBHOOK_URL ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  return Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify({ type: "lead.created", lead }),
          signal: AbortSignal.timeout(8000),
        });
        return { destination: `webhook:${new URL(url).host}`, ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
      } catch (e) {
        return { destination: "webhook", ok: false, error: String(e) };
      }
    }),
  );
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function toEmail(lead: Lead): Promise<Result[]> {
  const key = process.env.RESEND_API_KEY;
  const to = getIntegrations().leadEmail;
  if (!key || !to) return [];
  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Customer", lead.customerType],
    ["Appliance", lead.applianceType],
    ["Brand", lead.brand],
    ["ZIP", lead.zip],
    ["Urgency", lead.urgency],
    ["Preferred date", lead.preferredDate],
    ["Preferred time", lead.preferredTime],
    ["Problem", lead.problem],
    ["Form", lead.formId],
    ["Page", lead.pageUrl],
  ];
  const html = `<h2>New service request</h2><table cellpadding="6">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(String(v))}</td></tr>`)
    .join("")}</table><pre style="font-size:12px;color:#666">${esc(JSON.stringify(lead.attribution ?? {}, null, 2))}</pre>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || `${getSite().name} <onboarding@resend.dev>`,
        to: to.split(",").map((s) => s.trim()),
        reply_to: lead.email,
        subject: `New lead: ${lead.applianceType ?? "Appliance"}, ${lead.name} (${lead.zip ?? "no ZIP"})`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return [{ destination: "email", ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` }];
  } catch (e) {
    return [{ destination: "email", ok: false, error: String(e) }];
  }
}

const destinations = [toWebhooks, toEmail];

export async function dispatchLead(lead: Lead, { saved = false } = {}) {
  const results = (await Promise.all(destinations.map((d) => d(lead)))).flat();
  if (results.length === 0 && !saved) {
    console.warn("[lead] No destinations configured (LEAD_WEBHOOK_URL / RESEND_API_KEY). Lead:", JSON.stringify(lead));
  }
  for (const r of results.filter((r) => !r.ok)) {
    console.error(`[lead] ${r.destination} failed: ${r.error}. Lead:`, JSON.stringify(lead));
  }
  return results;
}
