import { getImageProps } from "next/image";
import type { Site } from "@/content/store";

type Bg = NonNullable<Site["heroBg"]>;

const green = (a: number) => `rgb(13 62 46 / ${Math.min(0.95, Math.max(0, a)).toFixed(2)})`;

/**
 * Darkening over the photo. The admin setting drives the photo side (the dog); behind the text it never drops
 * below 88%. Worst case, a pure white patch of photo, that still gives the peach eyebrow 4.7:1 and the muted
 * text 5.2:1 (WCAG AA is 4.5:1), so small text stays readable on a phone in bright light.
 */
const TEXT_SIDE = 0.88;

function shades({ shadeDesktop, shadeMobile }: Bg) {
  const d = shadeDesktop / 100;
  const m = shadeMobile / 100;
  const textD = green(Math.max(TEXT_SIDE, d + 0.25));
  const textM = green(Math.max(TEXT_SIDE, m + 0.15));
  return {
    desktop: `linear-gradient(90deg, ${textD} 0%, ${textD} 48%, ${green(d)} 68%, ${green(Math.max(0.15, d - 0.3))} 100%)`,
    mobile: `linear-gradient(180deg, ${textM} 0%, ${textM} 58%, ${green(m)} 100%)`,
  };
}

/** Full-bleed photo behind the home page first screen: separate crops for computers and phones. */
export function HeroBackground({ bg }: { bg: Bg }) {
  // Art direction: no preload (it would fetch both crops); the browser picks one and fetches it first.
  const common = { alt: "", fill: true, loading: "eager", fetchPriority: "high", quality: 80 } as const;
  const { props: desktop } = getImageProps({ ...common, src: bg.desktop, sizes: "100vw" });
  const {
    props: { srcSet: mobileSrcSet, ...mobile },
  } = getImageProps({ ...common, src: bg.mobile, sizes: "100vw" });
  const s = shades(bg);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop.srcSet ?? desktop.src} />
        <img {...mobile} srcSet={mobileSrcSet} alt="" className="object-cover object-center md:object-[center_40%]" />
      </picture>
      <div className="absolute inset-0 md:hidden" style={{ backgroundImage: s.mobile }} />
      <div className="absolute inset-0 hidden md:block" style={{ backgroundImage: s.desktop }} />
    </div>
  );
}
