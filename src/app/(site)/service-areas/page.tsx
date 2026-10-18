import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { fill, getAreas, getContent, getSite } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { CtaBand, PageHero, ServicesGrid } from "@/components/sections";

export const generateMetadata = () => editableMetadata("areas", "/service-areas");

export default function ServiceAreasPage() {
  const site = getSite();
  const t = getContent().pages.areas;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={fill(t.heading, site)} intro={fill(t.intro, site)} crumbs={[{ name: "Service Areas", path: "/service-areas" }]} />
      <section className="section">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {getAreas().map((a) => (
              <Link
                key={a.slug}
                href={`/service-areas/${a.slug}`}
                className={`group flex flex-col rounded-[18px] border p-6 no-underline transition hover:-translate-y-0.5 hover:shadow-soft ${a.primary ? "on-brand border-brand" : "border-line bg-surface hover:border-leaf"}`}
              >
                <MapPin className={`size-7 ${a.primary ? "text-peach" : "text-cta"}`} aria-hidden />
                <h2 className={`mt-4 text-[1.4rem]`}>{fill(t.cardTitle, site, { city: a.city })}</h2>
                <p className={`mt-2 flex-1 ${a.primary ? "text-on-brand-muted" : "text-muted"}`}>{a.intro}</p>
                {a.zips.length > 0 && <p className={`mt-4 text-sm font-mono text-[0.8rem] ${a.primary ? "text-on-brand-muted" : "text-muted"}`}>ZIP codes: {a.zips.join(", ")}</p>}
                <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold ${a.primary ? "text-peach" : "text-cta"}`}>
                  {fill(t.cardLink, site, { city: a.city })} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
          {(t.missingText || t.missingLink) && (
            <p className="mt-10 text-center text-muted">
              {fill(t.missingText, site)}{" "}
              {t.missingLink && (
                <Link href="/contact" className="font-bold text-ink underline">
                  {t.missingLink}
                </Link>
              )}
            </p>
          )}
        </div>
      </section>
      <ServicesGrid />
      <CtaBand />
    </>
  );
}
