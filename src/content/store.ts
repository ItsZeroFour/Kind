import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/db";
import { parseEmbed } from "@/lib/embed";
import { integrations as envIntegrations } from "@/config/site";
import { defaultChatWidget, defaults, mergeDeep, parsePhone, type Content, type SectionKey } from "./model";
import type { Service } from "./services";

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
  // Services saved before the page type existed: the maintenance page is recognised by its address.
  content.services = {
    ...content.services,
    items: content.services.items.map((s) => ({
      ...s,
      pageType: s.pageType ?? (/maintenance/.test(s.slug) ? "maintenance" : "repair"),
    })),
  };
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

export const isMaintenance = (s: Pick<Service, "pageType">) => s.pageType === "maintenance";

/** Real reviews exist, either typed in Reviews or from an embedded widget. Until then the reviews block, page and menu item stay hidden. */
export const hasReviews = () => getReviews().length > 0 || getIntegrations().reviewsWidget.length > 0;

const fallbackPhone = parsePhone(defaults.business.phone)!;

// The host answers on the bare domain and 301s www to it, so canonical URLs never use www.
const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "https://kindappliancerepair.com").replace(/\/$/, "").replace("://www.", "://");

const bundledHero = { desktop: "/images/hero/kind-hero-desktop.webp", mobile: "/images/hero/kind-hero-mobile.webp" };
const bundled = (p: string) => (existsSync(path.join(/*turbopackIgnore: true*/ process.cwd(), "public", p)) ? p : "");

function heroBackground(bg: Content["brand"]["heroBg"]) {
  if (!bg.enabled) return null;
  const desktop = bg.desktop || bundled(bundledHero.desktop);
  const mobile = bg.mobile || bundled(bundledHero.mobile) || desktop;
  if (!desktop && !mobile) return null;
  return { desktop: desktop || mobile, mobile, shadeDesktop: bg.shadeDesktop, shadeMobile: bg.shadeMobile };
}

export function getSite() {
  const { business: b, brand } = getContent();
  return {
    ...b,
    url: siteUrl(),
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
    heroBg: heroBackground(brand.heroBg),
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

/** Maintenance kits from Prices (Kitchen Care Kit, …): their names are form choices like the appliances. */
export function getKits() {
  return getPrices()
    .categories.filter((c) => c.segment === "maintenance")
    .map((c) => c.title.trim())
    .filter(Boolean);
}

export function getBookingForm() {
  const site = getSite();
  const f = getContent().form;
  const u = f.urgency;
  const appliances = f.appliances.length ? f.appliances : defaults.form.appliances;
  const kits = f.includeKits ? getKits().filter((k) => !appliances.some((a) => a.name === k)) : [];
  return {
    appliances: [...appliances, ...kits.map((name) => ({ name, icon: "kit" }))],
    creditNote: site.pricing.creditedOnRepair ? fill(f.creditNote, site) : "",
    compactComment: f.compactComment,
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
    consentText: fill(f.consentText || defaults.form.consentText, site),
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

/** “Book this service” on a maintenance kit: the form opens with the kit chosen, and the lead shows it came from a kit button. */
export function kitHref(kit: string, from: string) {
  return `/book?appliance=${encodeURIComponent(kit.trim())}&from=${encodeURIComponent(`kit_${from}`)}`;
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
    chatWidget: !c.chatEnabled
      ? []
      : parseEmbed(
          c.chatWidget.trim() ||
            (envIntegrations.chatWidgetSrc ? `<script src="${envIntegrations.chatWidgetSrc}"></script>` : defaultChatWidget),
        ),
    reviewsWidget: parseEmbed(c.reviewsWidget),
    redirects: c.redirects,
    leadEmail: c.leadEmail || process.env.LEAD_NOTIFY_EMAIL || "",
  };
}

/** Where leads go in the CRM. Server only: every POST there starts paid texts and calls. */
export function getCrmWebhook() {
  const url = (getContent().integrations.crmWebhookUrl || process.env.LEAD_WEBHOOK_URL || "").split(",")[0].trim();
  return /^https?:\/\/\S+$/i.test(url) ? url : "";
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
