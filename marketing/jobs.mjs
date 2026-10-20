// Seznam všeho, co render.mjs vyrobí. Výstup = cesta v out/.
// Přípona rozhoduje o formátu: .svg (vektor, první <svg class="logo">),
// .png, .pdf. Favicon .ico skládá render.mjs z PNG 16/32/48.
const jobs = [];
const add = (page, out, w, h, params = {}, extra = {}) => jobs.push({ page, out, w, h, params, ...extra });
const T = { transparent: true };

// ---------- logo: vektory ----------
// color = na světlé pozadí, light = na tmavé, navy/white = jednobarevné.
const VARIANTS = ["color", "light", "navy", "white"];
for (const v of VARIANTS) {
  add("logo", `logo/svg/pufr-logo-${v}.svg`, 1600, 1600, { mode: "stacked", variant: v });
  add("logo", `logo/svg/pufr-logo-horizontal-${v}.svg`, 2400, 900, { mode: "lockup", variant: v });
  add("logo", `logo/svg/pufr-wordmark-${v}.svg`, 2400, 900, { mode: "wordmark", variant: v });
  add("logo", `logo/svg/pufr-wordmark-short-${v}.svg`, 2400, 900, { mode: "word", variant: v });
  add("logo", `logo/svg/pufr-mark-${v}.svg`, 1024, 1024, { mode: "mark", variant: v });
}
add("logo", "logo/svg/pufr-icon.svg", 1024, 1024, { mode: "badge" });
add("logo", "logo/svg/pufr-icon-circle.svg", 1024, 1024, { mode: "badge", shape: "circle" });

// ---------- logo: PNG bez pozadí (velké, pro dokumenty a sdílení) ----------
for (const v of VARIANTS) {
  add("logo", `logo/png/pufr-logo-${v}.png`, 1600, 1600, { mode: "stacked", variant: v, pad: 0.08 }, T);
  add("logo", `logo/png/pufr-logo-horizontal-${v}.png`, 2400, 900, { mode: "lockup", variant: v, pad: 0.08 }, T);
  add("logo", `logo/png/pufr-wordmark-${v}.png`, 2400, 700, { mode: "wordmark", variant: v, pad: 0.08 }, T);
  add("logo", `logo/png/pufr-mark-${v}.png`, 1024, 1024, { mode: "mark", variant: v, pad: 0.06 }, T);
}
add("logo", "logo/png/pufr-icon-1024.png", 1024, 1024, { mode: "badge" }, T);
add("logo", "logo/png/pufr-icon-circle-1024.png", 1024, 1024, { mode: "badge", shape: "circle" }, T);

// ---------- logo: s pozadím (náhledy, kam nejde průhlednost) ----------
add("logo", "logo/on-background/pufr-logo-on-white.png", 1600, 1600, { mode: "stacked", variant: "color", bg: "white", pad: 0.16 });
add("logo", "logo/on-background/pufr-logo-on-navy.png", 1600, 1600, { mode: "stacked", variant: "light", bg: "navy", pad: 0.16 });
add("logo", "logo/on-background/pufr-logo-horizontal-on-white.png", 2400, 900, { mode: "lockup", variant: "color", bg: "white", pad: 0.14 });
add("logo", "logo/on-background/pufr-logo-horizontal-on-navy.png", 2400, 900, { mode: "lockup", variant: "light", bg: "navy", pad: 0.14 });

// ---------- web: soubory podle konvencí Next.js ----------
// web/app/    → zkopírovat do website/src/app/ (Next je sám přidá do <head>)
// web/public/ → zkopírovat do website/public/
add("logo", "web/app/icon.svg", 512, 512, { mode: "badge" });
add("logo", "web/app/apple-icon.png", 180, 180, { mode: "badge", shape: "full", fill: 0.6 });
for (const px of [16, 32, 48]) add("logo", `web/favicon/favicon-${px}.png`, px, px, { mode: "badge", fill: px <= 16 ? 0.74 : 0.7 }, T);
add("logo", "web/public/icon-192.png", 192, 192, { mode: "badge" }, T);
add("logo", "web/public/icon-512.png", 512, 512, { mode: "badge" }, T);
// Maskovatelná ikona (Android PWA): plný čtverec, monogram v bezpečné zóně (80 % → 0,5).
add("logo", "web/public/icon-maskable-512.png", 512, 512, { mode: "badge", shape: "full", fill: 0.5 });
add("og", "web/public/og-image.png", 1200, 630);
// Logo do navigace a patičky (vektor — ostré na každém displeji).
add("logo", "web/public/logo.svg", 2400, 900, { mode: "wordmark", variant: "color" });
add("logo", "web/public/logo-short.svg", 2400, 900, { mode: "word", variant: "color" });
add("logo", "web/public/logo-light.svg", 2400, 900, { mode: "wordmark", variant: "light" });
add("logo", "web/public/logo-mark.svg", 1024, 1024, { mode: "mark", variant: "color" });

// ---------- přehled značky ----------
add("brand", "pufr-brand-sheet.png", 2400, 1500);
add("brand", "pufr-brand-sheet.pdf", 2400, 1500);

// favicon.ico ze tří PNG (render.mjs, po dokončení úloh).
const ico = { out: "web/app/favicon.ico", from: [16, 32, 48].map((px) => `web/favicon/favicon-${px}.png`) };

export { jobs, ico };
