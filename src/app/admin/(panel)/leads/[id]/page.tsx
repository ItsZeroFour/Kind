import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getLead } from "@/lib/lead-store";
import type { Attribution } from "@/lib/tracking";
import { campaignTags, describeForm, describeTouch } from "@/lib/lead-labels";
import { StatusBadge, UrgencyBadge, fmtLeadDate, leadPhone, timeAgo, urgencyLabel } from "../../../_components/lead-ui";
import { LeadControls } from "./LeadControls";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Lead" };

export default async function LeadPage({ params }: Props) {
  await requireUser();
  const lead = getLead((await params).id);
  if (!lead) notFound();
  const l = lead.lead;
  const phone = leadPhone(lead.phone);
  const attribution = (l.attribution ?? {}) as Attribution;

  const rows: [string, string | undefined | null][] = [
    [l.kit ? "Maintenance kit" : "Appliance", l.applianceType],
    ["Brand", l.brand],
    ["Comment", l.problem],
    ["ZIP", l.zip],
    ["Urgency", l.urgency ? (urgencyLabel[l.urgency] ?? l.urgency) : undefined],
    ["Preferred date", l.preferredDate],
    ["Preferred time", l.preferredTime],
    ["Customer", l.customerType === "commercial" ? "Business" : "Home"],
    ["Email", l.email],
  ];

  const source: [string, string | null, boolean?][] = [
    ["Last visit", describeTouch(attribution.last)],
    ["First visit", attribution.first && JSON.stringify(attribution.first) !== JSON.stringify(attribution.last) ? describeTouch(attribution.first) : null],
    ["Landing page", attribution.last?.landing_page ?? null, true],
    [
      "UTM",
      Object.entries(campaignTags(attribution))
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n") || null,
      true,
    ],
    ["Form", l.formLabel ?? describeForm(l.formId, l.pageUrl)],
    ["Sent from page", l.pageUrl ?? null, true],
  ];

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-muted no-underline hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All leads
      </Link>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[clamp(1.5rem,1.2rem+1vw,2rem)]">{lead.name}</h1>
          <StatusBadge status={lead.status} />
          <UrgencyBadge urgency={lead.urgency} />
        </div>
        <p className="mt-1 text-muted">
          <time dateTime={lead.createdAt}>{fmtLeadDate(lead.createdAt)}</time> · {timeAgo(lead.createdAt)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={phone.href} className="btn btn-cta btn-sm">
            <Phone aria-hidden /> {phone.display}
          </a>
          <a href={phone.sms} className="btn btn-ghost btn-sm">
            <MessageSquare aria-hidden /> SMS
          </a>
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="btn btn-ghost btn-sm">
              <Mail aria-hidden /> Email
            </a>
          )}
        </div>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <section className="card">
            <h2 className="text-[1.1rem]">Lead</h2>
            <dl className="mt-3 flex flex-col">
              {rows
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid gap-1 border-b border-line py-2.5 last:border-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
                    <dt className="text-[0.85rem] text-muted">{k}</dt>
                    <dd className="m-0 font-semibold break-words whitespace-pre-line">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>

          <section className="card">
            <h2 className="text-[1.1rem]">Where they came from</h2>
            <dl className="mt-3 flex flex-col">
              {source
                .filter(([, v]) => v)
                .map(([k, v, mono]) => (
                  <div key={k} className="grid gap-1 border-b border-line py-2.5 last:border-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
                    <dt className="text-[0.85rem] text-muted">{k}</dt>
                    <dd className={`m-0 break-all whitespace-pre-line ${mono ? "font-mono text-[0.85rem]" : "font-semibold"}`}>{v}</dd>
                  </div>
                ))}
            </dl>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <LeadControls id={lead.id} status={lead.status} note={lead.note} />

          <section className="card text-[0.88rem]">
            <h2 className="text-[1.1rem]">Notifications</h2>
            {lead.delivery && lead.delivery.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-1.5">
                {lead.delivery.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.82rem]">{d.destination}</span>
                    <span className={`font-bold ${d.ok ? "text-ok" : "text-cta"}`}>{d.ok ? "Sent" : `Failed${d.error ? `: ${d.error}` : ""}`}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted">
                Email and webhooks are not set up, so this lead exists only here. To set up: an address in Integrations plus RESEND_API_KEY on the server, or LEAD_WEBHOOK_URL.
              </p>
            )}
            {lead.updatedAt && (
              <p className="mt-3 border-t border-line pt-3 text-muted">
                Updated {fmtLeadDate(lead.updatedAt)}
                {lead.updatedBy ? ` · ${lead.updatedBy}` : ""}
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
