import type { Attribution, Touch } from "./tracking";

/** Human-readable “which form” for a lead, from the form id and the page it was sent from. */
export function describeForm(formId = "", pageUrl = "") {
  let from = "";
  try {
    from = new URL(pageUrl).searchParams.get("from") ?? "";
  } catch {}
  if (from.startsWith("kit_")) return `Maintenance kit button on /${from.slice(4)}`;

  const [, kind, rest] = formId.match(/^(service|area)_(.+)$/) ?? [];
  if (kind === "service") return `Service page form: /services/${rest}`;
  if (kind === "area") return `City page form: /service-areas/${rest}`;
  const fixed: Record<string, string> = {
    home_hero: "Home page, first screen form",
    book_page: "Booking page /book",
    contact_page: "Contact page /contact",
    about_page: "About page form",
    residential_page: "For homes page form",
    commercial_page: "For businesses page form",
  };
  return fixed[formId] ?? (formId || "Unknown form");
}

const META_SOURCES = /^(facebook|fb|instagram|ig|meta)$/i;

function host(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Where a visit came from, in words: ad network, UTM tags, organic search, a link, or a direct visit. */
export function describeTouch(t: Touch | undefined) {
  if (!t) return null;
  const campaign = t.utm_campaign ? ` · campaign “${t.utm_campaign}”` : "";
  if (t.gclid || t.gbraid || t.wbraid) return `Google Ads${campaign}`;
  if (t.fbclid || META_SOURCES.test(t.utm_source ?? "")) return `${/cpc|paid|ads?/i.test(t.utm_medium ?? "") || t.fbclid ? "Meta ads" : "Facebook / Instagram"}${campaign}`;
  if (t.msclkid) return `Microsoft Ads${campaign}`;
  if (t.utm_source) return `UTM: ${[t.utm_source, t.utm_medium, t.utm_campaign].filter(Boolean).join(" / ")}`;
  if (t.referrer) {
    const h = host(t.referrer);
    if (/(^|\.)google\./.test(h)) return "Google search (organic)";
    if (/(^|\.)(bing|duckduckgo|yahoo|brave)\./.test(h)) return `Search (organic): ${h}`;
    if (/(^|\.)(facebook|instagram)\./.test(h)) return "Facebook / Instagram (organic)";
    return `Link from ${h}`;
  }
  return "Direct visit";
}

export function describeSource(attribution: unknown) {
  const a = (attribution ?? {}) as Attribution;
  return describeTouch(a.last) ?? describeTouch(a.first) ?? "Not recorded";
}

/** The UTM tags and click ids of the visit that led to the lead (last touch, falling back to the first). */
export function campaignTags(attribution: unknown) {
  const a = (attribution ?? {}) as Attribution;
  const t = a.last ?? a.first;
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
  return Object.fromEntries(keys.map((k) => [k, t?.[k] ?? ""])) as Record<(typeof keys)[number], string>;
}
