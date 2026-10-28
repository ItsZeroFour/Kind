import { getUser } from "@/lib/auth";
import { exportLeads, isLeadStatus, leadStatuses } from "@/lib/lead-store";
import { campaignTags } from "@/lib/lead-labels";

export async function GET(req: Request) {
  if (!(await getUser())) return new Response("Unauthorized", { status: 401 });
  const sp = new URL(req.url).searchParams;
  const s = sp.get("status");
  const status = isLeadStatus(s) || s === "open" ? s : "all";
  const rows = exportLeads({ status, q: sp.get("q") ?? undefined });

  const label = (v: string) => leadStatuses.find((x) => x.value === v)?.label ?? v;
  const header = ["Date (UTC)", "Status", "Name", "Phone", "Email", "Appliance", "Brand", "Problem", "ZIP", "Urgency", "Visit date", "Visit time", "Customer", "Source", "UTM source", "UTM medium", "UTM campaign", "UTM term", "UTM content", "gclid", "fbclid", "Form", "Page", "Note"];
  const lines = rows.map((r) => [
    r.createdAt.replace("T", " ").slice(0, 19),
    label(r.status),
    r.name,
    r.phone,
    r.email ?? "",
    r.appliance ?? "",
    r.lead.brand ?? "",
    r.lead.problem ?? "",
    r.zip ?? "",
    r.urgency ?? "",
    r.lead.preferredDate ?? "",
    r.lead.preferredTime ?? "",
    r.lead.customerType ?? "",
    r.channel,
    ...Object.values(campaignTags(r.lead.attribution)),
    r.formLabel,
    r.lead.pageUrl ?? "",
    r.note,
  ]);
  const cell = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const csv = "﻿" + [header, ...lines].map((l) => l.map(cell).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
