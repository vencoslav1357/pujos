# SEO – co zbývá udělat

Technické a on-page SEO je hotové v kódu (viz `src/lib/site.ts`, `src/app/layout.tsx`,
`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`). Tady je seznam věcí,
které musíš dodělat ručně mimo kód, nebo doplnit konkrétní hodnoty.

> 💡 Skoro vše je předpřipravené — většinou jen vyplníš hodnotu do `.env` nebo do
> `src/lib/site.ts`. Vzor proměnných je v `.env.example`.

---

## 1. Doména

- [ ] Koupit doménu (zvažováno `pufr.cz` nebo `josefpufr.cz`).
- [ ] Nastavit `NEXT_PUBLIC_SITE_URL` na skutečnou URL **bez lomítka na konci**:
  - lokálně v souboru `.env`
  - na Vercelu: **Project → Settings → Environment Variables**
- [ ] Po nasazení ověřit, že fungují:
  - `https://TVOJE-DOMENA/sitemap.xml`
  - `https://TVOJE-DOMENA/robots.txt`
  - `https://TVOJE-DOMENA/opengraph-image`

## 2. Skutečné kontaktní údaje (NAP)

NAP = Name, Address, Phone. Musí být **shodné** všude (web, Google, Seznam).

- [ ] Doplnit v `src/lib/site.ts` (objekt `siteConfig`): `telephone`, `email`,
      `address.streetAddress`, případně IČO.
- [ ] Doplnit zobrazené kontakty i v komponentách:
  - `src/components/Contact.tsx` (telefon, e-mail, spodní kontaktní lišta)
  - `src/components/Footer.tsx` (adresa, telefon, e-mail)
- [ ] Zkontrolovat otevírací dobu v `siteConfig.openingHours` (teď Po–So 8:00–18:00).

## 3. Google Search Console

- [ ] Přidat web na <https://search.google.com/search-console>.
- [ ] Ověřit vlastnictví metodou „HTML značka" → zkopírovat hodnotu z `content="..."`
      do `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (env).
- [ ] Po nasazení odeslat `sitemap.xml`.

## 4. Seznam Webmaster (důležité pro ČR!)

- [ ] Přidat web na <https://search.seznam.cz/wmt>.
- [ ] Ověřit přes meta tag → hodnotu `seznam-wmt` vložit do `NEXT_PUBLIC_SEZNAM_WMT` (env).
- [ ] Odeslat `sitemap.xml`.

## 5. Firma na Googlu (Google Business Profile)

Zásadní pro mapy a místní vyhledávání („úklid Tábor", „mytí oken okolí").

- [ ] Založit profil na <https://www.google.com/business/>.
- [ ] Kategorie: **Úklidová služba** (+ související).
- [ ] Vyplnit NAP **přesně stejně** jako na webu, oblast působení, otevírací dobu, fotky.

## 6. Firmy.cz (Seznam katalog)

- [ ] Založit zápis na <https://www.firmy.cz>.
- [ ] Odkaz na profil přidat do `siteConfig.sameAs` v `src/lib/site.ts`.

## 7. Profily na sociálních sítích

- [ ] Vytvořit (Facebook / Instagram).
- [ ] URL přidat do `siteConfig.sameAs` v `src/lib/site.ts` (posiluje důvěryhodnost).

## 8. Recenze

- [ ] Sbírat recenze (Google / Firmy.cz).
- [ ] Až nějaké budou, ozvi se — přidám do strukturovaných dat `aggregateRating`
      (hvězdičky ve výsledcích vyhledávání).

---

## Po nasazení – kontrola

- [ ] **Rich Results Test** (kontrola JSON-LD): <https://search.google.com/test/rich-results>
- [ ] **PageSpeed Insights** (rychlost / Core Web Vitals): <https://pagespeed.web.dev/>
- [ ] Náhled sdílení zkontrolovat např. na <https://www.opengraph.xyz/>

## Nápady na rozšíření (volitelné, posiluje SEO)

- [ ] **FAQ sekce** + FAQ strukturovaná data (silné na dotazy typu „kolik stojí mytí oken").
- [ ] **Lokální podstránky** pro města (Chýnov, Tábor, Praha) pro místní vyhledávání.
- [ ] **Blog / rady** (long-tail návštěvnost).
