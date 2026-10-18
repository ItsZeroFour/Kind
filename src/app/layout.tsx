import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getIntegrations, getSite } from "@/content/store";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", axes: ["opsz"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: "500" });

export function generateMetadata(): Metadata {
  const site = getSite();
  const { googleSiteVerification } = getIntegrations();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `Appliance Repair Hillsboro & Beaverton, OR | ${site.name}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    formatDetection: { telephone: false },
    openGraph: { siteName: site.name, locale: "en_US", type: "website" },
    verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#0d3e2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" data-scroll-behavior="smooth" className={`${figtree.variable} ${bricolage.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
