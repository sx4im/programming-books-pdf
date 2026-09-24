import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ultimate Programming Books — curated library for 32 languages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #0f1419 0%, #1a2332 55%, #243044 100%)",
          color: "#f4f6f8",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, opacity: 0.75, letterSpacing: 1 }}>
          freecodebooks.vercel.app
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            Ultimate Programming Books
          </div>
          <div style={{ display: "flex", fontSize: 32, opacity: 0.9, maxWidth: 900, lineHeight: 1.35 }}>
            634+ curated programming books across 32 languages — beginner to advanced
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.7 }}>
          Search by title · filter by skill level · open Drive links
        </div>
      </div>
    ),
    { ...size },
  );
}
