import type { Metadata } from "next";
import type { PageKey } from "@/content/model";
import { fill, getContent, getSite } from "@/content/store";

type SeoKey = Exclude<PageKey, "service" | "maintenance">;

export function editableMetadata(key: SeoKey, path: string, vars: Record<string, string> = {}) {
  const site = getSite();
  const t = getContent().pages[key];
  return pageMetadata({ title: fill(t.seoTitle, site, vars), description: fill(t.seoDescription, site, vars) || site.description, path });
}

type PageMeta = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
};

export function absoluteUrl(path = "/") {
  return `${getSite().url}${path === "/" ? "" : path}`;
}

const MAX_TITLE = 65;

// Page-level openGraph replaces the root one, so the file-based image has to be listed again.
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Appliance repair in Hillsboro & Beaverton, OR" };

export function pageMetadata({ title, description, path, absoluteTitle, noindex }: PageMeta): Metadata {
  const site = getSite();
  const url = absoluteUrl(path);
  const branded = `${title} | ${site.name}`;
  const fullTitle = absoluteTitle || branded.length > MAX_TITLE ? title : branded;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
