"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  ExternalLink,
  Home,
  Image as ImageIcon,
  Images,
  Info,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  MessageSquareQuote,
  CircleHelp,
  ClipboardList,
  Plug,
  Inbox,
  UserCog,
  FileText,
  Sofa,
  Store,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { logoutAction } from "../actions";

const groups = [
  {
    title: null,
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", icon: Inbox, badge: "leads" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/content/business", label: "Company & contacts", icon: Building2 },
      { href: "/admin/content/brand", label: "Logo & photos", icon: ImageIcon },
      { href: "/admin/content/home", label: "Home page", icon: Home },
      { href: "/admin/content/blocks", label: "Shared blocks", icon: LayoutGrid },
      { href: "/admin/content/about", label: "About page", icon: Info },
      { href: "/admin/content/residential", label: "For homes", icon: Sofa },
      { href: "/admin/content/commercial", label: "For businesses", icon: Store },
      { href: "/admin/content/pages", label: "Site pages", icon: FileText },
      { href: "/admin/content/form", label: "Booking form", icon: ClipboardList },
    ],
  },
  {
    title: "Services & reviews",
    items: [
      { href: "/admin/content/services", label: "Services", icon: Wrench },
      { href: "/admin/content/prices", label: "Price list", icon: Tag },
      { href: "/admin/content/areas", label: "Cities", icon: MapPin },
      { href: "/admin/content/faqs", label: "FAQ", icon: CircleHelp },
      { href: "/admin/content/reviews", label: "Reviews", icon: MessageSquareQuote },
    ],
  },
  {
    title: "Files & access",
    items: [
      { href: "/admin/media", label: "Media library", icon: Images },
      { href: "/admin/content/integrations", label: "Integrations", icon: Plug },
      { href: "/admin/account", label: "Account & users", icon: UserCog },
    ],
  },
];

type Item = { href: string; label: string; icon: typeof Inbox; badge?: "leads" };

export function AdminNav({ email, siteName, logo, newLeads }: { email: string; siteName: string; logo: string; newLeads: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  const link = (isActive: boolean) =>
    `flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-[0.93rem] font-semibold no-underline transition ${
      isActive ? "bg-white/12 text-white" : "text-on-brand-muted hover:bg-white/6 hover:text-white"
    }`;

  const body = (
    <>
      <nav aria-label="Admin sections" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        {(groups as { title: string | null; items: Item[] }[]).map((g, i) => (
          <div key={i}>
            {g.title && <p className="mb-1.5 px-3 text-[0.7rem] font-bold tracking-[0.14em] text-on-brand-muted/70 uppercase">{g.title}</p>}
            <ul className="flex flex-col gap-0.5">
              {g.items.map(({ href, label, icon: Icon, badge }) => (
                <li key={href}>
                  <Link href={href} className={link(active(href))} aria-current={active(href) ? "page" : undefined}>
                    <Icon className="size-[18px] shrink-0" aria-hidden />
                    {label}
                    {badge === "leads" && newLeads > 0 && (
                      <span className="ml-auto min-w-6 rounded-full bg-cta px-1.5 py-0.5 text-center text-[0.72rem] font-bold text-on-cta">
                        {newLeads}
                        <span className="sr-only"> new</span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener" className={link(false)}>
          <ExternalLink className="size-[18px]" aria-hidden /> Open website
        </a>
        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-white/6 py-2 pr-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate text-[0.82rem] text-on-brand-muted" title={email}>
            {email}
          </span>
          <form action={logoutAction}>
            <button type="submit" className="grid size-9 place-items-center rounded-lg text-on-brand-muted hover:bg-white/10 hover:text-white" title="Sign out">
              <LogOut className="size-4" aria-hidden />
              <span className="sr-only">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 no-underline">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" className="size-9 rounded-full bg-white object-contain" />
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-bold text-white">
          {siteName}
        </span>
        <span className="block text-[0.7rem] font-semibold tracking-[0.16em] text-peach uppercase">Admin</span>
      </span>
    </Link>
  );

  return (
    <>
      <aside className="on-brand fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col lg:flex">
        <div className="border-b border-white/10 px-5 py-4">{brand}</div>
        {body}
      </aside>

      <div className="on-brand sticky top-0 z-50 flex items-center justify-between px-4 py-3 lg:hidden">
        {brand}
        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-white/20"
          aria-expanded={open}
          aria-controls="admin-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          <span className="sr-only">Menu</span>
        </button>
      </div>
      {open && (
        <div id="admin-drawer" className="on-brand fixed inset-x-0 top-[68px] bottom-0 z-50 flex flex-col lg:hidden">
          {body}
        </div>
      )}
    </>
  );
}
