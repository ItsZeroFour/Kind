import "server-only";
import { getDb } from "@/lib/db";
import { integrations as envIntegrations } from "@/config/site";
import { defaults, mergeDeep, parsePhone, type Content, type SectionKey } from "./model";

let cache: { version: number; content: Content } | undefined;

function dataVersion() {
  return (getDb().prepare("PRAGMA data_version").get() as { data_version: number }).data_version;
}

export function getContent(): Content {
  const version = dataVersion();
  if (cache && cache.version === version) return cache.content;
  const rows = getDb().prepare("SELECT key, value FROM content").all() as { key: string; value: string }[];
  const saved = Object.fromEntries(rows.map((r) => [r.key, safeParse(r.value)]));
  const content = Object.fromEntries(
    (Object.keys(defaults) as SectionKey[]).map((k) => [k, mergeDeep(defaults[k], saved[k])]),
  ) as Content;
  cache = { version, content };
  return content;
}

export function getSection<K extends SectionKey>(key: K): Content[K] {
  return getContent()[key];
}

export function saveSection(key: SectionKey, value: unknown, userId: number) {
  const json = JSON.stringify(value);
  const db = getDb();
  db.exec("BEGIN");
  try {
    db.prepare(
      `INSERT INTO content (key, value, updated_at, updated_by) VALUES (?, ?, datetime('now'), ?)
       ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    ).run(key, json, userId);
    db.prepare("INSERT INTO revisions (key, value, user_id) VALUES (?, ?, ?)").run(key, json, userId);
    db.prepare("DELETE FROM revisions WHERE key = ? AND id NOT IN (SELECT id FROM revisions WHERE key = ? ORDER BY id DESC LIMIT 50)").run(key, key);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  cache = undefined;
}

export function resetSection(key: SectionKey) {
  getDb().prepare("DELETE FROM content WHERE key = ?").run(key);
  cache = undefined;
}

export function sectionMeta() {
  const rows = getDb()
    .prepare("SELECT c.key, c.updated_at, u.email FROM content c LEFT JOIN users u ON u.id = c.updated_by")
    .all() as { key: string; updated_at: string; email: string | null }[];
  return Object.fromEntries(rows.map((r) => [r.key, { updatedAt: r.updated_at, by: r.email }]));
}

export function listRevisions(key: SectionKey, limit = 20) {
  return (
    getDb()
    .prepare("SELECT r.id, r.created_at, u.email FROM revisions r LEFT JOIN users u ON u.id = r.user_id WHERE r.key = ? ORDER BY r.id DESC LIMIT ?")
      .all(key, limit) as { id: number; created_at: string; email: string | null }[]
  ).map((r) => ({ ...r }));
}

export function getRevision(key: SectionKey, id: number) {
  const row = getDb().prepare("SELECT value FROM revisions WHERE key = ? AND id = ?").get(key, id) as { value: string } | undefined;
  return row ? safeParse(row.value) : undefined;
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

export const getServices = () => getContent().services.items;
export const getService = (slug: string) => getServices().find((s) => s.slug === slug);
export const getBrands = () => getContent().services.brands;
export const getAreas = () => getContent().areas.items;
export const getArea = (slug: string) => getAreas().find((a) => a.slug === slug);
export const getFaqs = () => getContent().faqs.items;
export const getReviews = () => getContent().reviews.items;
export const getPrices = () => getContent().prices;

const fallbackPhone = parsePhone(defaults.business.phone)!;

export function getSite() {
  const { business: b, brand } = getContent();
  return {
    ...b,
    url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kindappliancerepair.com").replace(/\/$/, ""),
    phone: parsePhone(b.phone) ?? fallbackPhone,
    geo: { lat: 45.5229, lng: -122.9898 },
    hours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    logo: { image: brand.logo || "/images/logo.png", custom: Boolean(brand.logo), word: brand.wordmark, sub: brand.wordmarkSub },
    technician: brand.technician,
    photos: { hero: brand.photos.hero, work: brand.photos.work, pets: [brand.photos.pet1, brand.photos.pet2] },
  };
}
export type Site = ReturnType<typeof getSite>;

export function fill(text: string, site: Site = getSite(), extra: Record<string, string> = {}) {
  const vars: Record<string, string> = {
    ...extra,
    company: site.name,
    phone: site.phone.display,
    email: site.email,
    price: `$${site.pricing.serviceCall}`,
    commercialPrice: `$${site.pricing.commercialServiceCall}`,
    tech: site.technician.name,
    years: site.technician.years,
    warranty: site.promises.warranty.toLowerCase(),
    hours: site.hoursShort,
  };
  return text.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);
}

export function getBookingForm() {
  const f = getContent().form;
  const u = f.urgency;
  return {
    appliances: f.appliances.length ? f.appliances : defaults.form.appliances,
    urgency: [
      { value: "standard", label: u.standard.label, hint: u.standard.hint },
      ...(u.today.enabled ? [{ value: "today", label: u.today.label, hint: u.today.hint }] : []),
      ...(u.emergency.enabled ? [{ value: "emergency", label: u.emergency.label, hint: u.emergency.hint }] : []),
    ],
    windows: f.windows,
    stepAppliance: f.stepAppliance,
    stepUrgency: f.stepUrgency,
    stepContact: f.stepContact,
    submitFull: f.submitFull,
    submitCompact: f.submitCompact,
    note: f.note,
    callPrompt: f.callPrompt,
  };
}

/** The booking form appliance a service page preselects: the first one with the service's icon. */
export function applianceFor(service: { icon: string }) {
  return getBookingForm().appliances.find((a) => a.icon === service.icon)?.name ?? "";
}

export function bookHref(service?: { icon: string }) {
  const a = service && applianceFor(service);
  return a ? `/book?appliance=${encodeURIComponent(a)}` : "/book";
}

/** Admin values win; empty fields fall back to the server env. */
export function getIntegrations() {
  const c = getContent().integrations;
  return {
    gtmId: c.gtmId || envIntegrations.gtmId,
    ga4Id: c.ga4Id || envIntegrations.ga4Id,
    googleAdsId: c.googleAdsId || envIntegrations.googleAdsId,
    googleAdsLeadLabel: c.googleAdsLeadLabel || envIntegrations.googleAdsLeadLabel,
    metaPixelId: c.metaPixelId || envIntegrations.metaPixelId,
    googleSiteVerification: c.googleSiteVerification || envIntegrations.googleSiteVerification,
    bookingUrl: c.bookingUrl || envIntegrations.bookingUrl,
    callTrackingScript: envIntegrations.callTrackingScript,
    chatWidgetSrc: envIntegrations.chatWidgetSrc,
    leadEmail: c.leadEmail || process.env.LEAD_NOTIFY_EMAIL || "",
  };
}

export function getPublicSite() {
  const s = getSite();
  return {
    name: s.name,
    phone: s.phone,
    hoursShort: s.hoursShort,
    hoursNote: s.hoursNote,
    areasLine: s.areasLine,
    pricing: s.pricing,
    logo: s.logo,
    form: getBookingForm(),
  };
}
export type PublicSite = ReturnType<typeof getPublicSite>;
