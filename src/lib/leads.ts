export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  applianceType?: string;
  brand?: string;
  problem?: string;
  zip?: string;
  preferredDate?: string;
  preferredTime?: string;
  urgency?: string;
  customerType?: "residential" | "commercial";
  formId?: string;
  pageUrl?: string;
  attribution?: unknown;
  /** The required “calls and texts” checkbox */
  consent?: boolean;
  /** Made by the form once per filled-in request, so a double click or a retry never creates a second lead */
  submissionId?: string;
  website?: string;
};

export type Lead = Omit<LeadInput, "website" | "submissionId"> & {
  id: string;
  createdAt: string;
  source: "website";
  userAgent?: string;
  /** +15035550142 */
  phoneE164?: string;
  /** Which form, in words: “Home page, first screen form”, “Maintenance kit button on /pricing”… */
  formLabel?: string;
  /** Where the visitor came from, in words: “Google Ads · campaign …”, “Meta ads”, “Google search (organic)”… */
  channel?: string;
  /** The maintenance kit chosen, when the appliance choice is a kit */
  kit?: string;
  /** The consent text the customer saw next to the checkbox */
  consentText?: string;
};

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

export const PHONE_ERROR = "Please enter a valid US phone number";
export const CONSENT_ERROR = "Please check this box so we can call or text you about your request.";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : undefined) || undefined;

/** Any way of typing a US number → +1XXXXXXXXXX, or null. The CRM texts and calls only this format. */
export function normalizeUSPhone(input: string) {
  const d = String(input).replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d[0] === "1") return "+" + d;
  return null;
}

const touchKeys = [
  "landing_page",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
];

function cleanTouch(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const t = raw as Record<string, unknown>;
  const out: Record<string, string | number> = {};
  if (typeof t.ts === "number" && Number.isFinite(t.ts)) out.ts = t.ts;
  for (const k of touchKeys) {
    const v = clean(t[k], 300);
    if (v) out[k] = v;
  }
  return out;
}

function cleanAttribution(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const a = raw as Record<string, unknown>;
  const first = cleanTouch(a.first);
  const last = cleanTouch(a.last);
  return first || last ? { first, last } : undefined;
}

export function validateLead(body: Record<string, unknown>): { data?: LeadInput; errors?: FieldErrors } {
  const errors: FieldErrors = {};
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 200);
  const zip = clean(body.zip, 10);

  if (!name || name.length < 2) errors.name = "Please enter your name.";
  if (!phone || !normalizeUSPhone(phone)) errors.phone = PHONE_ERROR;
  if (body.consent !== true && body.consent !== "on") errors.consent = CONSENT_ERROR;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (zip && !/^\d{5}$/.test(zip)) errors.zip = "ZIP code should be 5 digits.";

  if (Object.keys(errors).length) return { errors };

  return {
    data: {
      name: name!,
      phone: phone!,
      email,
      applianceType: clean(body.applianceType, 60),
      brand: clean(body.brand, 60),
      problem: clean(body.problem, 2000),
      zip,
      preferredDate: clean(body.preferredDate, 20),
      preferredTime: clean(body.preferredTime, 60),
      urgency: clean(body.urgency, 20),
      customerType: body.customerType === "commercial" ? "commercial" : "residential",
      formId: clean(body.formId, 40),
      pageUrl: clean(body.pageUrl, 500),
      attribution: cleanAttribution(body.attribution),
      consent: true,
      submissionId: typeof body.submissionId === "string" && UUID.test(body.submissionId) ? body.submissionId.toLowerCase() : undefined,
      website: clean(body.website, 200),
    },
  };
}
