"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import type { EmbedEl } from "@/lib/embed";
import { EmbedWidget } from "@/components/ui/EmbedWidget";

declare global {
  interface Window {
    leadConnector?: { chatWidget?: { isLoaded?: boolean; openWidget?: () => void; isActive?: () => boolean } };
  }
}

/** Phones: where the “Call / Book now” bar is shown (md:hidden). */
const PHONE = "(max-width: 767.98px)";
const OPENED_KEY = "kind_chat_opened";

// Goes into the widget's shadow root. On phones: no standard button and no greeting bubble (the site shows its own icon),
// and the open chat fits between the header and the bottom bar instead of covering them.
const PHONE_CSS = `@media ${PHONE} {
  .lc_text-widget--bubble, .lc_text-widget--prompt { display: none !important; }
  .lc_text-widget--mobile {
    top: var(--kind-chat-top, 80px) !important;
    bottom: var(--kind-chat-bottom, 88px) !important;
    left: 8px !important;
    right: 8px !important;
  }
}`;

function styleWidget() {
  const root = document.querySelector("chat-widget")?.shadowRoot as (ShadowRoot & { __kindStyled?: boolean }) | null | undefined;
  if (!root || root.__kindStyled) return;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(PHONE_CSS);
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  } catch {
    const el = document.createElement("style");
    el.textContent = PHONE_CSS;
    root.appendChild(el);
  }
  root.__kindStyled = true;
}

const barHeight = () => {
  const bar = document.querySelector<HTMLElement>("[data-callbar]");
  return bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().height : 0;
};

/** Where the open chat may go: below the sticky header, above the bottom bar. */
function syncInsets() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 8;
  const s = document.documentElement.style;
  s.setProperty("--kind-chat-top", `${Math.round(top)}px`);
  s.setProperty("--kind-chat-bottom", `${Math.round(barHeight() + 8)}px`);
}

/**
 * The chat from Integrations. For the ProsBuddy / LeadConnector chat on phones, the standard button would lie on “Book now”,
 * so it is replaced by a small orange icon right above the bottom bar that opens the chat through the widget's JS API.
 */
export function ChatWidget({ items }: { items: EmbedEl[] }) {
  const leadConnector = items.some((i) => i.tag === "script" && /^https:\/\/([\w-]+\.)*leadconnectorhq\.com\//.test(i.attrs.src ?? ""));
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [bottom, setBottom] = useState(0);
  const wantOpen = useRef(false);

  useEffect(() => {
    try {
      setNudge(localStorage.getItem(OPENED_KEY) !== "1");
    } catch {
      setNudge(true);
    }
  }, []);

  useEffect(() => {
    if (!leadConnector) return;
    const api = () => window.leadConnector?.chatWidget;
    const onLoaded = () => {
      styleWidget();
      if (wantOpen.current) {
        wantOpen.current = false;
        syncInsets();
        api()?.openWidget?.();
      }
    };
    const onOpened = () => {
      styleWidget();
      syncInsets();
      setOpen(true);
      setNudge(false);
      try {
        localStorage.setItem(OPENED_KEY, "1");
      } catch {}
    };
    const onClosed = () => setOpen(false);
    const onResize = () => {
      setBottom(barHeight());
      syncInsets();
    };

    window.addEventListener("LC_chatWidgetLoaded", onLoaded);
    window.addEventListener("lc-widget-opened", onOpened);
    window.addEventListener("lc-widget-closed", onClosed);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", syncInsets, { passive: true });
    onResize();
    if (api()?.isLoaded) styleWidget();
    const bar = document.querySelector("[data-callbar]");
    const ro = bar ? new ResizeObserver(onResize) : null;
    if (bar) ro?.observe(bar);
    return () => {
      window.removeEventListener("LC_chatWidgetLoaded", onLoaded);
      window.removeEventListener("lc-widget-opened", onOpened);
      window.removeEventListener("lc-widget-closed", onClosed);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", syncInsets);
      ro?.disconnect();
    };
  }, [leadConnector]);

  const openChat = () => {
    syncInsets();
    const api = window.leadConnector?.chatWidget;
    if (api?.isLoaded && api.openWidget) api.openWidget();
    // The widget loads on the first interaction; it opens as soon as it is ready.
    else wantOpen.current = true;
  };

  return (
    <>
      <EmbedWidget items={items} lazy />
      {leadConnector && !open && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Chat with us"
          style={{ bottom: bottom ? `${Math.round(bottom + 14)}px` : "calc(14px + env(safe-area-inset-bottom))" }}
          className={`fixed right-4 z-40 grid size-[50px] cursor-pointer place-items-center rounded-full bg-cta text-on-cta shadow-[0_4px_14px_rgb(0_0_0/0.25)] transition-colors hover:bg-cta-hover md:hidden ${nudge ? "animate-chat-nudge" : ""}`}
        >
          <MessageCircle className="size-6" aria-hidden strokeWidth={2.2} />
        </button>
      )}
    </>
  );
}
