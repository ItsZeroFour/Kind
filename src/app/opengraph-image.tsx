import { ImageResponse } from "next/og";
import { getSite } from "@/content/store";

export const alt = "Appliance repair in Hillsboro & Beaverton, OR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const site = getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d3e2e",
          color: "#f7f4ec",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", fontSize: 120, fontWeight: 600, letterSpacing: -4 }}>
          {site.logo.word || site.shortName}
          <div style={{ width: 30, height: 30, borderRadius: 30, background: "#e8622a", marginBottom: 26, marginLeft: 6 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>Appliance Repair</div>
          <div style={{ fontSize: 36, color: "#b9d0c4", marginTop: 16 }}>Hillsboro · Beaverton · Oregon West Side</div>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#e8622a", fontWeight: 600 }}>{site.phone.display}</div>
      </div>
    ),
    size,
  );
}
