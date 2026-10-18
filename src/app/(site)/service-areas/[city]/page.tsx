import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { fill, getArea, getAreas, getContent, getFaqs, getServices, getSite } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { LeadForm } from "@/components/forms/LeadForm";
import { CtaBand, FaqSection, PageHero, Process, ReviewsSection, TrustBar } from "@/components/sections";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return getAreas().map((a) => ({ city: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const area = getArea((await params).city);
  if (!area) return {};
  return editableMetadata("city", `/service-areas/${area.slug}`, { city: area.city, county: area.county });
}

export default async function AreaPage({ params }: Props) {
  const area = getArea((await params).city);
  if (!area) notFound();
  const path = `/service-areas/${area.slug}`;
  const others = getAreas().filter((a) => a.slug !== area.slug);
  const site = getSite();
  const t = getContent().pages.city;
  const f = (text: string, city = area.city) => fill(text, site, { city, county: area.county });

  return (
    <>
      <JsonLd
        data={serviceSchema(
          { name: "Appliance Repair", seoDescription: `Residential and commercial appliance repair in ${area.city}, OR.` },
          path,
          area.city.replace(/ \(.*\)/, ""),
        )}
      />
      <PageHero
        eyebrow={f(t.eyebrow)}
        title={f(t.heading)}
        intro={area.intro}
        crumbs={[
          { name: "Service Areas", path: "/service-areas" },
          { name: area.city, path },
        ]}
      />
      <TrustBar />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)]">{f(t.servicesTitle)}</h2>
            <p className="lead-text">
              {f(t.servicesIntro)}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {getServices().map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center gap-4 tile"
                >
                  <span className="tile-ic">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <span className="flex-1">
                    {s.name.replace(" Repair", "")} repair <span className="sr-only">in {area.city}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1" aria-hidden />
                </Link>
              ))}
            </div>

            <h2 className={`mt-14 text-2xl ${area.neighborhoods.length + area.zips.length === 0 ? "hidden" : ""}`}>
              {f(t.neighborhoodsTitle)}
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2 empty:hidden">
              {area.neighborhoods.map((n, i) => (
                <li key={`n${i}`} className="rounded-full bg-surface-2 px-3.5 py-2 text-[0.92rem] font-semibold">
                  {n}
                </li>
              ))}
              {area.zips.map((z, i) => (
                <li key={`z${i}`} className="rounded-full border border-line bg-surface px-3.5 py-2 font-mono text-[0.82rem]">
                  {z}
                </li>
              ))}
            </ul>

            <div className="mt-14 rounded-[18px] border border-line bg-surface-2 p-7">
              <h2 className="text-2xl">{f(t.segmentTitle)}</h2>
              <p className="mt-3 leading-relaxed text-muted">
                {f(t.segmentText)}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/residential-appliance-repair" className="btn btn-ghost btn-sm">
                  Residential repair
                </Link>
                <Link href="/commercial-appliance-repair" className="btn btn-ghost btn-sm">
                  Commercial repair
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-raised">
              <h2 className="text-2xl">{f(t.formTitle)}</h2>
              <p className="mt-1 mb-4 text-[0.93rem] text-muted">{f(t.formIntro)}</p>
              <div>
                <LeadForm formId={`area_${area.slug}`} variant="compact" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Process alt={false} />
      <ReviewsSection />

      <section className="section !pb-0">
        <div className="container-x">
          <h2 className="text-2xl">{f(t.nearbyTitle)}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/service-areas/${a.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[0.92rem] font-semibold no-underline hover:border-leaf"
                >
                  <MapPin className="size-4 text-cta" aria-hidden /> {f(t.nearbyLink, a.city)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection faqs={getFaqs().slice(0, 5)} title={f(t.faqTitle)} />
      <CtaBand title={f(t.ctaTitle)} location={`cta_area_${area.slug}`} />
    </>
  );
}
