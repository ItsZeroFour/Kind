import type { MetadataRoute } from "next";
import { getAreas, getServices } from "@/content/store";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...getServices().map((s) => page(`/services/${s.slug}`, 0.9)),
    page("/residential-appliance-repair", 0.8),
    page("/commercial-appliance-repair", 0.8),
    page("/pricing", 0.8),
    page("/service-areas", 0.8),
    ...getAreas().map((a) => page(`/service-areas/${a.slug}`, a.primary ? 0.9 : 0.7)),
    page("/reviews", 0.6, "weekly"),
    page("/about", 0.5),
    page("/faq", 0.5),
    page("/contact", 0.7),
    page("/book", 0.7),
    page("/privacy-policy", 0.2, "yearly"),
  ];
}
