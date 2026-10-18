"use client";

import { createContext, useContext } from "react";
import type { PublicSite } from "@/content/store";

const SiteContext = createContext<PublicSite | null>(null);

export function SiteProvider({ value, children }: { value: PublicSite; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite() must be used inside <SiteProvider>");
  return site;
}
