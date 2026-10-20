// J. Pufr — stavebnice značky. Každá šablona v pages/ je HTML stránka, která
// si přečte parametry z URL (?variant=navy&w=1024…), poskládá logo z těchhle
// funkcí a nastaví `window.__ready`. Render (render.mjs) pak udělá snímek
// přesně v rozměru plátna, nebo vytáhne první <svg class="logo"> jako SVG.
//
// Písmo se do SVG nevkládá jako text: glyfy se přes opentype.js převedou na
// křivky, takže SVG vypadá všude stejně i bez nainstalovaného Cormorantu.
import opentype from "../node_modules/opentype.js/dist/opentype.module.js";

export const params = new URLSearchParams(location.search);

/** Nastaví rozměr plátna. `--u` je 1 % kratší strany. */
export function setup(defaultW, defaultH) {
  const w = Number(params.get("w") ?? defaultW);
  const h = Number(params.get("h") ?? defaultH);
  const root = document.documentElement.style;
  root.setProperty("--w", `${w}px`);
  root.setProperty("--h", `${h}px`);
  root.setProperty("--u", `${Math.min(w, h) / 100}px`);
  return { w, h, u: Math.min(w, h) / 100 };
}

export async function ready() {
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 60));
  window.__ready = true;
}

export const html = (strings, ...vals) =>
  strings.reduce((acc, s, i) => acc + s + (i < vals.length ? [vals[i]].flat().join("") : ""), "");

let uid = 0;
// Prefix, aby se id přechodů nepraly s ostatními SVG na webu.
const id = (p) => `pufr-${p}${++uid}`;
const f2 = (v) => +v.toFixed(2);

// ---------------------------------------------------------------------------
// Barvy — stejné jako web (website/src/app/globals.css)
// ---------------------------------------------------------------------------

export const C = {
  navy: "#0f172a", // --color-blue-deep, text webu
  royal: "#2563eb", // --color-blue-royal, tlačítka
  sky: "#0ea5e9", // --color-blue-500
  ice: "#bae0fd", // --color-blue-200
  mist: "#f0f7ff", // --color-blue-50
  slate: "#64748b",
  paper: "#f8fafc", // --color-light-section
  white: "#ffffff",
};
/** Přechod jiskry a modrých ploch: nebeská → královská modrá. */
export const SPARK = ["#38a9f8", "#2563eb"];

// ---------------------------------------------------------------------------
// Písma
// ---------------------------------------------------------------------------

const FONT_FILES = {
  serif: "CormorantGaramond-Bold.ttf",
  serifSemi: "CormorantGaramond-SemiBold.ttf",
  sans: "Inter-Medium.ttf",
  sansSemi: "Inter-SemiBold.ttf",
};
const fonts = {};
export async function loadFonts() {
  await Promise.all(
    Object.entries(FONT_FILES).map(async ([k, file]) => {
      const buf = await (await fetch(new URL(`./fonts/${file}`, import.meta.url))).arrayBuffer();
      fonts[k] = opentype.parse(buf);
    }),
  );
  return fonts;
}

/**
 * Text jako křivky. Vrací { d, width, bbox } v jednotkách fontu × size/1000,
 * počátek na účaří vlevo. `tracking` je v em (0.2 = 20 % velikosti písma).
 */
export function textPath(text, { font = "serif", size = 100, tracking = 0, x = 0, y = 0 } = {}) {
  const ft = fonts[font];
  const scale = size / ft.unitsPerEm;
  const glyphs = ft.stringToGlyphs(text);
  let pen = x;
  let d = "";
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  glyphs.forEach((g, i) => {
    const p = g.getPath(pen, y, size);
    d += p.toPathData(2);
    const b = p.getBoundingBox();
    if (b.x2 > b.x1) {
      minX = Math.min(minX, b.x1); minY = Math.min(minY, b.y1);
      maxX = Math.max(maxX, b.x2); maxY = Math.max(maxY, b.y2);
    }
    const kern = i < glyphs.length - 1 ? ft.getKerningValue(g, glyphs[i + 1]) : 0;
    pen += (g.advanceWidth + kern) * scale + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  return { d, width: pen - x, bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
}

/** Výška verzálek fontu pro danou velikost. */
export const capHeight = (font, size) => (fonts[font].tables.os2.sCapHeight / fonts[font].unitsPerEm) * size;

// ---------------------------------------------------------------------------
// Jiskra — čtyřcípá hvězdička lesku (náhrada tečky z dosavadního loga webu)
// ---------------------------------------------------------------------------

/** Čtyřcípá jiskra se středem (cx, cy), poloměr r; `waist` určuje štíhlost cípů. */
export function sparkle(cx, cy, r, waist = 0.14) {
  const w = r * waist;
  return (
    `M${f2(cx)} ${f2(cy - r)}` +
    `Q${f2(cx + w)} ${f2(cy - w)} ${f2(cx + r)} ${f2(cy)}` +
    `Q${f2(cx + w)} ${f2(cy + w)} ${f2(cx)} ${f2(cy + r)}` +
    `Q${f2(cx - w)} ${f2(cy + w)} ${f2(cx - r)} ${f2(cy)}` +
    `Q${f2(cx - w)} ${f2(cy - w)} ${f2(cx)} ${f2(cy - r)}Z`
  );
}

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------

// Varianty barev:
//  - "color" na světlé podklady: tmavě modrá písmena #0F172A, modrá jiskra (výchozí)
//  - "light" na tmavé podklady: bílá písmena, světlejší jiskra
//  - "navy" / "white" jednobarevné (razítka, gravírování, monochromní tisk)
const INK = { color: C.navy, light: C.white, navy: C.navy, white: C.white, blue: C.royal };
const SPARK_FILL = {
  color: SPARK,
  light: ["#7cc7fb", "#3b82f6"],
  navy: [C.navy, C.navy],
  white: [C.white, C.white],
  blue: [C.royal, C.royal],
};

function gradDef(variant, y1, y2) {
  const [a, b] = SPARK_FILL[variant];
  const g = id("sp");
  if (a === b) return { def: "", fill: a };
  return {
    def: `<linearGradient id="${g}" x1="0" y1="${f2(y1)}" x2="0" y2="${f2(y2)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`,
    fill: `url(#${g})`,
  };
}

// Monogram JP v mřížce 1000 × 1000 (Logo Lab, návrh D3): J a P z Cormorant
// Garamond Bold, mezi dříky mezera, ocas J podbíhá pod P, jiskra vpravo nahoře.
export const MONO = { js: 740, jx: 170, px: 420, base: 700, sx: 860, sy: 220, sr: 100 };

function monoParts(m = MONO) {
  const J = textPath("J", { size: m.js, x: m.jx, y: m.base });
  const P = textPath("P", { size: m.js, x: m.px, y: m.base });
  const x1 = Math.min(J.bbox.x, P.bbox.x, m.sx - m.sr);
  const y1 = Math.min(J.bbox.y, P.bbox.y, m.sy - m.sr);
  const x2 = Math.max(J.bbox.x + J.bbox.w, P.bbox.x + P.bbox.w, m.sx + m.sr);
  const y2 = Math.max(J.bbox.y + J.bbox.h, P.bbox.y + P.bbox.h);
  return { J, P, box: { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }, m };
}

/** Ohraničení monogramu (po načtení písem). */
export const monoBox = () => monoParts().box;

/** Vnitřek monogramu jako SVG fragment (bez <svg>) v mřížce 1000 × 1000. */
export function monoInner(variant = "color", m = MONO) {
  const { J, P } = monoParts(m);
  const s = gradDef(variant, m.sy - m.sr, m.sy + m.sr);
  return {
    defs: s.def,
    body: `<path d="${J.d}${P.d}" fill="${INK[variant]}"/><path d="${sparkle(m.sx, m.sy, m.sr)}" fill="${s.fill}"/>`,
  };
}

/** Značka: monogram JP s jiskrou, těsně oříznutý. `size` = výška v px. */
export function mark({ size = 100, variant = "color", style = "" } = {}) {
  const { box } = monoParts();
  const inner = monoInner(variant);
  const vb = `${f2(box.x)} ${f2(box.y)} ${f2(box.w)} ${f2(box.h)}`;
  return `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${f2((size * box.w) / box.h)}" height="${size}" style="overflow:visible;${style}"><defs>${inner.defs}</defs>${inner.body}</svg>`;
}

/** Pozadí ikony: tmavě modrá plocha s jemným světlem shora. */
export const BADGE_BG = ["#1e3a8a", C.navy];

/**
 * Ikona: monogram v kontejneru. shape = "square" (zaoblený čtverec), "circle",
 * "full" (plný čtverec bez zaoblení — Apple/Android si ořežou samy).
 * `fill` = podíl, který monogram zabírá z kratší strany kontejneru.
 * Pod 24 px zbyde jen „P“ s jiskrou — J by se slilo.
 */
export function badge({ size = 512, shape = "square", fill = 0.62, variant = "light", bg = BADGE_BG, style = "", small = size < 24 } = {}) {
  const g = id("bg");
  const m = small ? { ...MONO, jx: -9999 } : MONO;
  let { J, P, box } = monoParts(m);
  if (small) {
    // Jen P + jiskra.
    const x1 = P.bbox.x, y1 = Math.min(P.bbox.y, MONO.sy - MONO.sr);
    box = { x: x1, y: y1, w: MONO.sx + MONO.sr - x1, h: P.bbox.y + P.bbox.h - y1 };
  }
  const k = (1000 * (small ? 0.74 : fill)) / Math.max(box.w, box.h);
  // Optický střed: monogram trochu výš, protože ocas J táhne oko dolů.
  const tx = 500 - (box.x + box.w / 2) * k;
  const ty = 500 - (box.y + box.h / 2) * k - (small ? 0 : 8);
  const s = gradDef(variant, m.sy - m.sr, m.sy + m.sr);
  const radius = { square: 225, circle: 500, full: 0 }[shape];
  const bgFill = Array.isArray(bg) ? `url(#${g})` : bg;
  const glyphs = small ? P.d : J.d + P.d;
  return `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="${size}" height="${size}" style="${style}"><defs>${
    Array.isArray(bg) ? `<linearGradient id="${g}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="0.75" stop-color="${bg[1]}"/></linearGradient>` : ""
  }${s.def}</defs>${bg === "none" ? "" : `<rect width="1000" height="1000" rx="${radius}" fill="${bgFill}"/>`}<g transform="translate(${f2(tx)} ${f2(ty)}) scale(${f2(k * 1000) / 1000})"><path d="${glyphs}" fill="${INK[variant]}"/><path d="${sparkle(MONO.sx, MONO.sy, MONO.sr)}" fill="${s.fill}"/></g></svg>`;
}

/**
 * Slovní logo „J. PUFR“ + jiskra, volitelně s podtitulem „ÚKLIDOVÉ SLUŽBY“
 * zarovnaným na šířku nápisu. Vrací vnitřek SVG a ohraničení (v px při `size`
 * = velikost písma).
 */
export function wordInner({ size = 200, variant = "color", sub = true, x = 0, y = 0, subColor } = {}) {
  const base = y + capHeight("serif", size);
  const W = textPath("J. PUFR", { size, tracking: 0.1, x, y: base });
  const sp = { x: x + W.width + 0.275 * size, y: base - 0.525 * size, r: 0.21 * size };
  const s = gradDef(variant, sp.y - sp.r, sp.y + sp.r);
  let body = `<path d="${W.d}" fill="${INK[variant]}"/><path d="${sparkle(sp.x, sp.y, sp.r)}" fill="${s.fill}"/>`;
  let bottom = W.bbox.y + W.bbox.h;
  const right = sp.x + sp.r;
  if (sub) {
    // Podtitul přes celou šířku písmen (bez jiskry): dopočítá se prostrkání.
    const text = "ÚKLIDOVÉ SLUŽBY";
    const ss = 0.19 * size;
    const plain = textPath(text, { font: "sans", size: ss });
    const target = W.bbox.x + W.bbox.w - W.bbox.x;
    const tracking = (target - plain.bbox.w) / (text.length - 1) / ss;
    const subBase = base + 0.5 * size;
    const S = textPath(text, { font: "sans", size: ss, tracking, x: W.bbox.x - plain.bbox.x, y: subBase });
    const sc = subColor ?? { color: C.slate, light: "#94a3b8", navy: C.navy, white: C.white, blue: C.royal }[variant];
    body += `<path d="${S.d}" fill="${sc}"/>`;
    bottom = S.bbox.y + S.bbox.h;
  }
  const top = Math.min(W.bbox.y, sp.y - sp.r);
  return { defs: s.def, body, box: { x: W.bbox.x, y: top, w: right - W.bbox.x, h: bottom - top } };
}

/** Slovní logo jako samostatné SVG. `height` = výška v px. */
export function wordmark({ height = 100, variant = "color", sub = true, style = "" } = {}) {
  const r = wordInner({ size: 200, variant, sub });
  const b = r.box;
  return `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="${f2(b.x)} ${f2(b.y)} ${f2(b.w)} ${f2(b.h)}" width="${f2((height * b.w) / b.h)}" height="${height}" style="overflow:visible;${style}"><defs>${r.defs}</defs>${r.body}</svg>`;
}

/**
 * Značka + slovní logo. mode = "horizontal" (monogram vlevo, tenká linka,
 * nápis vpravo) nebo "stacked" (monogram nad nápisem). `height` = výška v px.
 */
export function lockup({ height = 100, variant = "color", mode = "horizontal", style = "" } = {}) {
  const mono = monoInner(variant);
  const mb = monoBox();
  let parts = "", vb;
  const lineColor = { color: "#cbd5e1", light: "rgba(255,255,255,.28)", navy: C.navy, white: C.white, blue: C.royal }[variant];
  if (mode === "horizontal") {
    // Nápis s podtitulem stejně vysoký jako monogram bez ocasu J (= výška P).
    const top = MONO.sy - MONO.sr;
    const pH = MONO.base - top;
    const probe = wordInner({ size: 200, variant });
    const k = (pH * 0.98) / probe.box.h;
    const size = 200 * k;
    const gap = 0.16 * mb.h;
    const lineX = mb.x + mb.w + gap;
    const wx = lineX + gap;
    const w = wordInner({ size, variant, x: wx, y: 0 });
    // Svisle vycentrovat nápis na výšku P.
    const dy = top + (pH - w.box.h) / 2 - w.box.y;
    parts = `<defs>${mono.defs}${w.defs}</defs>${mono.body}<rect x="${f2(lineX - 2)}" y="${f2(top)}" width="4" height="${f2(mb.y + mb.h - top)}" fill="${lineColor}"/><g transform="translate(0 ${f2(dy)})">${w.body}</g>`;
    vb = { x: mb.x, y: mb.y, w: w.box.x + w.box.w - mb.x, h: mb.h };
  } else {
    const w0 = wordInner({ size: 200, variant });
    const k = (mb.w * 1.9) / w0.box.w;
    const w = wordInner({ size: 200 * k, variant, x: 0, y: 0 });
    const gap = 0.2 * mb.h;
    const cx = mb.x + mb.w / 2;
    const dx = cx - (w.box.x + w.box.w / 2);
    const dy = mb.y + mb.h + gap - w.box.y;
    parts = `<defs>${mono.defs}${w.defs}</defs>${mono.body}<g transform="translate(${f2(dx)} ${f2(dy)})">${w.body}</g>`;
    const x1 = Math.min(mb.x, w.box.x + dx);
    const x2 = Math.max(mb.x + mb.w, w.box.x + w.box.w + dx);
    vb = { x: x1, y: mb.y, w: x2 - x1, h: mb.h + gap + w.box.h };
  }
  return `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="${f2(vb.x)} ${f2(vb.y)} ${f2(vb.w)} ${f2(vb.h)}" width="${f2((height * vb.w) / vb.h)}" height="${height}" style="overflow:visible;${style}">${parts}</svg>`;
}
