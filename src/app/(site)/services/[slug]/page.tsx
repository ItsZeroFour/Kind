import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Check, MapPin } from "lucide-react";
import { applianceFor, bookHref, fill, getAreas, getBrands, getContent, getFaqs, getService, getServices, getSite, isMaintenance } from "@/content/store";
import type { Service } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { LeadForm } from "@/components/forms/LeadForm";
import { ServicePrices } from "@/components/sections/pricing";
import { CtaBand, FaqSection, HeroChips, HeroCtas, PageHero, PricingSection, Process, ReviewsSection } from "@/components/sections";

type Props = { params: Promise<{ slug: string }> };

/** Page phrases: the repair template, with the maintenance template on top for maintenance pages. */
const phrases = (service: Service) => {
  const site = getSite();
  const vars = { service: service.name, appliance: service.appliance };
  const { service: repair, maintenance } = getContent().pages;
  const t = isMaintenance(service)
    ? { ...repair, introTitle: maintenance.introTitle, formTitle: maintenance.formTitle, relatedTitle: maintenance.relatedTitle, ctaTitle: maintenance.ctaTitle }
    : repair;
  return { t, f: (text: string) => fill(text, site, vars) };
};

export const dynamicParams = true;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle || phrases(service).f(phrases(service).t.heading),
    description: service.seoDescription || service.short,
    path: `/services/${service.slug}`,
  });
}

const chip = "flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[0.92rem] font-semibold";

export default async function ServicePage({ params }: Props) {
  const site = getSite();
  const service = getService((await params).slug);
  if (!service) notFound();
  const path = `/services/${service.slug}`;
  const related = getServices().filter((s) => s.slug !== service.slug).slice(0, 4);
  const { t, f } = phrases(service);
  const maintenance = isMaintenance(service);

  return (
    <>
      <JsonLd data={serviceSchema({ ...service, seoDescription: service.seoDescription || service.short }, path)} />
      <PageHero
        eyebrow={f(t.eyebrow)}
        title={f(t.heading)}
        intro={service.short}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path },
        ]}
      >
        <HeroCtas location={`service_${service.slug}`} book={maintenance ? "/book" : bookHref(service)} />
        <HeroChips />
      </PageHero>

      <section className="section">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <div className="flex items-center gap-4">
              <span className="tile-ic !size-14">
                <ServiceIcon name={service.icon} className="!size-7" />
              </span>
              <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)]">{f(t.introTitle)}</h2>
            </div>
            <div className="prose-kind mt-5 text-[1.05rem]">
              {service.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {service.problems.length > 0 && (
              <>
                <h2 className="mt-11 text-2xl">{f(t.problemsTitle)}</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {service.problems.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-[10px] border border-line bg-surface px-4 py-3.5">
                      <AlertCircle className="mt-0.5 size-5 shrink-0 text-cta" aria-hidden />
                      <span className="font-semibold">{p}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {service.types.length > 0 && (
              <>
                <h2 className="mt-11 text-2xl">{f(t.typesTitle)}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.types.map((t, i) => (
                    <li key={i} className={chip}>
                      <Check className="size-4 text-ok" aria-hidden /> {t}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {getBrands().length > 0 && (
              <>
                <h2 className="mt-11 text-2xl">{f(t.brandsTitle)}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {getBrands().slice(0, 14).map((b, i) => (
                    <li key={i} className={chip}>
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="mt-11 text-2xl">{f(t.nearTitle)}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {getAreas().map((a) => (
                <li key={a.slug}>
                  <Link href={`/service-areas/${a.slug}`} className={`${chip} no-underline hover:border-leaf`}>
                    <MapPin className="size-4 text-cta" aria-hidden /> {a.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="card-raised">
              <h2 className="text-[1.4rem]">{f(t.formTitle)}</h2>
              {t.formIntro && <p className="mt-1 mb-4 text-[0.93rem] text-muted">{f(t.formIntro)}</p>}
              <LeadForm formId={`service_${service.slug}`} variant="compact" defaultAppliance={maintenance ? "" : applianceFor(service)} />
            </div>
            <div className="on-brand rounded-[18px] p-6">
              <p className="font-display text-lg font-bold">{f(t.callTitle)}</p>
              <PhoneLink
                location={`service_aside_${service.slug}`}
                showIcon={false}
                className="mt-1 block font-display text-[1.9rem] font-bold text-peach no-underline hover:text-white"
              />
              {t.callNote && <p className="mt-1 text-sm text-on-brand-muted">{f(t.callNote)}</p>}
            </div>
          </aside>
        </div>
      </section>

      <ServicePrices service={service} />
      <Process />
      {!maintenance && <PricingSection />}

      <section className="section !pt-0">
        <div className="container-x">
          <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)]">{f(t.relatedTitle)}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="tile group">
                <span className="tile-ic">
                  <ServiceIcon name={s.icon} />
                </span>
                <span className="flex-1">{s.name}</span>
                <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
      <FaqSection title={f(t.faqTitle)} faqs={[...service.faqs, ...getFaqs().slice(0, 3)]} />
      <CtaBand title={f(t.ctaTitle)} location={`cta_${service.slug}`} />
    </>
  );
}
