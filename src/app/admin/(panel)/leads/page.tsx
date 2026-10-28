import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Inbox, Phone, Search } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { countLeadsByStatus, isLeadStatus, leadStatuses, listLeads, type LeadFilter } from "@/lib/lead-store";
import { AutoRefresh } from "../../_components/AutoRefresh";
import { StatusBadge, UrgencyBadge, fmtLeadDate, leadPhone, timeAgo } from "../../_components/lead-ui";
import { PageHead } from "../../_components/PageHead";

export const metadata = { title: "Leads" };

const PER_PAGE = 30;
const tabLabels = { new: "New", in_progress: "In progress", done: "Done", cancelled: "Declined", spam: "Spam" };

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string }> };

export default async function LeadsPage({ searchParams }: Props) {
  await requireUser();
  const sp = await searchParams;
  const status: NonNullable<LeadFilter["status"]> = isLeadStatus(sp.status) || sp.status === "open" ? sp.status : "all";
  const q = (sp.q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const counts = countLeadsByStatus();
  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);
  const { items, total } = listLeads({ status, q, limit: PER_PAGE, offset: (page - 1) * PER_PAGE });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const href = (p: { status?: string; q?: string; page?: number }) => {
    const u = new URLSearchParams();
    const s = p.status ?? status;
    if (s !== "all") u.set("status", s);
    const qq = p.q ?? q;
    if (qq) u.set("q", qq);
    if (p.page && p.page > 1) u.set("page", String(p.page));
    const str = u.toString();
    return `/admin/leads${str ? `?${str}` : ""}`;
  };
  const exportHref = `/admin/api/leads${href({}).replace("/admin/leads", "")}`;

  const tabs = [
    { value: "all", label: "All", n: totalAll },
    { value: "open", label: "Open", n: counts.new + counts.in_progress },
    ...leadStatuses.map((s) => ({ value: s.value, label: tabLabels[s.value], n: counts[s.value] })),
  ];

  return (
    <>
      <AutoRefresh />
      <PageHead
        title="Leads"
        description="All requests from the website forms. New ones show up on their own: the page refreshes every minute. Times are Oregon time."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <nav aria-label="Status" className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1">
          {tabs.map((t) => {
            const on = t.value === status;
            return (
              <Link
                key={t.value}
                href={href({ status: t.value, page: 1 })}
                aria-current={on ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.85rem] font-semibold no-underline transition ${
                  on ? "border-brand bg-brand text-on-brand" : "border-line bg-surface hover:border-leaf"
                }`}
              >
                {t.label}
                <span className={`text-[0.75rem] ${on ? "text-on-brand-muted" : "text-muted"}`}>{t.n}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <form action="/admin/leads" className="flex w-full min-w-0 gap-2 sm:w-auto sm:flex-1" role="search">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input name="q" defaultValue={q} placeholder="Name, phone, ZIP, appliance, text…" className="field !pl-10" type="search" />
          </label>
          <button type="submit" className="btn btn-dark btn-sm">
            Search
          </button>
        </form>
        <a href={exportHref} className="btn btn-ghost btn-sm" download>
          <Download aria-hidden /> CSV
        </a>
      </div>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-14 text-center">
          <span className="tile-ic !size-14">
            <Inbox className="!size-7" aria-hidden />
          </span>
          <p className="font-bold">{q || status !== "all" ? "Nothing found" : "No leads yet"}</p>
          <p className="max-w-[44ch] text-[0.9rem] text-muted">
            {q || status !== "all"
              ? "Try another search or the All tab."
              : "When a customer sends a form on the website, the lead appears here. Email and webhook notifications keep working too."}
          </p>
          {(q || status !== "all") && (
            <Link href="/admin/leads" className="btn btn-ghost btn-sm mt-1">
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <ul className="card !p-0">
          {items.map((l) => (
            <li key={l.id} className={`relative border-b border-line last:border-0 ${l.status === "new" ? "bg-cta/[0.04]" : ""}`}>
              {l.status === "new" && <span className="absolute inset-y-0 left-0 w-1 bg-cta" aria-hidden />}
              <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                <Link href={`/admin/leads/${l.id}`} className="group min-w-0 flex-1 no-underline">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold group-hover:text-cta">{l.name}</span>
                    <StatusBadge status={l.status} />
                    <UrgencyBadge urgency={l.urgency} />
                  </span>
                  <span className="mt-0.5 block text-[0.88rem] text-muted">
                    {[l.appliance, l.zip && `ZIP ${l.zip}`].filter(Boolean).join(" · ") || "No appliance given"}
                  </span>
                  {l.problem && <span className="mt-1 line-clamp-1 block text-[0.88rem]">{l.problem}</span>}
                  <span className="mt-1 block text-[0.8rem] text-muted">
                    {l.channel} · {l.formLabel}
                  </span>
                  {l.note && <span className="mt-1 line-clamp-1 block text-[0.82rem] text-leaf">Note: {l.note}</span>}
                </Link>
                <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                  <time dateTime={l.createdAt} title={fmtLeadDate(l.createdAt)} className="text-[0.8rem] whitespace-nowrap text-muted">
                    {timeAgo(l.createdAt)}
                  </time>
                  <a href={leadPhone(l.phone).href} className="inline-flex items-center gap-1 text-[0.88rem] font-semibold whitespace-nowrap no-underline hover:text-cta">
                    <Phone className="size-3.5" aria-hidden /> {leadPhone(l.phone).display}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-5 flex items-center justify-center gap-3 text-[0.9rem]">
          {page > 1 ? (
            <Link href={href({ page: page - 1 })} className="btn btn-ghost btn-sm">
              <ChevronLeft aria-hidden /> Previous
            </Link>
          ) : (
            <span className="btn btn-ghost btn-sm opacity-40" aria-disabled>
              <ChevronLeft aria-hidden /> Previous
            </span>
          )}
          <span className="text-muted">
            {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={href({ page: page + 1 })} className="btn btn-ghost btn-sm">
              Next <ChevronRight aria-hidden />
            </Link>
          ) : (
            <span className="btn btn-ghost btn-sm opacity-40" aria-disabled>
              Next <ChevronRight aria-hidden />
            </span>
          )}
        </nav>
      )}
    </>
  );
}
