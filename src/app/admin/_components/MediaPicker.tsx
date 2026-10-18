"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { listMediaAction } from "../actions";
import type { MediaItem } from "@/lib/media";

export function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<MediaItem[] | null>(null);

  useEffect(() => {
    ref.current?.showModal();
    listMediaAction().then(setItems, () => setItems([]));
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto max-h-[85dvh] w-[min(760px,calc(100vw-24px))] rounded-[18px] border border-line bg-surface p-0 text-ink shadow-soft backdrop:bg-black/50"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-5 py-3.5">
        <h2 className="text-lg">Media library</h2>
        <button type="button" className="grid size-10 place-items-center rounded-lg hover:bg-surface-2" onClick={() => ref.current?.close()}>
          <X className="size-5" aria-hidden />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="p-5">
        {!items ? (
          <Loader2 className="mx-auto my-10 size-7 animate-spin text-leaf" aria-label="Loading" />
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-muted">Nothing uploaded yet. Use the Upload button next to the field.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className="group block w-full overflow-hidden rounded-[12px] border border-line text-left transition hover:border-leaf focus-visible:border-leaf"
                  onClick={() => onPick(m.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" loading="lazy" className="aspect-square w-full bg-surface-2 object-cover" />
                  <span className="block truncate px-2 py-1.5 text-[0.75rem] text-muted">{m.original_name || "untitled"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  );
}
