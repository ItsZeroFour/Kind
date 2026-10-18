import { NextResponse } from "next/server";
import { validateLead, type Lead } from "@/lib/leads";
import { dispatchLead } from "@/lib/lead-dispatch";
import { saveLead, setLeadDelivery } from "@/lib/lead-store";
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

  const { website, ...fields } = data;
  const lead: Lead = {
    ...fields,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: "website",
    userAgent: req.headers.get("user-agent") ?? undefined,
  };

  if (website) return NextResponse.json({ ok: true, id: lead.id });

  let saved = false;
  try {
    saveLead(lead);
    saved = true;
  } catch (e) {
    console.error("[lead] could not save to the database:", e);
  }

  const results = await dispatchLead(lead, { saved });
  if (saved) {
    try {
      setLeadDelivery(lead.id, results);
    } catch {}
  }
  return NextResponse.json({ ok: true, id: lead.id });
}
