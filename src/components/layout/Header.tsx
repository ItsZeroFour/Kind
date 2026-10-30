"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { ServiceIcon as ServiceIconName } from "@/content/services";
import { useSite } from "@/components/providers/SiteProvider";
import { Logo } from "@/components/ui/Logo";
import { PhoneLink, PhoneNumber } from "@/components/ui/PhoneLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

type Group = { label: string; href: string; links: { href: string; label: string; strong?: boolean }[]; wide?: boolean };

export type NavData = {
  services: { slug: string; name: string; icon: ServiceIconName }[];
  areas: { slug: string; city: string }[];
  /** The Reviews item is hidden until there are reviews */
  showReviews: boolean;
};

const buildGroups = ({ services, areas }: NavData): Group[] => [
  {
    label: "Services",
    href: "/services",
    wide: true,
    links: [
      ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
      { href: "/residential-appliance-repair", label: "Residential repair" },
      { href: "/services", label: "All services →", strong: true },
    ],
  },
  {
    label: "Areas",
    href: "/service-areas",
    wide: true,
    links: [
      ...areas.map((a) => ({ href: `/service-areas/${a.slug}`, label: a.city })),
      { href: "/service-areas", label: "All areas →", strong: true },
    ],
  },
];

const plainLinks = [
  { href: "/commercial-appliance-repair", label: "Commercial" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

const navItem =
  "inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-[0.95rem] font-semibold text-ink no-underline transition hover:bg-surface-2";

export function Header({ nav }: { nav: NavData }) {
  const site = useSite();
  const { services, areas } = nav;
  const groups = buildGroups(nav);
  const links = plainLinks.filter((l) => nav.showReviews || l.href !== "/reviews");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div className="bg-brand text-[0.85rem] text-on-brand-muted">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-5 gap-y-1 py-2">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#4ade80] shadow-[0_0_0_3px_rgb(74_222_128/0.25)]" aria-hidden />
            <strong className="text-on-brand">{site.hoursShort}</strong>
            {site.hoursNote && <span className="hidden sm:inline">· {site.hoursNote}</span>}
          </span>
          <span className="hidden lg:inline">{site.areasLine}</span>
          <PhoneLink location="utility_bar" className="inline-flex items-center gap-1.5 font-bold text-on-brand no-underline hover:text-white" />
        </div>
      </div>

      <header data-site-header className="sticky top-0 z-50 border-b border-line bg-surface">
        <div className="container-x flex min-h-[68px] items-center gap-4">
          <Logo logo={site.logo} name={site.name} className="mr-auto" />

          <nav aria-label="Main" className="hidden items-center gap-0.5 min-[1100px]:flex">
            {groups.map((g) => (
              <div key={g.label} className="group relative">
                <Link href={g.href} className={`${navItem} ${isActive(g.href) ? "text-leaf" : ""}`} aria-haspopup="true">
                  {g.label}
                  <ChevronDown className="size-4 transition group-hover:rotate-180" aria-hidden />
                </Link>
                <div className="invisible absolute top-full left-0 z-60 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className={`grid gap-0.5 rounded-[14px] border border-line bg-surface p-2 shadow-soft ${g.wide ? "w-[560px] grid-cols-3" : "w-60"}`}>
                    {g.links.map((l) => (
                      <Link
                        key={l.href + l.label}
                        href={l.href}
                        className={`rounded-lg px-2.5 py-2 text-[0.93rem] text-ink no-underline hover:bg-surface-2 ${l.strong ? "font-bold" : ""}`}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`${navItem} ${isActive(l.href) ? "text-leaf" : ""}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <PhoneLink
              location="header"
              showIcon={false}
              className="hidden font-bold whitespace-nowrap text-ink no-underline hover:text-cta xl:inline"
            />
            <TrackedLink href="/book" cta="book_service" location="header" className="btn btn-cta btn-sm hidden min-[400px]:inline-flex">
              Book service
            </TrackedLink>
            <button
              type="button"
              className="grid size-12 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-ink min-[1100px]:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-line min-[1100px]:hidden"
          >
            <div className="container-x pt-3 pb-8">
              <p className="pt-2 pb-2 text-xs font-bold tracking-[0.12em] text-muted uppercase">What needs fixing?</p>
              <div className="grid grid-cols-2 gap-2">
                {services.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="tile !min-h-0 !py-2.5 text-[0.93rem]">
                    <span className="tile-ic !size-8">
                      <ServiceIcon name={s.icon} />
                    </span>
                    {s.name.replace(" Repair", "").replace("Other Appliance", "Other")}
                  </Link>
                ))}
              </div>

              <details className="group mt-3 border-b border-line [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none justify-between py-3.5 font-bold after:text-cta after:content-['+'] group-open:after:content-['–']">
                  Service areas
                </summary>
                <div className="grid grid-cols-2 gap-x-3 pb-3">
                  {areas.map((a) => (
                    <Link key={a.slug} href={`/service-areas/${a.slug}`} className="py-2 text-[0.95rem] no-underline">
                      {a.city}
                    </Link>
                  ))}
                </div>
              </details>
              {[
                { href: "/residential-appliance-repair", label: "Residential repair" },
                ...links,
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block border-b border-line py-3.5 font-bold no-underline">
                  {l.label}
                </Link>
              ))}

              <div className="mt-6 grid gap-2.5">
                <TrackedLink href="/book" cta="book_service" location="mobile_menu" className="btn btn-cta w-full">
                  Book service
                </TrackedLink>
                <PhoneLink location="mobile_menu" showIcon={false} className="btn btn-ghost w-full">
                  <Phone aria-hidden /> <span>Call <PhoneNumber /></span>
                </PhoneLink>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
