import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { fill, getContent, getFaqs, getServices, getSite } from "@/content/store";
import { pageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/LeadForm";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { CtaBand, FaqSection, PageHero, Process, ReviewsSection, SectionHeader } from "@/components/sections";

type Segment = "residential" | "commercial";

const paths: Record<Segment, string> = {
  residential: "/residential-appliance-repair",
  commercial: "/commercial-appliance-repair",
};

export function segmentMetadata(segment: Segment) {
  const site = getSite();
  const t = getContent()[segment];
  return pageMetadata({
    title: fill(t.seoTitle || t.title, site),
    description: fill(t.seoDescription || t.intro, site) || site.description,
    path: paths[segment],
  });
}

export function SegmentPage({ segment }: { segment: Segment }) {
  const site = getSite();
  const t = getContent()[segment];
  const path = paths[segment];
  const title = fill(t.title, site);
  const faqs = t.faqs.length ? t.faqs : getFaqs().slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={title}
        intro={fill(t.intro, site)}
        crumbs={[{ name: title.replace(/ in .*/, ""), path }]}
      />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {t.body.length > 0 && (
              <div className="prose-kind text-lg">
                {t.body.map((p, i) => (
                  <p key={i}>{fill(p, site)}</p>
                ))}
              </div>
            )}

            {t.audience.length > 0 && (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {t.audience.map((a, i) => (
                  <li key={i} className="card">
                    <h3 className="text-lg">{a.title}</h3>
                    {a.text && <p className="mt-1.5 text-muted">{fill(a.text, site)}</p>}
                  </li>
                ))}
              </ul>
            )}

            {t.equipment.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl">{t.equipmentTitle}</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {t.equipment.map((e, i) => (
                    <li key={i} className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[0.92rem] font-semibold">
                      <Check className="size-4 text-ok" aria-hidden /> {e}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {t.benefits.length > 0 && (
              <div className="mt-12 on-brand rounded-[18px] p-7">
                <h2 className="text-2xl">{t.benefitsTitle}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {t.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-5 shrink-0 text-peach" aria-hidden /> {fill(b, site)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-raised">
              <h2 className="text-2xl">{t.formTitle}</h2>
              {t.formIntro && <p className="mt-1 mb-4 text-[0.93rem] text-muted">{fill(t.formIntro, site)}</p>}
              <div>
                <LeadForm formId={`${segment}_page`} variant="compact" defaultCustomerType={segment} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {t.servicesTitle && (
        <section className="section !pt-0">
          <div className="container-x">
            <SectionHeader eyebrow="Services" title={t.servicesTitle} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getServices().map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center gap-4 tile">
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
      )}

      <Process alt={false} />
      <ReviewsSection />
      <FaqSection faqs={faqs} />
      <CtaBand location={`cta_${segment}`} />
    </>
  );
}
