import { ImageResponse } from "next/og";
import { siteConfig, siteUrl } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Načte podmnožinu fontu Inter z Google Fonts (jen potřebné glyfy včetně české diakritiky).
async function loadInter(weight: 400 | 700, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error("Inter font URL nenalezena");
  return (await fetch(src)).arrayBuffer();
}

export default async function OpengraphImage() {
  const eyebrow = "ÚKLIDOVÉ SLUŽBY";
  const title = siteConfig.name;
  const tagline = siteConfig.tagline;
  const domain = siteUrl.replace(/^https?:\/\//, "");
  const allText = eyebrow + title + tagline + domain;

  let fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"] =
    undefined;
  try {
    const [regular, bold] = await Promise.all([
      loadInter(400, allText),
      loadInter(700, allText),
    ]);
    fonts = [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
    ];
  } catch {
    // Když se font nepodaří načíst, použije se výchozí font ImageResponse.
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            letterSpacing: "8px",
            fontWeight: 700,
            color: "#bae0fd",
          }}
        >
          <div style={{ width: "56px", height: "4px", background: "#60a5fa" }} />
          {eyebrow}
        </div>

        {/* Title + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "40px",
              fontWeight: 400,
              color: "#e2e8f0",
              maxWidth: "900px",
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "28px",
            color: "#cbd5e1",
          }}
        >
          <div style={{ display: "flex" }}>{domain}</div>
          <div style={{ display: "flex", color: "#93c5fd" }}>
            Firmy · Domácnosti · Po stavbě
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) },
  );
}
