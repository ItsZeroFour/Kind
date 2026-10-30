/**
 * Third-party widget embed codes pasted in the admin (reviews, chat).
 * Nothing is injected as raw HTML: only <script src="https://…"> and <div> tags are kept, rebuilt from an
 * attribute allowlist, so a stray inline script or event handler in the pasted code never reaches the page.
 */
export type EmbedEl = { tag: "script" | "div"; attrs: Record<string, string> };

const TAG = /<(script|div)\b([^>]*)>/gi;
const ATTR = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

const allowed: Record<EmbedEl["tag"], (name: string) => boolean> = {
  script: (n) => ["src", "async", "defer", "id", "charset", "crossorigin", "referrerpolicy"].includes(n) || n.startsWith("data-"),
  div: (n) => ["id", "class"].includes(n) || n.startsWith("data-"),
};

export function parseEmbed(code: string): EmbedEl[] {
  const out: EmbedEl[] = [];
  for (const [, rawTag, rawAttrs] of code.matchAll(TAG)) {
    const tag = rawTag.toLowerCase() as EmbedEl["tag"];
    const attrs: Record<string, string> = {};
    for (const [, rawName, dq, sq, bare] of rawAttrs.matchAll(ATTR)) {
      const name = rawName.toLowerCase();
      if (allowed[tag](name)) attrs[name] = (dq ?? sq ?? bare ?? "").slice(0, 500);
    }
    if (tag === "script") {
      if (!/^https:\/\/[\w.-]+\//i.test(attrs.src ?? "")) continue;
      attrs.src = attrs.src.replace(/&amp;/g, "&");
    }
    out.push({ tag, attrs });
    if (out.length >= 10) break;
  }
  return out;
}
