import { getImageProps } from "next/image";
import type { Site } from "@/content/store";

type Bg = NonNullable<Site["heroBg"]>;

/** The page's brand green at the given opacity, so the darkening follows the light and dark themes. */
const green = (a: number) => `color-mix(in srgb, var(--brand) ${Math.round(Math.min(0.95, Math.max(0, a)) * 100)}%, transparent)`;

/**
 * Darkening over the photo. Worst case is a pure white patch of photo:
 * - computers: behind the text column it never drops below 88%, which keeps the peach eyebrow at 4.7:1;
 *   the admin setting drives the photo side (the dog);
 * - phones: the text covers the whole width, so the dog sits behind the paragraph and chips. The top
 *   (eyebrow, heading) is 15 points darker than the setting, the rest follows it but never below 70%,
 *   which keeps the white text at 4.9:1 (WCAG AA is 4.5:1).
 */
const TEXT_SIDE = 0.88;
const MOBILE_FLOOR = 0.7;

function shades({ shadeDesktop, shadeMobile }: Bg) {
  const d = shadeDesktop / 100;
  const m = Math.max(MOBILE_FLOOR, shadeMobile / 100);
  const textD = green(Math.max(TEXT_SIDE, d + 0.25));
  return {
    desktop: `linear-gradient(90deg, ${textD} 0%, ${textD} 48%, ${green(d)} 68%, ${green(Math.max(0.15, d - 0.3))} 100%)`,
    // Ends in solid green: the photo fades out behind the top of the form.
    mobile: `linear-gradient(180deg, ${green(m + 0.15)} 0%, ${green(m + 0.15)} 30%, ${green(m)} 50%, ${green(m)} 80%, ${green(1)} 100%)`,
  };
}

// Under the layout's two-column breakpoint (lg) the vertical crop is used, from it the horizontal one.
const WIDE = "(min-width: 1024px)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function photo(src: string) {
  const { props } = getImageProps({ alt: "", fill: true, loading: "eager", fetchPriority: "high", quality: 80, src, sizes: "100vw" });
  return props;
}

/**
 * Full-bleed photo behind the home page first screen, with separate crops for computers and phones.
 * Rendered twice: `wide` behind the whole section, `narrow` behind the text column only, so on phones the
 * photo fills the first screen instead of stretching down the form. Each one swaps in a blank pixel at the
 * other size, so the browser downloads only one photo (no preload: it would fetch both).
 */
export function HeroBackground({ bg, variant }: { bg: Bg; variant: "wide" | "narrow" }) {
  const s = shades(bg);
  if (variant === "wide") {
    const { srcSet, src, ...img } = photo(bg.desktop);
    return (
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <picture>
          <source media={WIDE} srcSet={srcSet ?? src} />
          <img {...img} src={BLANK} alt="" className="object-cover object-[center_40%]" />
        </picture>
        <div className="absolute inset-0" style={{ backgroundImage: s.desktop }} />
      </div>
    );
  }
  const img = photo(bg.mobile);
  return (
    // From the top of the section to a little past the chips; the form card overlaps the faded end.
    <div className="pointer-events-none absolute -top-8 -bottom-24 left-1/2 -z-10 w-screen -translate-x-1/2 sm:-top-11 lg:hidden" aria-hidden>
      <picture>
        <source media={WIDE} srcSet={BLANK} />
        <img {...img} alt="" className="object-cover object-center" />
      </picture>
      <div className="absolute inset-0" style={{ backgroundImage: s.mobile }} />
    </div>
  );
}
