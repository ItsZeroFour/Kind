"use client";

import { useEffect, useRef } from "react";
import type { EmbedEl } from "@/lib/embed";

// lazy = wait for load + idle (chat shouldn't slow down first paint)
export function EmbedWidget({ items, className, lazy = false }: { items: EmbedEl[]; className?: string; lazy?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(items);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled) return;
      for (const { tag, attrs } of JSON.parse(key) as EmbedEl[]) {
        const el = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        box.appendChild(el);
      }
    };
    const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(mount, { timeout: 3000 }) : setTimeout(mount, 1500));
    if (!lazy) mount();
    else if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
      box.replaceChildren();
    };
  }, [key, lazy]);

  return <div ref={ref} className={className} />;
}
