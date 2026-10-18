import Link from "next/link";
import {
  ArrowRight,
  Box,
  Check,
  ClipboardCheck,
  CookingPot,
  Droplets,
  Drill,
  Fan,
  Flame,
  Gem,
  Heater,
  Info,
  Microwave,
  Refrigerator,
  Snowflake,
  Sparkles,
  WashingMachine,
  Wind,
  type LucideProps,
} from "lucide-react";
import { fill, getPrices, getServices, getSite } from "@/content/store";
import { fromPrice, usd, type PriceCategory, type PriceIcon as PriceIconName } from "@/content/prices";
import type { Service } from "@/content/services";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { SectionHeader } from "./index";

const icons: Record<PriceIconName, React.ComponentType<LucideProps>> = {
  refrigerator: Refrigerator,
  freezer: Snowflake,
  washer: WashingMachine,
  dryer: Wind,
  dishwasher: Droplets,
  range: Heater,
  oven: CookingPot,
  cooktop: Flame,
  hood: Fan,
  microwave: Microwave,
  icemaker: Box,
  install: Drill,
  cleaning: Sparkles,
  inspection: ClipboardCheck,
  premium: Gem,
};

export function PriceIcon({ name, ...props }: { name: PriceIconName } & LucideProps) {
  const Icon = icons[name] ?? Refrigerator;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function Note({ text }: { text: string }) {
  if (!text) return null;
  const addon = /add-on/i.test(text);
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[0.7rem] leading-tight font-bold tracking-[0.04em] whitespace-nowrap uppercase ${
        addon ? "bg-surface-2 text-leaf" : "bg-cta/10 text-cta"
      }`}
    >
      {text}
    </span>
  );
}

/** A card with one appliance's price list */
export function PriceCard({ category, service, headingLevel = 3 }: { category: PriceCategory; service?: Service; headingLevel?: 2 | 3 }) {
  const from = fromPrice(category);
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article id={category.slug} className="card-raised mb-5 flex break-inside-avoid scroll-mt-36 flex-col !p-0">
      <header className="flex items-center gap-3.5 border-b border-line px-5 py-4 sm:px-6">
        <span className="tile-ic !size-11">
          <PriceIcon name={category.icon} className="!size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <H className="text-[1.2rem] leading-tight">{category.title}</H>
          {category.intro && <p className="mt-0.5 text-[0.88rem] text-muted">{category.intro}</p>}
        </div>
        {from > 0 && (
          <p className="shrink-0 text-right leading-none">
            <span className="block text-[0.7rem] font-bold tracking-[0.08em] text-muted uppercase">from</span>
            <span className="font-display text-[1.35rem] font-bold text-cta">{usd(from)}</span>
          </p>
        )}
      </header>
      <ul className="flex-1 px-5 sm:px-6">
        {category.items.map((it, i) => (
          <li key={i} className="flex items-start justify-between gap-4 border-b border-dashed border-line py-3 last:border-0">
            <div className="min-w-0">
              <p className="leading-snug font-semibold">{it.name}</p>
              {(it.detail || it.note) && (
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.85rem] leading-snug text-muted">
                  {it.detail && <span>{lines(it.detail).join(" · ")}</span>}
                  <Note text={it.note} />
                </p>
              )}
            </div>
            <p className="shrink-0 pt-px text-right font-display text-[1.1rem] font-bold whitespace-nowrap tabular-nums">
              {it.price > 0 ? usd(it.price) : <span className="font-sans text-[0.85rem] font-semibold text-muted">Quote on site</span>}
            </p>
          </li>
        ))}
      </ul>
      {service && (
        <Link
          href={`/services/${service.slug}`}
          className="group flex items-center gap-1.5 border-t border-line px-5 py-3.5 text-[0.92rem] font-bold text-leaf no-underline hover:text-cta sm:px-6"
        >
          About {service.name.toLowerCase()} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </article>
  );
}

function PackageCard({ category }: { category: PriceCategory }) {
  const it = category.items[0];
  if (!it) return null;
  const featured = Boolean(it.note);
  return (
    <article
      id={category.slug}
      className={`relative flex scroll-mt-36 flex-col rounded-[18px] border p-6 sm:p-7 ${
        featured ? "on-brand border-brand shadow-soft lg:-my-3 lg:py-10" : "border-line bg-surface"
      }`}
    >
      {featured && <span className="pill absolute -top-3 left-6">{it.note}</span>}
      <span className={`grid size-12 place-items-center rounded-xl ${featured ? "bg-white/10 text-peach" : "bg-surface-2 text-leaf"}`}>
        <PriceIcon name={category.icon} className="size-6" />
      </span>
      <h3 className="mt-4 text-[1.3rem]">{category.title}</h3>
      {category.intro && <p className={`mt-1 text-[0.95rem] ${featured ? "text-on-brand-muted" : "text-muted"}`}>{category.intro}</p>}
      <p className={`mt-5 font-display text-[2.6rem] leading-none font-bold ${featured ? "text-peach" : "text-ink"}`}>
        {it.price > 0 ? usd(it.price) : "Quote"}
      </p>
      {it.detail && (
        <ul className="mt-5 flex flex-col gap-2.5 text-[0.95rem]">
          {lines(it.detail).map((l, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className={`mt-0.5 size-4.5 shrink-0 ${featured ? "text-peach" : "text-ok"}`} aria-hidden />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="min-h-7 flex-1" aria-hidden />
      <TrackedLink
        href="/book"
        cta="book_service"
        location={`pricing_${category.slug}`}
        className={`btn w-full ${featured ? "btn-cta" : "btn-ghost"}`}
      >
        Book this service
      </TrackedLink>
    </article>
  );
}

function JumpNav({ items, label }: { items: { href: string; label: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="-mx-5 mt-7 overflow-x-auto px-5 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {items.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="inline-flex min-h-10 items-center rounded-full border border-line bg-surface px-4 text-[0.92rem] font-semibold whitespace-nowrap text-ink no-underline transition hover:border-leaf hover:text-leaf"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const serviceFor = (c: PriceCategory, services: Service[]) => services.find((s) => c.services.includes(s.slug));

function CardGrid({ categories, services }: { categories: PriceCategory[]; services: Service[] }) {
  return (
    <div className="mt-8 gap-5 md:columns-2">
      {categories.map((c) => (
        <PriceCard key={c.slug} category={c} service={serviceFor(c, services)} />
      ))}
    </div>
  );
}

export function DiagnosticsBlock() {
  const site = getSite();
  const t = getPrices();
  const fees = [
    { label: "Homes", title: "Residential diagnostic", price: site.pricing.serviceCall },
    { label: "Businesses", title: "Commercial diagnostic", price: site.pricing.commercialServiceCall },
  ].filter((f) => f.price > 0);
  return (
    <section id="diagnostics" className="section scroll-mt-24">
      <div className="container-x grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
        <div>
          <p className="eyebrow">Step one</p>
          <h2 className="h-section">{t.diagnosticsTitle}</h2>
          {t.diagnosticsText && <p className="lead-text">{fill(t.diagnosticsText, site)}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fees.map((f) => (
            <div key={f.title} className="card-raised flex flex-col !p-6">
              <p className="text-[0.78rem] font-bold tracking-[0.1em] text-muted uppercase">{f.label}</p>
              <h3 className="mt-1 text-[1.15rem]">{f.title}</h3>
              <p className="mt-4 font-display text-[3rem] leading-none font-bold text-cta">{usd(f.price)}</p>
              {site.pricing.creditedOnRepair && (
                <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-[0.92rem] font-semibold">
                  <Check className="mt-0.5 size-4.5 shrink-0 text-ok" aria-hidden /> Credited toward the repair when you go ahead
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PriceList() {
  const site = getSite();
  const t = getPrices();
  const services = getServices();
  const bySegment = (s: PriceCategory["segment"]) => t.categories.filter((c) => c.segment === s);
  const maintenance = bySegment("maintenance");
  const residential = bySegment("residential");
  const commercial = bySegment("commercial");
  const premium = bySegment("premium");

  return (
    <>
      {maintenance.length > 0 && (
        <section id="maintenance" className="section section-alt scroll-mt-24">
          <div className="container-x">
            <SectionHeader eyebrow="Prevent breakdowns" title={t.maintenanceTitle} intro={fill(t.maintenanceIntro, site)} />
            <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
              {maintenance.map((c) => (
                <PackageCard key={c.slug} category={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {residential.length > 0 && (
        <section id="home" className="section scroll-mt-24">
          <div className="container-x">
            <SectionHeader eyebrow="For homes" title={t.residentialTitle} intro={fill(t.residentialIntro, site)} />
            <JumpNav label="Home appliances" items={residential.map((c) => ({ href: `#${c.slug}`, label: c.title }))} />
            <CardGrid categories={residential} services={services} />
          </div>
        </section>
      )}

      {commercial.length > 0 && (
        <section id="commercial" className="section section-alt scroll-mt-24">
          <div className="container-x">
            <SectionHeader eyebrow="For businesses" title={t.commercialTitle} intro={fill(t.commercialIntro, site)} />
            <JumpNav
              label="Commercial appliances"
              items={commercial.map((c) => ({ href: `#${c.slug}`, label: c.title.replace(/^Commercial /, "") }))}
            />
            <CardGrid categories={commercial} services={services} />
            <Link
              href="/commercial-appliance-repair"
              className="mt-1 inline-flex items-center gap-1.5 font-bold text-leaf no-underline hover:text-cta"
            >
              More about commercial service <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {premium.length > 0 && (
        <section id="high-end" className="section scroll-mt-24">
          <div className="container-x">
            <div className="on-brand relative overflow-hidden rounded-3xl p-6 sm:p-10">
              <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-brand-2 opacity-60" aria-hidden />
              <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                  <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-peach">
                    <Gem className="size-6" aria-hidden />
                  </span>
                  <h2 className="mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.2rem)]">{t.premiumTitle}</h2>
                  {t.premiumIntro && <p className="mt-3 max-w-[56ch] text-on-brand-muted">{fill(t.premiumIntro, site)}</p>}
                  <TrackedLink href="/book" cta="book_service" location="pricing_high_end" className="btn btn-cta mt-6">
                    Request a quote <ArrowRight aria-hidden />
                  </TrackedLink>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {premium
                    .flatMap((c) => c.items)
                    .map((it, i) => (
                      <li key={i} className="chip !border-white/20 !bg-white/5">
                        <Check aria-hidden /> {it.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {t.notes.length > 0 && (
        <section className="!pb-0">
          <div className="container-x">
            <div className="rounded-[18px] border border-line bg-surface-2 p-6 sm:p-7">
              <h2 className="flex items-center gap-2 font-sans text-base font-bold">
                <Info className="size-5 text-leaf" aria-hidden /> Good to know
              </h2>
              <ul className="mt-3 grid gap-x-8 gap-y-2 text-[0.93rem] text-muted md:grid-cols-2">
                {t.notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-dot" aria-hidden />
                    {fill(n, site)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** Price cards for one service page. Renders nothing when no category lists the service. */
export function ServicePrices({ service }: { service: Service }) {
  const t = getPrices();
  const site = getSite();
  const cats = t.categories
    .filter((c) => c.services.includes(service.slug) && c.segment !== "premium")
    .sort((a, b) => Number(a.segment === "maintenance") - Number(b.segment === "maintenance"));
  if (!cats.length) return null;
  const vars = { service: service.name, appliance: service.appliance };
  return (
    <section className="section section-alt">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Pricing" title={fill(t.serviceBlockTitle, site, vars)} intro={fill(t.serviceBlockIntro, site, vars)} />
          <Link href="/pricing" className="inline-flex items-center gap-1.5 font-bold text-leaf no-underline hover:text-cta">
            Full price list <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className={`mt-8 gap-5 ${cats.length > 1 ? "md:columns-2" : "max-w-2xl"}`}>
          {cats.map((c) => (
            <PriceCard key={c.slug} category={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
