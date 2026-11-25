import { getImageProps } from "next/image";
import type { Site } from "@/content/store";

type Bg = NonNullable<Site["heroBg"]>;

// brand green with alpha, works in both themes
const green = (a: number) => `color-mix(in srgb, var(--brand) ${Math.round(Math.min(0.95, Math.max(0, a)) * 100)}%, transparent)`;

// overlay contrast: text side never below 88% on desktop,
// mobile floor 70% (white text stays ~4.9:1)
const TEXT_SIDE = 0.88;
const MOBILE_FLOOR = 0.7;

function shades({ shadeDesktop, shadeMobile }: Bg) {
  const d = shadeDesktop / 100;
  const m = Math.max(MOBILE_FLOOR, shadeMobile / 100);
  const textD = green(Math.max(TEXT_SIDE, d + 0.25));
  return {
    desktop: `linear-gradient(90deg, ${textD} 0%, ${textD} 48%, ${green(d)} 68%, ${green(Math.max(0.15, d - 0.3))} 100%)`,
    // fade to solid green under the form
    mobile: `linear-gradient(180deg, ${green(m + 0.15)} 0%, ${green(m + 0.15)} 30%, ${green(m)} 50%, ${green(m)} 80%, ${green(1)} 100%)`,
  };
}

// lg+ uses the horizontal crop, below that the vertical one
const WIDE = "(min-width: 1024px)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function photo(src: string) {
  const { props } = getImageProps({ alt: "", fill: true, loading: "eager", fetchPriority: "high", quality: 80, src, sizes: "100vw" });
  return props;
}

// rendered twice (wide / narrow), each one gets a blank pixel at the other size
// so only one photo is downloaded. no preload on purpose
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
    // down to a bit past the chips, form card covers the end
    <div className="pointer-events-none absolute -top-8 -bottom-24 left-1/2 -z-10 w-screen -translate-x-1/2 sm:-top-11 lg:hidden" aria-hidden>
      <picture>
        <source media={WIDE} srcSet={BLANK} />
        <img {...img} alt="" className="object-cover object-center" />
      </picture>
      <div className="absolute inset-0" style={{ backgroundImage: s.mobile }} />
    </div>
  );
}
