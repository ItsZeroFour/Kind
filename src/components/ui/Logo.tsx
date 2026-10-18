import Image from "next/image";
import Link from "next/link";
import type { PublicSite } from "@/content/store";

export function Logo({ logo, name, light = false, className = "" }: { logo: PublicSite["logo"]; name: string; light?: boolean; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 no-underline ${className}`} aria-label={`${name}, home`}>
      <Image
        src={logo.image}
        alt=""
        width={44}
        height={44}
        priority
        className={`size-10 sm:size-11 ${logo.custom ? "rounded-lg object-contain" : "rounded-full"}`}
      />
      {logo.word && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-[1.45rem] font-bold ${light ? "text-white" : "text-ink"}`}>
            {logo.word}
            <span className="text-dot">.</span>
          </span>
          {logo.sub && (
            <span className={`mt-1 text-[0.6rem] font-semibold tracking-[0.22em] uppercase ${light ? "text-on-brand-muted" : "text-muted"}`}>
              {logo.sub}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
