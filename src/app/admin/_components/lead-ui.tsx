import { parsePhone } from "@/content/model";
import { leadStatuses, type LeadStatus } from "@/lib/lead-store";

export const leadTimeZone = process.env.ADMIN_TIMEZONE || "America/Los_Angeles";

export const statusLabel = (s: LeadStatus) => leadStatuses.find((x) => x.value === s)?.label ?? s;

export const statusClass: Record<LeadStatus, string> = {
  new: "bg-cta text-on-cta border-cta",
  in_progress: "bg-leaf/12 text-leaf border-leaf/40",
  done: "bg-ok/12 text-ok border-ok/40",
  cancelled: "bg-surface-2 text-muted border-line",
  spam: "bg-surface-2 text-muted border-line line-through",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.75rem] font-bold whitespace-nowrap ${statusClass[status]}`}>
      {statusLabel(status)}
    </span>
  );
}

export function leadPhone(raw: string) {
  const p = parsePhone(raw);
  const digits = raw.replace(/[^\d+]/g, "");
  return { display: p?.display ?? raw, href: p?.href ?? `tel:${digits}`, sms: `sms:${p?.e164 ?? digits}` };
}

export const urgencyLabel: Record<string, string> = {
  standard: "Today or tomorrow",
  today: "Today if possible",
  emergency: "Emergency",
};

export function UrgencyBadge({ urgency }: { urgency: string | null | undefined }) {
  if (urgency !== "emergency" && urgency !== "today") return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold whitespace-nowrap ${
        urgency === "emergency" ? "bg-cta/12 text-cta" : "bg-star/20 text-ink"
      }`}
    >
      {urgencyLabel[urgency]}
    </span>
  );
}

export const fmtLeadDate = (iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }) =>
  new Date(iso).toLocaleString("en-US", { ...opts, timeZone: leadTimeZone });

export function timeAgo(iso: string, now = Date.now()) {
  const min = Math.round((now - new Date(iso).getTime()) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  return fmtLeadDate(iso, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
