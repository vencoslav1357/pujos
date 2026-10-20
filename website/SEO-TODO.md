# SEO – co zbývá udělat ručně

Technické a on-page SEO (titulky, kanonická URL `https://josefpufr.cz`, Open Graph, JSON-LD, FAQ, `llms.txt`, sitemap, robots a přesměrování `pujos.vercel.app`) je v kódu. Tady jsou věci, které kód sám nevyřeší.

Kanonická adresa je natvrdo `https://josefpufr.cz`, pokud nenastavíš `NEXT_PUBLIC_SITE_URL` (bez lomítka na konci). Na Vercelu tahle proměnná teď nastavená není.

---

## 1. Aby kanonická URL opravdu vracela 200

Kontrola z 20. 10. 2026:

- `https://pujos.vercel.app` vrací **200** a stejný web. V kódu je host-based **301** na `https://josefpufr.cz` (jen tento hostitel, náhledy na jiných `*.vercel.app` se nepřesměrovávají).
- `https://josefpufr.cz` teď na Vercelu dělá **308 na `https://www.josefpufr.cz`**. Primární doména v projektu je www, apex jen přesměrovává.

- [ ] V projektu Vercel → Domains: zruš přesměrování `josefpufr.cz` → `www.josefpufr.cz`.
- [ ] Nastav `www.josefpufr.cz` na **301** na `https://josefpufr.cz`.
- [ ] Ověř, že `https://josefpufr.cz/` vrací 200 a `https://www.josefpufr.cz/` i `https://pujos.vercel.app/` končí na apexu.
- [ ] Po nasazení zkontroluj `/sitemap.xml`, `/robots.txt`, `/llms.txt` a `/opengraph-image`.

Dokud apex přesměrovává na www, kanonická adresa v metadatech neodpovídá URL, která obsah opravdu vrátí.

## 2. Údaje, které web nemá — doplň je, až je budeš chtít zveřejnit

Do `src/lib/site.ts` (a do patičky / kontaktu), nic z toho v JSON-LD není, protože to stránka neuvádí:

- [ ] Ulice a číslo popisné (teď jen `391 55 Chýnov`).
- [ ] IČO.
- [ ] Jestli máš cílit i na Tábor nebo Jihočeský kraj, napiš to na stránku. Samotný kód ta místa nehádat.
- [ ] Skutečné URL profilů (Facebook, Instagram, Firmy.cz). Ikony v patičce vedou jen na obecné `facebook.com` / `instagram.com` a do `sameAs` se nedávají.
- [ ] Recenze, až nějaké budou. `aggregateRating` se nepřidává bez reálných hodnocení.

## 3. Google Search Console

- [ ] Přidej `https://josefpufr.cz` na <https://search.google.com/search-console>.
- [ ] Ověř vlastnictví metodou „HTML značka“ a hodnotu z `content` dej do `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (lokálně i na Vercelu).
- [ ] Po nasazení odešli `https://josefpufr.cz/sitemap.xml`.

## 4. Seznam Webmaster

- [ ] Přidej web na <https://search.seznam.cz/wmt>.
- [ ] Ověř meta značkou `seznam-wmt` a hodnotu dej do `NEXT_PUBLIC_SEZNAM_WMT`.
- [ ] Odešli sitemapu.

## 5. Google Business Profile

- [ ] Profil na <https://www.google.com/business/>, kategorie **Úklidová služba**.
- [ ] NAP (jméno, adresa, telefon) musí být stejné jako na webu. Nejdřív doplň ulici, ať se adresa neliší.
- [ ] Oblast působení, otevírací doba Po–Ne 8:00–18:00, fotky.

## 6. Firmy.cz a citace

- [ ] Zápis na <https://www.firmy.cz> se stejnými údaji.
- [ ] Pár místních citací (katalogy, komory) se stejnou NAP.
- [ ] Až budou skutečné URL, přidej je do JSON-LD jako `sameAs` v `src/lib/site.ts`. Pole tam teď není, protože žádný profil web neuvádí.

## 7. Recenze

- [ ] Požádej o recenze na Google a Firmy.cz.
- [ ] Až budou, doplní se do strukturovaných dat. Nevymýšlejí se.

---

## Po nasazení

- [ ] Rich Results Test: <https://search.google.com/test/rich-results>
- [ ] PageSpeed Insights: <https://pagespeed.web.dev/>
- [ ] Náhled sdílení: <https://www.opengraph.xyz/>
