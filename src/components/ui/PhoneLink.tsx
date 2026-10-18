"use client";

import { Phone } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import { track } from "@/lib/tracking";

type Props = {
  location: string;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
};

export function PhoneLink({ location, className, showIcon = true, children }: Props) {
  const { phone } = useSite();
  return (
    <a href={phone.href} className={className} data-phone="primary" onClick={() => track("click_to_call", { location, phone: phone.e164 })}>
      {showIcon && <Phone className="size-[1.1em] shrink-0" aria-hidden />}
      {children ?? <span>{phone.display}</span>}
    </a>
  );
}

export function PhoneNumber() {
  return <>{useSite().phone.display}</>;
}
