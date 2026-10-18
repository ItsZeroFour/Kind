import { getAreas, getServices, getSite } from "@/content/store";
import type { Service } from "@/content/services";
import type { Faq } from "@/content/faqs";
import type { PriceCategory } from "@/content/prices";
import { absoluteUrl } from "./seo";

const businessId = () => `${getSite().url}/#business`;

export function localBusinessSchema() {
  const site = getSite();
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": businessId(),
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.phone.e164,
    email: site.email,
    image: absoluteUrl(site.logo.image),
    logo: absoluteUrl(site.logo.image),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      ...(site.address.street ? { streetAddress: site.address.street } : {}),
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: getAreas().map((a) => ({ "@type": "City", name: `${a.city.replace(/ \(.*\)/, "")}, OR` })),
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Appliance Repair Services",
      itemListElement: getServices().map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/services/${s.slug}`) },
      })),
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function serviceSchema(service: Pick<Service, "name" | "seoDescription">, path: string, areaName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: areaName ? `${service.name} in ${areaName}` : service.name,
    serviceType: service.name,
    description: service.seoDescription,
    url: absoluteUrl(path),
    provider: { "@id": businessId() },
    areaServed: areaName
      ? { "@type": "City", name: `${areaName}, OR` }
      : getAreas().map((a) => ({ "@type": "City", name: `${a.city.replace(/ \(.*\)/, "")}, OR` })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function priceListSchema(categories: PriceCategory[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Appliance repair price list",
    url: absoluteUrl(path),
    itemListElement: categories
      .filter((c) => c.items.some((i) => i.price > 0))
      .map((c) => ({
        "@type": "OfferCatalog",
        name: c.title,
        itemListElement: c.items
          .filter((i) => i.price > 0)
          .map((i) => ({
            "@type": "Offer",
            price: i.price,
            priceCurrency: "USD",
            itemOffered: { "@type": "Service", name: `${c.title}: ${i.name}`, provider: { "@id": businessId() } },
          })),
      })),
  };
}
