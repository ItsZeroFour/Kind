"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    __kindTracking?: { gtm: boolean; adsSendTo: string };
  }
}

const META_EVENTS: Record<string, string> = {
  generate_lead: "Lead",
  click_to_call: "Contact",
};

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  const config = window.__kindTracking;
  if (!config?.gtm) {
    window.gtag?.("event", event, params);
    if (event === "generate_lead" && config?.adsSendTo) window.gtag?.("event", "conversion", { send_to: config.adsSendTo });
    const metaEvent = META_EVENTS[event];
    if (metaEvent) window.fbq?.("track", metaEvent, params);
  }
}

const KEY = "kind_attribution_v1";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const;
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Touch = {
  ts: number;
  landing_page: string;
  referrer: string;
} & Partial<Record<(typeof UTM)[number] | (typeof CLICK_IDS)[number], string>>;

export type Attribution = { first?: Touch; last?: Touch };

function read(): Attribution {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Attribution;
    if (data.first && Date.now() - data.first.ts > TTL_MS) return {};
    return data;
  } catch {
    return {};
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const touch: Touch = {
    ts: Date.now(),
    landing_page: url.pathname + url.search,
    referrer: document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "",
  };
  let hasCampaign = false;
  for (const k of [...UTM, ...CLICK_IDS]) {
    const v = url.searchParams.get(k);
    if (v) {
      touch[k] = v.slice(0, 200);
      hasCampaign = true;
    }
  }
  const data = read();
  if (!data.first) data.first = touch;
  if (hasCampaign || touch.referrer || !data.last) data.last = touch;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function getAttribution(): Attribution {
  return typeof window === "undefined" ? {} : read();
}
