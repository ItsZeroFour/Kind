import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleHelp,
  Home,
  Image as ImageIcon,
  Inbox,
  Info,
  LayoutGrid,
  MapPin,
  MessageSquareQuote,
  Phone,
  FileText,
  Sofa,
  Store,
  Tag,
  Wrench,
  type LucideIcon,
  ClipboardList,
  Plug,
} from "lucide-react";
import { sections } from "@/content/model";
import { getSite, sectionMeta } from "@/content/store";
import { requireUser } from "@/lib/auth";
import { listMedia } from "@/lib/media";
import { countLeadsByStatus, listLeads } from "@/lib/lead-store";
import { StatusBadge, UrgencyBadge, leadPhone, timeAgo } from "../_components/lead-ui";

export const metadata = { title: "Overview" };

const sectionIcons: Record<string, LucideIcon> = {
  business: Building2,
  brand: ImageIcon,
  home: Home,
  blocks: LayoutGrid,
  about: Info,
  residential: Sofa,
  commercial: Store,
  pages: FileText,
  services: Wrench,
  prices: Tag,
  areas: MapPin,
  faqs: CircleHelp,
  reviews: MessageSquareQuote,
  form: ClipboardList,
  integrations: Plug,
};

const fmt = (s: string) => new Date(s.replace(" ", "T") + "Z").toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export default async function Dashboard() {
  const user = await requireUser();
  const site = getSite();
  const meta = sectionMeta();
  const media = listMedia().length;
  const leadCounts = countLeadsByStatus();
  const recent = listLeads({ status: "open", limit: 5 });

  const facts = [
    ["Phone", site.phone.display],
    ["Email", site.email],
    ["Hours", site.hoursShort],
    ["Service call", `$${site.pricing.serviceCall}${site.pricing.creditedOnRepair ? ", credited toward the repair" : ""}`],
    ["Technician", `${site.technician.name}, ${site.technician.years} years`],
  ];

  return (
    <>
      <header className="mb-7">
        <p className="eyebrow">{site.name} admin</p>
        <h1 className="mt-2 text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]">Hello{user.name && user.name !== "Admin" ? `, ${user.name}` : ""}!</h1>
        <p className="mt-2 max-w-[60ch] text-muted">
          Leads from the website arrive here, and this is where you edit texts, services, cities, reviews, contacts and photos. After you click Save,
          changes go live on the site right away, no rebuild needed.
        </p>
      </header>

      <section className="card mb-4 !p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
          <span className="tile-ic">
            <Inbox aria-hidden />
          </span>
          <div className="mr-auto">
            <h2 className="text-[1.1rem]">Leads</h2>
            <p className="text-[0.85rem] text-muted">
              {leadCounts.new > 0 ? (
                <b className="text-cta">New: {leadCounts.new}</b>
              ) : (
                "No new leads"
              )}
              {" · "}in progress: {leadCounts.in_progress}
            </p>
          </div>
          <Link href="/admin/leads" className="btn btn-ghost btn-sm">
            All leads <ArrowRight aria-hidden />
          </Link>
        </div>
        {recent.items.length === 0 ? (
          <p className="px-5 py-4 text-[0.9rem] text-muted">No open leads. New requests from the website forms will show up here.</p>
        ) : (
          <ul>
            {recent.items.map((l) => (
              <li key={l.id} className="border-b border-line last:border-0">
                <Link href={`/admin/leads/${l.id}`} className="group flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 no-underline hover:bg-surface-2">
                  <span className="font-bold group-hover:text-cta">{l.name}</span>
                  <StatusBadge status={l.status} />
                  <UrgencyBadge urgency={l.urgency} />
                  <span className="text-[0.85rem] text-muted">{l.appliance}</span>
                  <span className="ml-auto flex items-center gap-3 text-[0.85rem] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" aria-hidden /> {leadPhone(l.phone).display}
                    </span>
                    <time dateTime={l.createdAt}>{timeAgo(l.createdAt)}</time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
        <section className="card !p-0">
          <h2 className="border-b border-line px-5 py-4 text-[1.1rem]">Sections</h2>
          <ul>
            {sections.map((s) => {
              const Icon = sectionIcons[s.key] ?? LayoutGrid;
              const m = meta[s.key];
              return (
                <li key={s.key} className="border-b border-line last:border-0">
                  <Link href={`/admin/content/${s.key}`} className="group flex items-center gap-4 px-5 py-4 no-underline hover:bg-surface-2">
                    <span className="tile-ic">
                      <Icon aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{s.title}</span>
                      <span className="block truncate text-[0.85rem] text-muted">
                        {m ? `Updated ${fmt(m.updatedAt)}${m.by ? ` · ${m.by}` : ""}` : "Default texts"}
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-cta" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="flex flex-col gap-4">
          <section className="on-brand rounded-[14px] p-5">
            <h2 className="text-[1.1rem]">Live on the site</h2>
            <dl className="mt-3 flex flex-col gap-2 text-[0.92rem]">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0">
                  <dt className="text-on-brand-muted">{k}</dt>
                  <dd className="m-0 text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/admin/content/business" className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-peach no-underline hover:text-white">
              Edit <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>

          <section className="card">
            <h2 className="text-[1.1rem]">Tips</h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[0.9rem] text-muted">
              <li>
                Texts support placeholders: <code className="font-mono text-ink">{"{phone}"}</code>,{" "}
                <code className="font-mono text-ink">{"{price}"}</code>, <code className="font-mono text-ink">{"{tech}"}</code> and more. Change the
                phone or price once and every text follows.
              </li>
              <li>Every save goes into the section's History, and any version can be restored.</li>
              <li>
                Photos go to the <Link href="/admin/media">media library</Link> ({media}). They are compressed and their location data is removed.
              </li>
              <li>
                <kbd className="rounded border border-line px-1 font-mono text-[0.8rem]">Ctrl</kbd>+
                <kbd className="rounded border border-line px-1 font-mono text-[0.8rem]">S</kbd> saves the form.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
