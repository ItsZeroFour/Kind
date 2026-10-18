"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, History, Loader2, RotateCcw, Save, Undo2, X } from "lucide-react";
import { getPath, setPath, type FieldErrors, type SectionDef } from "@/content/model";
import { getRevisionAction, listRevisionsAction, resetSectionAction, saveSectionAction } from "../actions";
import { FieldInput } from "./fields";

type Props = { def: SectionDef; initial: Record<string, unknown>; isCustom: boolean };

const fmt = (iso: string) =>
  new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z").toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export function ContentEditor({ def, initial, isCustom }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [historyOpen, setHistoryOpen] = useState(false);

  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(saved), [value, saved]);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const save = useCallback(() => {
    start(async () => {
      const res = await saveSectionAction(def.key, value).catch(() => ({ ok: false as const, error: "Can't reach the server. Please try again." }));
      if (res.ok) {
        setSaved(value);
        setErrors({});
        setStatus({ kind: "ok", text: "Saved. The changes are live." });
        router.refresh();
      } else {
        setErrors("errors" in res && res.errors ? res.errors : {});
        setStatus({ kind: "error", text: res.error });
        requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      }
    });
  }, [def.key, value, router]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !pending) save();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [dirty, pending, save]);

  useEffect(() => {
    if (status?.kind !== "ok") return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const update = (key: string, v: unknown) => {
    setValue((cur) => setPath(cur, key, v));
    setStatus(null);
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {def.groups.map((g, i) => (
          <a key={g.title} href={`#g-${i}`} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.85rem] font-semibold no-underline hover:border-leaf">
            {g.title}
          </a>
        ))}
        <button type="button" className="btn btn-ghost btn-sm ml-auto" onClick={() => setHistoryOpen(true)}>
          <History aria-hidden /> History
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="flex flex-col gap-5 pb-28"
        noValidate
      >
        {def.groups.map((g, i) => (
          <section key={g.title} id={`g-${i}`} className="card scroll-mt-24 !p-4 sm:!p-7">
            <h2 className="text-[1.2rem]">{g.title}</h2>
            {g.description && <p className="mt-1 text-[0.9rem] text-muted">{g.description}</p>}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.key} className={["text", "number", "phone", "email", "url", "toggle"].includes(f.kind) ? "min-w-0" : "min-w-0 md:col-span-2"}>
                  <FieldInput field={f} value={getPath(value, f.key)} path={f.key} errors={errors} onChange={(v) => update(f.key, v)} />
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:left-[260px]">
          <div className="mx-auto flex max-w-[980px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
            <p className="mr-auto flex min-w-0 items-center gap-2 text-[0.9rem]" role="status" aria-live="polite">
              {status ? (
                <span className={`flex items-center gap-1.5 font-semibold ${status.kind === "ok" ? "text-ok" : "text-cta"}`}>
                  {status.kind === "ok" ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
                  {status.text}
                </span>
              ) : dirty ? (
                <span className="flex items-center gap-2 font-semibold">
                  <span className="size-2 rounded-full bg-dot" aria-hidden /> Unsaved changes
                </span>
              ) : (
                <span className="text-muted">All changes saved</span>
              )}
            </p>
            {dirty && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={pending}
                onClick={() => {
                  setValue(saved);
                  setErrors({});
                  setStatus(null);
                }}
              >
                <Undo2 aria-hidden /> Discard
              </button>
            )}
            <button type="submit" className="btn btn-cta btn-sm min-w-36" disabled={!dirty || pending}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
              Save
            </button>
          </div>
        </div>
      </form>

      {historyOpen && (
        <HistoryPanel
          sectionKey={def.key}
          isCustom={isCustom}
          onClose={() => setHistoryOpen(false)}
          onLoad={(v) => {
            setValue(v);
            setStatus({ kind: "ok", text: "Version loaded into the form. Click Save to put it back on the site." });
            setHistoryOpen(false);
          }}
          onReset={() => {
            start(async () => {
              const res = await resetSectionAction(def.key);
              if (res.ok) location.reload();
            });
          }}
        />
      )}
    </>
  );
}

function HistoryPanel({
  sectionKey,
  isCustom,
  onClose,
  onLoad,
  onReset,
}: {
  sectionKey: string;
  isCustom: boolean;
  onClose: () => void;
  onLoad: (v: Record<string, unknown>) => void;
  onReset: () => void;
}) {
  const [items, setItems] = useState<{ id: number; created_at: string; email: string | null }[] | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    listRevisionsAction(sectionKey).then(setItems, () => setFailed(true));
  }, [sectionKey]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="flex h-full w-[min(420px,100vw)] flex-col bg-surface shadow-soft"
        onClick={(e) => e.stopPropagation()}
        aria-label="Change history"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg">Change history</h2>
          <button type="button" className="grid size-10 place-items-center rounded-lg hover:bg-surface-2" onClick={onClose}>
            <X className="size-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {failed ? (
            <p className="font-semibold text-cta">Could not load the history. Refresh the page.</p>
          ) : !items ? (
            <Loader2 className="mx-auto my-8 size-6 animate-spin text-leaf" aria-label="Loading" />
          ) : items.length === 0 ? (
            <p className="text-muted">This section has not been saved yet. The site shows the default texts.</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {items.map((r, i) => (
                <li key={r.id} className="flex items-center gap-3 rounded-[12px] border border-line px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {fmt(r.created_at)}
                      {i === 0 && isCustom && <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[0.72rem] text-leaf">live</span>}
                    </p>
                    <p className="truncate text-[0.82rem] text-muted">{r.email ?? "—"}</p>
                  </div>
                  {!(i === 0 && isCustom) && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={loading !== null}
                      onClick={async () => {
                        setLoading(r.id);
                        const v = await getRevisionAction(sectionKey, r.id);
                        setLoading(null);
                        if (v && typeof v === "object") onLoad(v as Record<string, unknown>);
                      }}
                    >
                      {loading === r.id ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCcw aria-hidden />}
                      Open
                    </button>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
        {isCustom && (
          <div className="border-t border-line p-5">
            <p className="text-[0.85rem] text-muted">Go back to the section's original texts, as they were before the first save. The history is kept.</p>
            <button
              type="button"
              className="btn btn-sm mt-3 w-full border-cta text-cta hover:bg-cta/10"
              onClick={() => confirm("Reset this section to the default texts? This changes the site right away.") && onReset()}
            >
              <RotateCcw aria-hidden /> Reset to defaults
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
