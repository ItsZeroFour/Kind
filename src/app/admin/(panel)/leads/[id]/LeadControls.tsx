"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save, Trash2 } from "lucide-react";
import { deleteLeadAction, updateLeadAction } from "../../../actions";

const statuses = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Declined" },
  { value: "spam", label: "Spam" },
];

export function LeadControls({ id, status: initialStatus, note: initialNote }: { id: string; status: string; note: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [savedNote, setSavedNote] = useState(initialNote);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const save = (patch: { status?: string; note?: string }, okText: string) =>
    start(async () => {
      const res = await updateLeadAction(id, patch).catch(() => ({ ok: false as const, error: "Can't reach the server" }));
      if (res.ok) {
        if (patch.status) setStatus(patch.status);
        if (patch.note !== undefined) setSavedNote(patch.note);
        setMsg({ ok: true, text: okText });
        router.refresh();
      } else setMsg({ ok: false, text: res.error });
    });

  return (
    <section className="card">
      <h2 className="text-[1.1rem]">Status</h2>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Lead status">
        {statuses.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={pending}
            aria-pressed={status === s.value}
            onClick={() => status !== s.value && save({ status: s.value }, `Status: ${s.label}`)}
            className={`min-h-10 rounded-full border px-3.5 text-[0.88rem] font-semibold transition disabled:cursor-wait ${
              status === s.value ? "border-brand bg-brand text-on-brand" : "border-line bg-surface hover:border-leaf"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label htmlFor="lead-note" className="field-label mt-5">
        Note
      </label>
      <textarea
        id="lead-note"
        className="field min-h-0 resize-y leading-relaxed"
        rows={4}
        value={note}
        placeholder="For example: call back at 3pm, part on order…"
        onChange={(e) => {
          setNote(e.target.value);
          setMsg(null);
        }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-dark btn-sm" disabled={pending || note === savedNote} onClick={() => save({ note }, "Note saved")}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Save note
        </button>
        <p className="text-[0.85rem]" role="status" aria-live="polite">
          {msg && (
            <span className={`flex items-center gap-1 font-semibold ${msg.ok ? "text-ok" : "text-cta"}`}>
              {msg.ok && <Check className="size-4" aria-hidden />}
              {msg.text}
            </span>
          )}
        </p>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <button
          type="button"
          className="btn btn-sm text-muted hover:text-cta"
          disabled={pending}
          onClick={() => confirm("Delete this lead for good? Usually the Spam or Declined status is enough.") && start(() => deleteLeadAction(id))}
        >
          <Trash2 aria-hidden /> Delete lead
        </button>
      </div>
    </section>
  );
}
