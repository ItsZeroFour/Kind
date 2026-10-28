import { getAreas, getPublicSite, getServices, hasReviews } from "@/content/store";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { Analytics, GtmNoScript } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/ui/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const nav = {
    services: getServices().map(({ slug, name, icon }) => ({ slug, name, icon })),
    areas: getAreas().map(({ slug, city }) => ({ slug, city })),
    showReviews: hasReviews(),
  };
  return (
    <SiteProvider value={getPublicSite()}>
      <GtmNoScript />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header nav={nav} />
      <main id="main">{children}</main>
      <Footer />
      <MobileCallBar />
      <JsonLd data={localBusinessSchema()} />
      <Analytics />
    </SiteProvider>
  );
}
