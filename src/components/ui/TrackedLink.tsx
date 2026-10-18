"use client";

import Link from "next/link";
import { track } from "@/lib/tracking";

type Props = React.ComponentProps<typeof Link> & { cta: string; location: string };

export function TrackedLink({ cta, location, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track("click_cta", { cta, location });
        onClick?.(e);
      }}
    />
  );
}
