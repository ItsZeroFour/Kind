import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CircleCheck, Clock, MapPin, PawPrint, Plus, ShieldCheck, Star, Tag } from "lucide-react";
import { bookHref, fill, getAreas, getBrands, getContent, getIntegrations, getReviews, getServices, getSite, hasReviews } from "@/content/store";
import type { Review } from "@/content/reviews";
import type { Faq } from "@/content/faqs";
import { faqSchema } from "@/lib/schema";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { Photo } from "@/components/ui/Photo";
import { EmbedWidget } from "@/components/ui/EmbedWidget";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { TrackedLink } from "@/components/ui/TrackedLink";

const priceOf = (site: ReturnType<typeof getSite>) => `$${site.pricing.serviceCall}`;

export function Accent({ text }: { text: string }) {
  return text.endsWith(".") ? (
    <>
      {text.slice(0, -1)}
      <span className="text-dot">.</span>
    </>
  ) : (
    <>{text}</>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-[760px] text-center [&_.lead-text]:mx-auto" : "max-w-[760px]"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h-section">{title}</h2>
      {intro && <p className="lead-text">{intro}</p>}
    </div>
  );
}

export function HeroChips() {
  const site = getSite();
  const t = getContent().blocks;
  const chips = [
    { icon: Clock, label: site.hoursShort },
    { icon: Tag, label: fill(t.heroChipPrice, site) },
    { icon: ShieldCheck, label: site.promises.warranty },
    { icon: PawPrint, label: t.heroChipPets },
  ].filter((c) => c.label);
  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map(({ icon: Icon, label }) => (
        <li key={label} className="chip">
          <Icon aria-hidden /> {label}
        </li>
      ))}
    </ul>
  );
}

export function HeroCtas({ location, book = "/book" }: { location: string; book?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <PhoneLink location={location} className="btn btn-cta">
        <span>Call {getSite().phone.display}</span>
      </PhoneLink>
      <TrackedLink href={book} cta="book_service" location={location} className="btn btn-ghost">
        Book online <ArrowRight aria-hidden />
      </TrackedLink>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  aside,
  hideCtas = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  crumbs: Crumb[];
  children?: React.ReactNode;
  aside?: React.ReactNode;
  hideCtas?: boolean;
}) {
  return (
    <section className="on-brand relative overflow-hidden">
      <div className="pointer-events-none absolute -top-[120px] -right-[120px] size-[420px] rounded-full bg-brand-2 opacity-55" aria-hidden />
      <div
        className={`container-x relative grid gap-7 pt-7 pb-10 sm:pt-11 sm:pb-14 ${aside ? "items-center lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12" : ""}`}
      >
        <div className="flex flex-col gap-4">
          <Breadcrumbs items={crumbs} light />
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="max-w-3xl text-[clamp(2rem,1.3rem+3vw,3.4rem)]">{title}</h1>
          {intro && <p className="max-w-[62ch] text-lg text-on-brand-muted">{intro}</p>}
          {children ??
            (!hideCtas && (
              <>
                <HeroCtas location="page_hero" />
                <HeroChips />
              </>
            ))}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = getContent().blocks.trust;
  if (!items.length) return null;
  return (
    <section aria-label="Why customers choose us" className="border-b border-line bg-surface">
      <ul className="container-x grid grid-cols-2 gap-2.5 py-4 sm:gap-3 lg:grid-cols-4">
        {items.map(({ icon, label }, i) => (
          <li
            key={i}
            className="flex min-h-14 items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pr-4 pl-1.5 text-[0.9rem] leading-tight font-bold shadow-soft sm:text-[0.98rem]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cta/10 text-cta">
              <Icon name={icon} className="size-5" aria-hidden />
            </span>
            {fill(label)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AppliancePicker({ location = "appliance_picker" }: { location?: string }) {
  const t = getContent().blocks.picker;
  return (
    <section className="section" id="book-by-appliance">
      <div className="container-x">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {getServices().map((s) => (
            <li key={s.slug}>
              <TrackedLink
                href={bookHref(s)}
                cta={`book_${s.icon}`}
                location={location}
                className="group flex h-full flex-col gap-3 rounded-[14px] border border-line bg-surface p-4 no-underline transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-soft"
              >
                <span className="tile-ic !size-11 transition group-hover:bg-brand group-hover:text-on-brand">
                  <ServiceIcon name={s.icon} className="!size-6" />
                </span>
                <span className="font-bold leading-tight">{s.name.replace(" Repair", "").replace("Other Appliance", "Something else")}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-cta">
                  Book <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </TrackedLink>
            </li>
          ))}
          <li>
            <PhoneLink
              location={location}
              showIcon={false}
              className="flex h-full flex-col gap-3 rounded-[14px] bg-brand p-4 text-on-brand no-underline transition hover:bg-brand-2"
            >
              <span className="grid size-11 place-items-center rounded-[10px] bg-white/10 text-peach">
                <Clock className="size-6" aria-hidden />
              </span>
              <span className="font-bold leading-tight">{t.emergency}</span>
              <span className="mt-auto text-sm font-bold text-peach">Call {getSite().phone.display}</span>
            </PhoneLink>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function ServicesGrid({ heading = true, exclude }: { heading?: boolean; exclude?: string }) {
  const list = getServices().filter((s) => s.slug !== exclude);
  const t = getContent().blocks.servicesGrid;
  return (
    <section className="section" id="services">
      <div className="container-x">
        {heading && (
          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              intro={fill(t.intro)}
            />
            <Link href="/services" className="btn btn-ghost btn-sm shrink-0 self-start md:self-auto">
              {t.button} <ArrowRight aria-hidden />
            </Link>
          </div>
        )}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group card flex flex-col gap-2.5 no-underline transition hover:border-leaf">
              <span className="flex items-center gap-3">
                <span className="tile-ic">
                  <ServiceIcon name={s.icon} />
                </span>
                <h3 className="text-[1.15rem]">{s.name}</h3>
              </span>
              <p className="flex-1 text-muted">{s.short}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-leaf group-hover:text-cta">
                {t.cardLink} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechnicianSection() {
  const site = getSite();
  const t = site.technician;
  const copy = getContent().blocks.tech;
  const facts = copy.facts.map((f) => ({ value: fill(f.value, site), label: fill(f.label, site) }));
  return (
    <section className="section" aria-labelledby="tech-h">
      <div className="container-x">
        <p id="tech-h" className="mx-auto max-w-[640px] text-center text-[1.15rem] text-muted sm:text-[1.3rem]">
          {fill(copy.headline, site)}{" "}
          {copy.headlineBold && <b className="text-ink">{fill(copy.headlineBold, site)}</b>}
        </p>

        <div className="card-raised mx-auto mt-8 grid max-w-[920px] items-center gap-7 !p-6 sm:!p-8 md:grid-cols-[auto_1fr]">
          <div className="text-center">
            <div className="relative mx-auto size-40 overflow-hidden rounded-full border-4 border-surface shadow-[0_0_0_2px_var(--line),var(--shadow)] sm:size-44">
              {t.photo ? (
                <Image src={t.photo} alt={`${t.name}, ${t.role} at ${site.name}`} fill sizes="176px" className="object-cover" />
              ) : (
                <span className="grid size-full place-items-center bg-brand font-display text-6xl font-bold text-on-brand" aria-hidden>
                  <span>
                    {t.name.charAt(0)}
                    <span className="text-dot">.</span>
                  </span>
                </span>
              )}
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{t.name}</p>
            {t.years && <p className="mt-1 text-[0.9rem] font-bold tracking-[0.12em] text-cta uppercase">{t.years} years</p>}
            <p className="text-sm text-muted">{t.role}</p>
          </div>

          <div>
            {t.bio && <blockquote className="m-0 border-l-4 border-dot pl-4 text-[1.05rem] leading-relaxed">“{t.bio}”</blockquote>}
            {t.specialties && (
              <p className="mt-4 text-[0.95rem] text-muted">
                <b className="text-ink">Works on:</b> {t.specialties.replace(/\.$/, "")}.
              </p>
            )}
            <ul className={`mt-5 grid gap-2 sm:gap-3 ${["grid-cols-1", "grid-cols-2", "grid-cols-3"][Math.max(0, facts.length - 1)]}`}>
              {facts.map((f, i) => (
                <li key={i} className="rounded-[12px] bg-surface-2 px-2 py-3 text-center sm:px-3">
                  <span className="block font-display text-[1.7rem] leading-none font-bold text-leaf sm:text-3xl">{f.value}</span>
                  <span className="mt-1.5 block text-[0.75rem] leading-snug text-muted sm:text-[0.82rem]">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          {[site.promises.licensed, site.ccbNumber && `Oregon CCB #${site.ccbNumber}`, fill(copy.note, site)].filter(Boolean).join(" · ")}
        </p>
      </div>
    </section>
  );
}

export function Process({ alt = true }: { alt?: boolean }) {
  const site = getSite();
  const t = getContent().blocks.process;
  const steps = t.steps;
  return (
    <section className={`section ${alt ? "section-alt" : ""}`}>
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          <h2 className="h-section">{t.title}</h2>
          {t.intro && <p className="lead-text mx-auto lg:mx-0">{fill(t.intro, site)}</p>}
          <div className="mt-6 hidden flex-wrap gap-3 lg:flex">
            <TrackedLink href="/book" cta="book_service" location="process" className="btn btn-cta">
              Book online <ArrowRight aria-hidden />
            </TrackedLink>
            <PhoneLink location="process" className="btn btn-ghost" />
          </div>
        </div>

        <ol className="m-0 list-none p-0">
          {steps.map(({ icon, title, pill, text }, i) => (
            <li key={i} className="relative flex gap-4 pb-7 last:pb-0 sm:gap-5">
              {i < steps.length - 1 && (
                <span className="absolute top-[72px] bottom-0 left-9 w-0.5 -translate-x-1/2 bg-cta/70" aria-hidden />
              )}
              <span className="relative grid size-[72px] shrink-0 place-items-center rounded-full border-2 border-cta bg-[color-mix(in_srgb,var(--cta)_7%,var(--surface))] text-cta shadow-soft">
                <Icon name={icon} className="size-7" aria-hidden strokeWidth={1.75} />
                <span className="absolute -top-1.5 -right-1.5 grid size-7 place-items-center rounded-full bg-cta text-sm font-bold text-on-cta ring-4 ring-bg">
                  {i + 1}
                </span>
              </span>
              <div className="min-w-0 pt-2.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h3 className="text-[1.15rem] sm:text-[1.25rem]">{fill(title, site)}</h3>
                  {pill && <span className="pill">{fill(pill, site)}</span>}
                </div>
                {text && <p className="mt-1.5 text-muted">{fill(text, site)}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PricingSection() {
  const site = getSite();
  const price = priceOf(site);
  const t = getContent().blocks.pricing;
  const included = t.included;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} intro={fill(t.intro, site)} />
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="card-raised flex flex-col !p-6 sm:!p-8">
            <p className="text-sm font-bold tracking-[0.1em] text-muted uppercase">How the service call works</p>
            <dl className="mt-5 flex flex-col">
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <dt className="font-semibold">{fill(t.rowCall, site)}</dt>
                <dd className="m-0 font-display text-2xl font-bold">{price}</dd>
              </div>
              {site.pricing.creditedOnRepair && (
                <>
                  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-line py-4">
                    <dt className="font-semibold">{fill(t.rowApprove, site)}</dt>
                    <dd className="m-0 font-display text-2xl font-bold text-ok">−{price}</dd>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-[14px] bg-brand px-5 py-4 text-on-brand">
                    <dt className="font-semibold">{fill(t.rowTotal, site)}</dt>
                    <dd className="m-0 font-display text-[2.6rem] leading-none font-bold text-peach">$0</dd>
                  </div>
                </>
              )}
            </dl>
            {t.footnote && <p className="mt-4 text-sm text-muted">{fill(t.footnote, site)}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <TrackedLink href="/book" cta="book_service" location="pricing" className="btn btn-cta">
                Book a visit <ArrowRight aria-hidden />
              </TrackedLink>
              <Link href="/pricing" className="inline-flex items-center gap-1.5 font-bold text-leaf no-underline hover:text-cta">
                See all repair prices <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="card !p-6 sm:!p-8">
            <p className="text-sm font-bold tracking-[0.1em] text-muted uppercase">Included in every visit</p>
            <ul className="mt-5 flex flex-col gap-3.5">
              {included.map(({ icon, text }, i) => (
                <li key={i} className="flex items-center gap-3.5">
                  <span className="tile-ic">
                    <Icon name={icon} aria-hidden />
                  </span>
                  <span className="font-semibold">{fill(text, site)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-line bg-surface-2 px-4 py-3">
              <ShieldCheck className="size-6 shrink-0 text-ok" aria-hidden />
              <p className="text-[0.95rem]">
                <b>{site.promises.warranty}.</b> {fill(t.warrantyNote, site)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const site = getSite();
  const t = getContent().blocks.why;
  const points = t.points;
  if (!points.length) return null;
  return (
    <section className="section section-alt">
      <div className="container-x">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} center />
        <ul className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon, title, text }, i) => (
            <li key={i} className="card flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cta/10 text-cta">
                <Icon name={icon} className="size-6" aria-hidden />
              </span>
              <div>
                <h3>{fill(title, site)}</h3>
                {text && <p className="mt-1 text-muted">{fill(text, site)}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PetsSection() {
  const site = getSite();
  const t = getContent().blocks.pets;
  const checks = t.checks;
  return (
    <section className="section">
      <div className="container-x grid items-center gap-10 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Photo src={site.photos.pets[0]} alt="A customer's dog relaxing while an appliance is repaired" className="aspect-[3/4] rounded-2xl" sizes="(min-width: 768px) 280px, 50vw" />
          <Photo src={site.photos.pets[1]} alt="Repaired appliance, with the family dog supervising" className="mt-10 aspect-[3/4] rounded-2xl" sizes="(min-width: 768px) 280px, 50vw" />
        </div>
        <div className="flex flex-col gap-4">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">{t.title}</h2>
          {t.text && <p className="text-lg text-muted">{fill(t.text, site)}</p>}
          <ul className="flex flex-col gap-2.5">
            {checks.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CircleCheck className="mt-0.5 size-[22px] shrink-0 text-ok" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Stars({ n = 5, className = "size-4" }: { n?: number; className?: string }) {
  return (
    <span className="flex gap-0.5 text-star" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < n ? "fill-current" : "opacity-30"}`} aria-hidden />
      ))}
    </span>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="m-0 flex h-full flex-col gap-3 rounded-[14px] border border-line bg-surface p-5">
      <Stars n={r.rating} />
      <blockquote className="m-0 flex-1 leading-relaxed">{r.text}</blockquote>
      <figcaption className="flex items-center gap-2.5 text-[0.88rem] text-muted">
        <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-brand font-bold text-on-brand" aria-hidden>
          {r.author.charAt(0)}
        </span>
        <span>
          <b className="text-ink">{r.author}</b>
          <br />
          {r.location}
          {r.service && ` · ${r.service}`}
        </span>
        <span className="ml-auto font-semibold whitespace-nowrap">{r.source}</span>
      </figcaption>
    </figure>
  );
}

export function ReviewsSection({ limit = 3 }: { limit?: number }) {
  const site = getSite();
  const t = getContent().blocks.reviews;
  const reviews = getReviews();
  const widget = getIntegrations().reviewsWidget;
  if (!hasReviews()) return null;
  return (
    <section className="section section-alt">
      <div className="container-x">
        <div className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
          <div className="flex flex-wrap gap-2.5">
            <Link href="/reviews" className="btn btn-ghost btn-sm">
              Read all reviews <ArrowRight aria-hidden />
            </Link>
            {site.social.googleReviews && (
              <a href={site.social.googleReviews} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                See on Google
              </a>
            )}
          </div>
        </div>
        {reviews.length > 0 && (
          <div className="grid gap-3.5 md:grid-cols-3">
            {reviews.slice(0, limit).map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        )}
        {widget.length > 0 && <EmbedWidget items={widget} className={reviews.length > 0 ? "mt-6" : ""} />}
      </div>
    </section>
  );
}

export function AreasSection() {
  const t = getContent().blocks.areas;
  return (
    <section className="section on-brand relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[420px] rounded-full bg-brand-2 opacity-55" aria-hidden />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">{t.title}</h2>
          {t.text && <p className="text-lg text-on-brand-muted">{fill(t.text)}</p>}
          <HeroCtas location="areas" />
        </div>
        <ul className="grid grid-cols-2 gap-2.5">
          {getAreas().map((a) => (
            <li key={a.slug}>
              <Link
                href={`/service-areas/${a.slug}`}
                className={`flex min-h-12 items-center gap-2.5 rounded-[14px] border px-4 py-3 font-semibold no-underline transition hover:border-peach hover:bg-white/5 ${a.primary ? "border-white/30 bg-white/5" : "border-white/12"}`}
              >
                <MapPin className={`size-5 shrink-0 ${a.primary ? "text-peach" : "text-on-brand-muted"}`} aria-hidden />
                {a.city}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BrandsStrip() {
  const brands = getBrands();
  if (brands.length === 0) return null;
  const row = [...brands, ...brands];
  return (
    <section aria-labelledby="brands-heading" className="border-y border-line bg-surface py-10">
      <div className="container-x">
        <h2 id="brands-heading" className="text-center font-sans text-[0.78rem] font-bold tracking-[0.12em] text-muted uppercase">
          {getContent().blocks.brandsTitle}
        </h2>
      </div>
      <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="flex w-max animate-marquee gap-2 hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <li
              key={i}
              aria-hidden={i >= brands.length || undefined}
              className="inline-flex min-h-11 items-center rounded-full border border-line bg-bg px-4 text-[0.95rem] font-semibold whitespace-nowrap"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqList({ faqs, schema = true }: { faqs: Faq[]; schema?: boolean }) {
  return (
    <>
      {schema && <JsonLd data={faqSchema(faqs)} />}
      <div className="flex flex-col gap-2.5">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-[10px] border border-line bg-surface [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[18px] py-4 font-semibold">
              {f.q}
              <Plus className="size-5 shrink-0 text-cta transition group-open:rotate-45" aria-hidden />
            </summary>
            <p className="px-[18px] pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

export function FaqSection({ faqs, title }: { faqs: Faq[]; title?: string }) {
  if (faqs.length === 0) return null;
  const t = getContent().blocks.faq;
  return (
    <section className="section">
      <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div>
          <SectionHeader eyebrow="FAQ" title={title ?? t.title} intro={t.intro} />
          <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 font-bold text-leaf no-underline hover:text-cta">
            See all FAQs <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}

export function CtaBand({ title, text, location = "cta_band" }: { title?: string; text?: string; location?: string }) {
  const t = getContent().blocks.cta;
  title ??= fill(t.title);
  text ??= fill(t.text);
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-cta p-6 text-white sm:p-9">
          <div className="flex max-w-[56ch] flex-col gap-2">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2.2rem)] !text-white">{title}</h2>
            {text && <p className="text-[#ffe4d8]">{text}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <PhoneLink location={location} className="btn bg-[#0d3e2e] text-white hover:bg-[#14583f]" />
            <TrackedLink href="/book" cta="book_service" location={location} className="btn btn-light">
              Book online
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
