"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { resendLeadToCrmAction } from "../../../actions";

export function CrmResend({ id }: { id: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const send = () =>
    start(async () => {
      const res = await resendLeadToCrmAction(id).catch(() => ({ ok: false as const, error: "Can't reach the server" }));
      setMsg(res.ok ? { ok: true, text: "Delivered to the CRM" } : { ok: false, text: res.error });
      router.refresh();
    });

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button type="button" className="btn btn-dark btn-sm" disabled={pending} onClick={send}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Send to CRM again
      </button>
      <p className="text-[0.85rem]" role="status" aria-live="polite">
        {msg && <span className={`font-semibold ${msg.ok ? "text-ok" : "text-cta"}`}>{msg.text}</span>}
      </p>
    </div>
  );
}
