"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { deleteMediaAction } from "../../actions";
import type { MediaItem } from "@/lib/media";

type Item = MediaItem & { usedIn: string[] };

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export function MediaLibrary({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  async function upload(files: FileList | File[]) {
    const list = [...files];
    setBusy(list.length);
    setMessage(null);
    const failed: string[] = [];
    for (const file of list) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/admin/api/upload", { method: "POST", body }).catch(() => null);
      if (!res?.ok) {
        const json = await res?.json().catch(() => ({}));
        failed.push(`${file.name}: ${json?.error ?? "network error"}`);
      }
      setBusy((n) => n - 1);
    }
    if (input.current) input.current.value = "";
    setMessage(failed.length ? { kind: "error", text: failed.join("; ") } : { kind: "ok", text: `Uploaded: ${list.length}` });
    router.refresh();
  }

  return (
    <>
      <div
        className="card mb-5 flex flex-col items-center gap-3 border-dashed !p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
        }}
      >
        <Upload className="size-8 text-leaf" aria-hidden />
        <p className="font-semibold">Drag photos here or</p>
        <input
          ref={input}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif"
          className="sr-only"
          id="media-upload"
          onChange={(e) => e.target.files?.length && upload(e.target.files)}
        />
        <label htmlFor="media-upload" className="btn btn-cta btn-sm">
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
          {busy ? `Uploading… ${busy} left` : "Choose files"}
        </label>
        <p className="text-[0.8rem] text-muted">JPG, PNG or GIF, up to 15 MB</p>
        {message && (
          <p className={`text-[0.9rem] font-semibold ${message.kind === "ok" ? "text-ok" : "text-cta"}`} role="status">
            {message.text}
          </p>
        )}
      </div>

      {initial.length === 0 ? (
        <p className="py-8 text-center text-muted">No images uploaded yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {initial.map((m) => (
            <li key={m.id} className="card flex flex-col !p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" loading="lazy" className="aspect-square w-full rounded-t-[14px] bg-surface-2 object-cover" />
              <div className="flex flex-1 flex-col gap-1 p-3 text-[0.8rem]">
                <p className="truncate font-semibold" title={m.original_name}>
                  {m.original_name || "untitled"}
                </p>
                <p className="text-muted">
                  {m.width}×{m.height} · {kb(m.size)}
                </p>
                {m.usedIn.length > 0 ? (
                  <p className="text-leaf" title={m.usedIn.join("\n")}>
                    Used on: {m.usedIn.length === 1 ? m.usedIn[0].split(" → ").slice(1).join(" → ") : `${m.usedIn.length} places`}
                  </p>
                ) : (
                  <p className="text-muted">Not used</p>
                )}
                <div className="mt-auto flex gap-1 pt-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm !min-h-9 flex-1 !px-2 !text-[0.8rem]"
                    onClick={async () => {
                      await navigator.clipboard.writeText(location.origin + m.url).catch(() => {});
                      setCopied(m.id);
                      setTimeout(() => setCopied(null), 1500);
                    }}
                  >
                    {copied === m.id ? <Check aria-hidden /> : <Copy aria-hidden />} Link
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full text-muted hover:bg-cta/10 hover:text-cta"
                    title="Delete"
                    onClick={async () => {
                      if (!confirm("Delete this image?")) return;
                      const res = await deleteMediaAction(m.id);
                      if (!res.ok) setMessage({ kind: "error", text: res.error });
                      else router.refresh();
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
