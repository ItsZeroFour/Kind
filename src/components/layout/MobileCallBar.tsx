"use client";

import { CalendarCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function MobileCallBar() {
  const pathname = usePathname();
  if (pathname === "/thank-you") return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-70 grid grid-cols-2 gap-2 border-t border-line bg-surface px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] md:hidden">
      <PhoneLink location="sticky_bar" className="btn btn-ghost !border-cta !px-2.5 !text-cta">
        <span>Call</span>
      </PhoneLink>
      <TrackedLink href="/book" cta="book_service" location="sticky_bar" className="btn btn-cta !px-2.5">
        <CalendarCheck aria-hidden /> Book now
      </TrackedLink>
    </div>
  );
}
