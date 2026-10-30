import Script from "next/script";
import { getIntegrations } from "@/content/store";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { AttributionCapture } from "./AttributionCapture";

export function Analytics() {
  const i = getIntegrations();
  const useGtm = Boolean(i.gtmId);
  const gtagIds = useGtm ? [] : [i.ga4Id, i.googleAdsId].filter(Boolean);
  const config = { gtm: useGtm, adsSendTo: i.googleAdsId && i.googleAdsLeadLabel ? `${i.googleAdsId}/${i.googleAdsLeadLabel}` : "" };

  return (
    <>
      <script
        id="kind-tracking"
        dangerouslySetInnerHTML={{ __html: `window.__kindTracking=${JSON.stringify(config).replace(/</g, "\\u003c")};` }}
      />
      <AttributionCapture />

      {useGtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${i.gtmId}');`}
        </Script>
      )}

      {gtagIds.length > 0 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${gtagIds
              .map((id) => `gtag('config','${id}');`)
              .join("")}`}
          </Script>
        </>
      )}

      {!useGtm && i.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${i.metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {i.callTrackingScript && <Script src={i.callTrackingScript} strategy="afterInteractive" />}

      {i.chatWidget.length > 0 && <ChatWidget items={i.chatWidget} />}
    </>
  );
}

export function GtmNoScript() {
  const i = getIntegrations();
  if (!i.gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${i.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
