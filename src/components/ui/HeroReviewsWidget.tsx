"use client";

import { useRouter } from "next/navigation";
import type { EmbedEl } from "@/lib/embed";
import { EmbedWidget } from "@/components/ui/EmbedWidget";

// #reviews link -> /reviews on pages that don't have the reviews block
export function HeroReviewsWidget({ items }: { items: EmbedEl[] }) {
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as Element).closest("a");
    const href = a?.getAttribute("href") ?? "";
    if (!/^#reviews$/i.test(href.replace(/^.*?(?=#)/, "")) || document.getElementById("reviews")) return;
    e.preventDefault();
    router.push("/reviews");
  };

  return (
    <div className="hero-reviews @container/hero-reviews w-full max-w-[600px] overflow-x-clip text-ink" onClick={onClick}>
      <EmbedWidget items={items} />
    </div>
  );
}
