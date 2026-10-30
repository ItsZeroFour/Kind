import Link from "next/link";
import { ArrowRight, Building2, Home as HomeIcon } from "lucide-react";
import { fill, getContent, getFaqs, getSite } from "@/content/store";
import { pageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/LeadForm";
import { HeroBackground } from "@/components/sections/HeroBackground";
import {
  Accent,
  AppliancePicker,
  AreasSection,
  BrandsStrip,
  CtaBand,
  FaqSection,
  HeroChips,
  HeroCtas,
  PricingSection,
  Process,
  ReviewsSection,
  TechnicianSection,
  TrustBar,
  WhyUs,
} from "@/components/sections";

export function generateMetadata() {
  const site = getSite();
  const t = getContent().home;
  return pageMetadata({ title: fill(t.seoTitle, site), description: fill(t.seoDescription, site), path: "/", absoluteTitle: true });
}

export default function HomePage() {
  const site = getSite();
  const t = getContent().home;
  const bg = site.heroBg;
  return (
    <>
      <section className="on-brand relative overflow-hidden">
        {bg ? (
          <HeroBackground bg={bg} variant="wide" />
        ) : (
          <div className="pointer-events-none absolute -top-[120px] -right-[120px] size-[420px] rounded-full bg-brand-2 opacity-55" aria-hidden />
        )}
        <div className="container-x relative grid items-center gap-8 pt-8 pb-10 sm:pt-11 sm:pb-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="relative isolate flex flex-col gap-4">
            {bg && <HeroBackground bg={bg} variant="narrow" />}
            {t.heroEyebrow && <p className="eyebrow">{fill(t.heroEyebrow, site)}</p>}
            <h1 className="text-[clamp(2.1rem,1.3rem+3.2vw,3.6rem)]">
              <Accent text={fill(t.heroTitle, site)} />
            </h1>
            {t.heroIntro && <p className={`max-w-[56ch] text-lg ${bg ? "text-on-brand" : "text-on-brand-muted"}`}>{fill(t.heroIntro, site)}</p>}
            <HeroCtas location="hero" />
            <HeroChips />
          </div>

          <div id="quote" className={`card-raised scroll-mt-28 !p-5 text-ink sm:!p-7 ${bg ? "relative !bg-surface/90 backdrop-blur-md" : ""}`}>
            <h2 className="text-[1.4rem]">{t.formTitle}</h2>
            <p className="mt-1 mb-4 text-[0.93rem] text-muted">{fill(t.formIntro, site)}</p>
            <LeadForm formId="home_hero" variant="compact" />
          </div>
        </div>
      </section>

      <TrustBar />
      <AppliancePicker />

      <section className="pb-14 sm:pb-16" aria-label="Home or business">
        <div className="container-x grid gap-3 md:grid-cols-2">
          {[
            {
              href: "/residential-appliance-repair",
              icon: HomeIcon,
              title: t.homeTileTitle,
              text: t.homeTileText,
            },
            {
              href: "/commercial-appliance-repair",
              icon: Building2,
              title: t.bizTileTitle,
              text: t.bizTileText,
            },
          ].map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="tile group !items-start !gap-4 !p-5">
              <span className="tile-ic">
                <Icon aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-display text-lg font-bold">{title}</span>
                <span className="block font-normal text-muted">{text}</span>
              </span>
              <ArrowRight className="mt-1 size-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-cta" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <TechnicianSection />
      <Process />
      <PricingSection />
      <WhyUs />
      <BrandsStrip />
      <ReviewsSection />
      <AreasSection />
      <FaqSection faqs={getFaqs().slice(0, 5)} />
      <CtaBand />
    </>
  );
}
