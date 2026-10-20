/**
 * Centrální konfigurace webu pro SEO, strukturovaná data, sitemap, robots a llms.txt.
 *
 * Kanonická adresa je https://josefpufr.cz (bez www, bez lomítka na konci).
 * NEXT_PUBLIC_SITE_URL ji přepíše jen když je nastavená — musí to být primární
 * origin bez lomítka na konci.
 *
 * Do strukturovaných dat patří jen údaje, které web skutečně uvádí.
 * Chybí: ulice, IČO, veřejné profily, hodnocení a recenze.
 */

import {
  COMMERCIAL_BASE_PER_M2,
  CONSTRUCTION_PER_M2,
  RESIDENTIAL_BASE_PER_M2,
  TRANSPORT_CZK_PER_KM,
  UPHOLSTERY_FLAT_CZK,
  carpetBands,
  formatBandList,
  windowBands,
} from "@/lib/rates";

export const canonicalOrigin = "https://josefpufr.cz";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? canonicalOrigin
).replace(/\/+$/, "");

export const siteConfig = {
  name: "J. Pufr úklidové služby",
  shortName: "J. Pufr",
  legalName: "Josef Pufr",
  description:
    "Josef Pufr zajišťuje úklidové služby z Chýnova: úklid kanceláří, úklid domácností, mytí oken a tepování. Praha a okolí i celá ČR. Tel. +420 720 021 186.",
  tagline: "Úklidové služby — úklid kanceláří a domácností",

  telephone: "+420720021186",
  telephoneDisplay: "+420 720 021 186",
  email: "josefpufr@email.cz",

  // Na webu je jen PSČ a obec. Ulice ani IČO uvedené nejsou.
  address: {
    locality: "Chýnov",
    postalCode: "391 55",
    country: "CZ",
  },

  // Bod, ze kterého kalkulačka počítá dojezd (Chýnov). Není to adresa provozovny.
  geo: { latitude: 49.4061, longitude: 14.8106 },

  // Provozní doba zobrazená v kontaktu: Po–Ne 8:00–18:00.
  openingHours: [
    {
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
  ],

  // Jen místa, která stránka výslovně zmiňuje.
  areaServed: ["Chýnov", "Praha a okolí", "Česká republika"],

  services: [
    "Úklid kanceláří a firemních prostor",
    "Úklid domácností a rodinných domů",
    "Mytí oken a prosklených ploch",
    "Hloubkové čištění a tepování koberců",
    "Čištění čalounění, sedaček a matrací",
    "Úklid po stavbě, rekonstrukci a malování",
    "Úklid společných prostor bytových domů",
  ],
} as const;

export type FaqItem = { question: string; answer: string };

export function getFaqItems(): FaqItem[] {
  const windowText = formatBandList(windowBands);
  const carpetText = formatBandList(carpetBands);

  return [
    {
      question: "Kdo je Josef Pufr?",
      answer: `Josef Pufr poskytuje úklidové služby pod označením ${siteConfig.name}. Na webu je uveden telefon ${siteConfig.telephoneDisplay} a e-mail ${siteConfig.email}.`,
    },
    {
      question: "Jaké úklidové služby nabízíte?",
      answer:
        "Úklid kanceláří a firemních prostor, úklid domácností a rodinných domů, mytí oken a prosklených ploch, hloubkové čištění a tepování koberců, čištění čalounění, sedaček a matrací a úklid po stavbě, rekonstrukci nebo malování. U kanceláří jde o pravidelný i generální úklid, u domácností o jednorázové i pravidelné generální úklidy. U firem je v nabídce i úklid společných prostor bytových domů.",
    },
    {
      question: "Děláte úklid kanceláří i úklid domácností?",
      answer:
        "Ano. Komerční úklid zahrnuje firemní prostory, kanceláře a administrativní budovy. Rezidenční úklid je péče o domácnosti, rodinné domy a bytové prostory. U obou je možné mytí oken, tepování koberců, čištění čalounění a úklid po stavbě.",
    },
    {
      question: "Kde úklid realizujete?",
      answer: `Výjezd se počítá z Chýnova (PSČ ${siteConfig.address.postalCode}). Ceník dopravy uvádí realizaci kdekoli v Praze a okolí a zároveň možnost realizace po celé České republice. Sazba se počítá z Chýnova k vám a zpět.`,
    },
    {
      question: "Jak se počítá cena úklidu?",
      answer: `Cena se odvíjí od velikosti objektu, plochy v m² a míry znečištění. Komerční úklid je na ceníku jako individuální, rezidenční podle velikosti. Kalkulačka na webu používá základní sazbu ${COMMERCIAL_BASE_PER_M2} Kč/m² u komerčního úklidu a ${RESIDENTIAL_BASE_PER_M2} Kč/m² u rezidenčního. Konečnou cenu stanovujeme po dohodě před zahájením prací. U firem je zpracování cenové nabídky zdarma do 24 hodin, u domácností bezplatná osobní prohlídka a nacenění. Částky z kalkulačky jsou orientační.`,
    },
    {
      question: "Kolik stojí doprava?",
      answer: `Doprava je ${TRANSPORT_CZK_PER_KM} Kč za kilometr. Ceník uvádí, že se sazba počítá z Chýnova k vám a zpět; kalkulačka proto násobí jednosměrnou vzdálenost sazbou ${TRANSPORT_CZK_PER_KM} Kč a cestou tam i zpět. U vybraných balíčků je doprava zdarma. Dovoz techniky a vybavení je v ceně a kalkulace je předem.`,
    },
    {
      question: "Jak se v kalkulačce účtuje mytí oken, tepování a úklid po stavbě?",
      answer: `Jde o orientační sazby. Mytí oken: ${windowText}. Tepování koberců: ${carpetText}. Čištění čalounění je ${UPHOLSTERY_FLAT_CZK.toLocaleString("cs-CZ")} Kč. Úklid po stavbě je ${CONSTRUCTION_PER_M2} Kč/m². Závazné nacenění potvrzujeme po odeslání poptávky.`,
    },
    {
      question: "Jaká je provozní doba?",
      answer:
        "Po–Ne 8:00–18:00. U komerčního úklidu je v nabídce flexibilní harmonogram i mimo pracovní dobu.",
    },
    {
      question: "Jak poptat úklid?",
      answer: `Zavolejte na ${siteConfig.telephoneDisplay}, napište na ${siteConfig.email}, nebo odešlete nezávaznou poptávku ve formuláři na této stránce. K poptávce lze připojit údaje z kalkulačky. Orientační nabídku jde také stáhnout jako PDF. Kalkulace je zdarma.`,
    },
  ];
}

export function getLlmsTxt(): string {
  const faq = getFaqItems()
    .map((item) => `### ${item.question}\n${item.answer}`)
    .join("\n\n");

  return `# Josef Pufr — úklidové služby

> Josef Pufr (značka ${siteConfig.name}) poskytuje úklid kanceláří, úklid domácností, mytí oken, tepování koberců a úklid po stavbě. Jediná veřejná stránka je v češtině.

- Kanonická URL: ${siteUrl}
- Jazyk: cs
- Neindexovat duplicitní hostitele. Produkční alias pujos.vercel.app se přesměrovává na ${siteUrl}.

## Služby
${siteConfig.services.map((service) => `- ${service}`).join("\n")}

## Oblast působení
- Výjezd z Chýnova, PSČ ${siteConfig.address.postalCode}. Ulice na webu není.
- Ceník dopravy: kdekoli v Praze a okolí, sazba z Chýnova k zákazníkovi a zpět.
- Uvedená možnost realizace po celé České republice.
- Web nejmenuje další města ani kraj.

## Ceny uvedené na webu
- Komerční úklid: individuální. Rezidenční úklid: dle velikosti.
- Kalkulačka (orientačně): komerční základ ${COMMERCIAL_BASE_PER_M2} Kč/m², rezidenční základ ${RESIDENTIAL_BASE_PER_M2} Kč/m².
- Doprava: ${TRANSPORT_CZK_PER_KM} Kč/km, v kalkulačce tam i zpět. U vybraných balíčků zdarma.
- Mytí oken: ${formatBandList(windowBands)}.
- Tepování koberců: ${formatBandList(carpetBands)}.
- Čištění čalounění: ${UPHOLSTERY_FLAT_CZK.toLocaleString("cs-CZ")} Kč. Úklid po stavbě: ${CONSTRUCTION_PER_M2} Kč/m².
- Konečná cena až po dohodě před zahájením prací. Firemní nabídka zdarma do 24 hodin. U domácností bezplatná osobní prohlídka a nacenění.
- U rezidenčního úklidu jsou profesionální čisticí prostředky v ceně.

## Provoz
- Po–Ne 8:00–18:00.
- Komerční úklid: flexibilní harmonogram i mimo pracovní dobu.

## Kontakt
- Telefon: ${siteConfig.telephoneDisplay}
- E-mail: ${siteConfig.email}
- Místo uvedené na webu: ${siteConfig.address.postalCode} ${siteConfig.address.locality}
- Poptávka: ${siteUrl}/#kontakt

## Časté dotazy

${faq}

## Co web neuvádí
Nevymýšlejte ulici, IČO, další telefon, otevírací dobu mimo Po–Ne 8:00–18:00, ceny mimo sazby výše, hodnocení ani recenze. Web nemá zveřejněné recenze ani odkazy na skutečné profily na sociálních sítích nebo v katalozích.
`;
}

/**
 * JSON-LD (schema.org) pro Google i Seznam.
 * HouseCleaning pokrývá úklid domácností, ProfessionalService i firemní úklid.
 */
export function getStructuredData() {
  const businessId = `${siteUrl}/#business`;
  const personId = `${siteUrl}/#josef-pufr`;
  const websiteId = `${siteUrl}/#website`;
  const faq = getFaqItems();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["HouseCleaning", "ProfessionalService"],
        "@id": businessId,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        description: siteConfig.description,
        url: siteUrl,
        image: `${siteUrl}/og-image.png`,
        logo: `${siteUrl}/icon-512.png`,
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        currenciesAccepted: "CZK",
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.address.locality,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        areaServed: [
          { "@type": "City", name: "Chýnov" },
          { "@type": "AdministrativeArea", name: "Praha a okolí" },
          { "@type": "Country", name: "Česká republika" },
        ],
        openingHoursSpecification: siteConfig.openingHours.map((spec) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: spec.days,
          opens: spec.opens,
          closes: spec.closes,
        })),
        founder: { "@id": personId },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Úklidové služby",
          itemListElement: [
            ...siteConfig.services.map((service) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: service },
            })),
            {
              "@type": "Offer",
              price: String(TRANSPORT_CZK_PER_KM),
              priceCurrency: "CZK",
              unitText: "km",
              description:
                "Doprava 7 Kč/km. Sazba se počítá z Chýnova k zákazníkovi a zpět; kalkulačka násobí jednosměrnou vzdálenost sedmi korunami a cestou tam i zpět.",
              itemOffered: {
                "@type": "Service",
                name: "Doprava k zakázce",
              },
            },
          ],
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.legalName,
        url: siteUrl,
        email: siteConfig.email,
        telephone: siteConfig.telephone,
        jobTitle: "Poskytovatel úklidových služeb",
        worksFor: { "@id": businessId },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteConfig.name,
        inLanguage: "cs",
        publisher: { "@id": businessId },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${siteConfig.legalName} | ${siteConfig.tagline}`,
        description: siteConfig.description,
        inLanguage: "cs",
        isPartOf: { "@id": websiteId },
        about: { "@id": businessId },
        primaryImageOfPage: `${siteUrl}/og-image.png`,
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        url: `${siteUrl}/#dotazy`,
        inLanguage: "cs",
        isPartOf: { "@id": websiteId },
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
