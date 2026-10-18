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
  website?: string;
};

export type Lead = Omit<LeadInput, "website"> & {
  id: string;
  createdAt: string;
  source: "website";
  userAgent?: string;
};

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : undefined) || undefined;

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
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
  if (!phone || normalizePhone(phone).length !== 10) errors.phone = "Please enter a valid 10-digit phone number.";
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
      website: clean(body.website, 200),
    },
  };
}
