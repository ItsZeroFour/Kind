import { fill, getPrices, getSite } from "@/content/store";
import { pageMetadata } from "@/lib/seo";
import { priceListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { CtaBand, HeroCtas, PageHero } from "@/components/sections";
import { DiagnosticsBlock, PriceList } from "@/components/sections/pricing";

export function generateMetadata() {
  const site = getSite();
  const t = getPrices();
  return pageMetadata({ title: fill(t.seoTitle, site), description: fill(t.seoDescription, site), path: "/pricing" });
}

const jump = [
  { href: "#diagnostics", label: "Diagnostics", segment: null },
  { href: "#maintenance", label: "Maintenance", segment: "maintenance" },
  { href: "#home", label: "Home repair", segment: "residential" },
  { href: "#commercial", label: "Commercial", segment: "commercial" },
  { href: "#high-end", label: "High-end", segment: "premium" },
] as const;

export default function PricingPage() {
  const site = getSite();
  const t = getPrices();
  const links = jump.filter((j) => !j.segment || t.categories.some((c) => c.segment === j.segment));
  return (
    <>
      <JsonLd data={priceListSchema(t.categories, "/pricing")} />
      <PageHero eyebrow={t.eyebrow} title={fill(t.heading, site)} intro={fill(t.intro, site)} crumbs={[{ name: "Pricing", path: "/pricing" }]}>
        <HeroCtas location="pricing_hero" />
        <nav aria-label="Price list sections">
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="chip text-on-brand no-underline transition hover:border-white/60 hover:bg-white/10">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <DiagnosticsBlock />
      <PriceList />
      <CtaBand title={fill(t.ctaTitle, site) || undefined} text={fill(t.ctaText, site) || undefined} location="cta_pricing" />
    </>
  );
}
