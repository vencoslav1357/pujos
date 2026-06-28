/**
 * Centrální konfigurace webu pro SEO, strukturovaná data, sitemap, robots a manifest.
 *
 * ➜ Až budeš mít doménu, nastav proměnnou prostředí NEXT_PUBLIC_SITE_URL
 *   (lokálně v .env, na Vercelu v Project Settings → Environment Variables).
 *   Pak se kanonické URL, sitemap, robots i Open Graph přepnou automaticky.
 *
 * ➜ Skutečné kontaktní údaje (telefon, e-mail, IČO, adresu) a odkazy na profily
 *   uprav níže v objektu `siteConfig` — promítnou se do strukturovaných dat
 *   (LocalBusiness) pro Google i Seznam.
 */

// Doména. Bez domény používáme placeholder — po koupi přepiš jen env proměnnou.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pufr.cz"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "J. Pufr úklidové služby",
  shortName: "J. Pufr",
  // Jméno provozovatele (živnostníka / firmy) pro strukturovaná data:
  legalName: "Josef Pufr",
  description:
    "Profesionální úklidové služby pro firmy i domácnosti. Pravidelný i jednorázový úklid kanceláří a domů, mytí oken, hloubkové tepování koberců a čalounění, úklid po stavbě. Spolehlivě, precizně a transparentně.",
  // Krátký popis pro Open Graph / sociální sítě:
  tagline: "Profesionální úklid firem a domácností",

  // ── Kontaktní údaje (placeholdery — doplň skutečné) ──────────────────
  telephone: "+420777777777",
  email: "info@jpufr.cz",

  // ── Adresa / sídlo provozovny ───────────────────────────────────────
  address: {
    streetAddress: "", // např. "Ulice 123" — doplň
    locality: "Chýnov",
    region: "Jihočeský kraj",
    postalCode: "391 55",
    country: "CZ",
  },

  // Zeměpisné souřadnice provozovny (Chýnov) — slouží i pro výpočet dopravy.
  geo: { latitude: 49.4061, longitude: 14.8106 },

  // Provozní doba (z webu: Po–So 8:00–18:00)
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],

  // Oblasti, kde službu nabízíš (pro local SEO).
  areaServed: ["Chýnov", "Tábor", "Jihočeský kraj", "Praha", "Česká republika"],

  // Cenová hladina pro Google (1–4× znak měny).
  priceRange: "$$",

  // Odkazy na profily (doplň, až vzniknou — posiluje to důvěryhodnost):
  // např. "https://www.facebook.com/...", "https://www.firmy.cz/detail/...",
  // profil Firmy na Googlu apod.
  sameAs: [] as string[],

  // Nabízené služby (pro hasOfferCatalog ve strukturovaných datech).
  services: [
    "Pravidelný a generální úklid kanceláří a firemních prostor",
    "Úklid domácností a rodinných domů",
    "Mytí oken a prosklených ploch",
    "Hloubkové čištění a tepování koberců",
    "Čištění čalounění, sedaček a matrací",
    "Úklid po stavbě, rekonstrukci a malování",
  ],
} as const;

/**
 * Strukturovaná data (JSON-LD) ve formátu schema.org.
 * Vrací @graph s uzly LocalBusiness a WebSite, které spolu provazujeme přes @id.
 */
export function getStructuredData() {
  const businessId = `${siteUrl}/#business`;
  const websiteId = `${siteUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": businessId,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        description: siteConfig.description,
        url: siteUrl,
        image: `${siteUrl}/opengraph-image`,
        logo: `${siteUrl}/opengraph-image`,
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        priceRange: siteConfig.priceRange,
        currenciesAccepted: "CZK",
        address: {
          "@type": "PostalAddress",
          ...(siteConfig.address.streetAddress
            ? { streetAddress: siteConfig.address.streetAddress }
            : {}),
          addressLocality: siteConfig.address.locality,
          addressRegion: siteConfig.address.region,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        areaServed: siteConfig.areaServed.map((name) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        openingHoursSpecification: siteConfig.openingHours.map((spec) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: spec.days,
          opens: spec.opens,
          closes: spec.closes,
        })),
        ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Úklidové služby",
          itemListElement: siteConfig.services.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteConfig.name,
        inLanguage: "cs-CZ",
        publisher: { "@id": businessId },
      },
    ],
  };
}
