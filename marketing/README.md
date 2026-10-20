# marketing/ — logo a podklady pro web J. Pufr

Logo a všechny obrázky vznikají ze šablon v HTML, které se vyfotí headless
Chromiem. Písmo se do SVG převádí na křivky (opentype.js), takže loga vypadají
všude stejně i bez nainstalovaného písma. Změna = úprava `kit/kit.js` a nový
render, nic se nekreslí ručně.

```
npm install                 # jednou — puppeteer-core + opentype.js; prohlížeč bere z počítače
npm run render              # všechno do out/ (~15 s)
npm run render -- web/      # jen úlohy, jejichž výstup obsahuje „web/“
npm run serve               # šablony v prohlížeči: http://localhost:4173/pages/lab.html
```

Prohlížeč: `CHROME_PATH`, jinak první nalezený z Chrome / Brave / Chromium.

## Logo

**Monogram JP s jiskrou.** J a P z Cormorant Garamond Bold (stejné písmo
jako nadpisy webu), mezi dříky čistá mezera, ocas J podbíhá pod P. Čtyřcípá
jiskra vpravo nahoře je „lesk po úklidu“ a nahrazuje modrou tečku z
dosavadního textového loga v navigaci.

| Podoba | Kdy |
|---|---|
| `pufr-logo` (monogram nad nápisem) | hlavní logo — titulky, dokumenty, profily |
| `pufr-logo-horizontal` (monogram │ nápis) | hlavičky, faktury, e-mailový podpis |
| `pufr-wordmark` („J. PUFR ✦“ + ÚKLIDOVÉ SLUŽBY) | navigace a patička webu |
| `pufr-wordmark-short` (jen „J. PUFR ✦“) | malé velikosti, kde by podtitul byl nečitelný (výška pod ~28 px) |
| `pufr-mark` (jen monogram) | čtvercová místa, vodoznak |
| `pufr-icon` (monogram v tmavě modrém čtverci / kruhu) | favicon, ikona na plochu, profilovka |

Varianty barev: `color` na světlé pozadí (výchozí), `light` na tmavé,
`navy` a `white` jednobarevné (razítko, gravírování, polep).

**Barvy** (shodné s `website/src/app/globals.css`): námořní `#0F172A`
(písmo loga), královská `#2563EB` a nebeská `#38A9F8` (přechod jiskry),
břidlicová `#64748B` (podtitul). **Písmo:** Cormorant Garamond Bold (logo),
Inter Medium verzálky prostrkané (podtitul) — obě OFL, licence v `kit/fonts/`.

Pod 24 px se z ikony vypouští J — zbude „P“ s jiskrou (favicon 16 px).

## Výstupy (`out/`)

| Cesta | Co |
|---|---|
| `pufr-brand-sheet.png` / `.pdf` | přehled značky na jeden list |
| `logo/svg/` | všechny podoby × varianty jako vektor |
| `logo/png/` | totéž v PNG bez pozadí (2400 px na šířku / 1600 px čtverec) |
| `logo/on-background/` | logo na bílé a tmavě modré (kam nejde průhlednost) |
| `web/app/` | `favicon.ico` (16/32/48), `icon.svg`, `apple-icon.png` — patří do `website/src/app/` |
| `web/public/` | `logo*.svg`, `icon-192/512.png`, `icon-maskable-512.png`, `og-image.png` (1200 × 630) — patří do `website/public/` |
| `web/favicon/` | jednotlivé PNG, ze kterých se skládá `favicon.ico` |

### Nasazení na web

1. `cp out/web/app/* ../website/src/app/` — Next.js podle názvů souborů sám
   doplní `<link rel="icon">` i `apple-touch-icon` (přepíše dosavadní
   `favicon.ico` od Vercelu).
2. `cp out/web/public/* ../website/public/`
3. `src/app/manifest.ts` → `icons`: `/icon-192.png` (192×192), `/icon-512.png`
   (512×512), `/icon-maskable-512.png` (512×512, `purpose: "maskable"`).
4. Navigace a patička (`Navbar.tsx`, `Footer.tsx`): místo textu „J. PUFR“
   `<img src="/logo.svg" alt="J. Pufr úklidové služby" />` (výška ~44 px),
   v úzké liště `logo-short.svg`.
5. Náhled odkazu: buď nechat generovaný `opengraph-image.tsx`, nebo ho smazat
   a dát `out/web/public/og-image.png` do `src/app/opengraph-image.png`.
   `getStructuredData()` v `src/lib/site.ts` má pak `logo` mířit na
   `/icon-512.png` místo na OG obrázek.

## Co kde je

| Cesta | Obsah |
|---|---|
| `jobs.mjs` | seznam všeho, co se renderuje: šablona, parametry, rozměr, výstup |
| `render.mjs`, `serve.mjs` | render (PNG/SVG/PDF + skládání ICO) a statický server |
| `kit/kit.js` | značka: barvy, `mark`, `wordmark`, `lockup`, `badge`, `sparkle`; geometrie monogramu v `MONO` |
| `kit/kit.css`, `kit/fonts/` | písma webu pro šablony |
| `pages/logo.html` | logo v libovolné podobě: `?mode=mark\|wordmark\|word\|lockup\|stacked\|badge&variant=…&bg=…` |
| `pages/og.html`, `pages/brand.html` | náhled odkazu, přehled značky |
| `pages/lab.html` | pracovní plocha — všechny podoby pod sebou při ladění |
