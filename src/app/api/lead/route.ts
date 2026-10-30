import { NextResponse } from "next/server";
import { getBookingForm, getKits } from "@/content/store";
import { crmQueue, deliverToCrm, postToCrmOnce, startCrmRetries } from "@/lib/crm";
import { normalizeUSPhone, validateLead, type Lead } from "@/lib/leads";
import { describeForm, describeSource } from "@/lib/lead-labels";
import { dispatchLead } from "@/lib/lead-dispatch";
import { isDuplicateLead, saveLead, setLeadDelivery } from "@/lib/lead-store";
import { createLimiter } from "@/lib/rate-limit";
import { bodyTooLarge, clientIp, isCrossSite } from "@/lib/request";

const submissions = createLimiter(10 * 60 * 1000, 6);
const MAX_BODY_BYTES = 20_000;

export async function POST(req: Request) {
  if (isCrossSite(req)) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });

  const ip = clientIp(req.headers);
  if (submissions.isLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please call us instead." }, { status: 429 });
  }
  submissions.hit(ip);

  if (bodyTooLarge(req, MAX_BODY_BYTES)) return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { data, errors } = validateLead(body);
  if (!data) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const { website, submissionId, ...fields } = data;
  const lead: Lead = {
    ...fields,
    id: submissionId ?? crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: "website",
    userAgent: req.headers.get("user-agent") ?? undefined,
    phoneE164: normalizeUSPhone(fields.phone) ?? undefined,
    formLabel: describeForm(fields.formId, fields.pageUrl),
    channel: describeSource(fields.attribution),
    kit: fields.applianceType && getKits().includes(fields.applianceType) ? fields.applianceType : undefined,
    consentText: getBookingForm().consentText,
  };

  if (website) return NextResponse.json({ ok: true, id: lead.id });

  startCrmRetries();
  let saved = false;
  try {
    saveLead(lead, crmQueue(lead));
    saved = true;
  } catch (e) {
    // The same submission again: the first one is saved and on its way to the CRM, so nothing is sent twice.
    if (isDuplicateLead(e)) return NextResponse.json({ ok: true, id: lead.id });
    console.error("[lead] could not save to the database:", e);
  }

  if (saved) await deliverToCrm(lead.id);
  else await postToCrmOnce(lead);

  const results = await dispatchLead(lead, { saved });
  if (saved) {
    try {
      setLeadDelivery(lead.id, results);
    } catch {}
  }
  return NextResponse.json({ ok: true, id: lead.id });
}
