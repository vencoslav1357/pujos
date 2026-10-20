/**
 * Orientační sazby z kalkulačky na stránce. Ceníkové karty uvádějí
 * komerční úklid jako „Individuální“ a rezidenční jako „Dle velikosti“;
 * čísla níže jsou sazby, které kalkulačka návštěvníkovi spočítá.
 */

export const COMMERCIAL_BASE_PER_M2 = 19;
export const RESIDENTIAL_BASE_PER_M2 = 24;
export const TRANSPORT_CZK_PER_KM = 7;
export const UPHOLSTERY_FLAT_CZK = 1500;
export const CONSTRUCTION_PER_M2 = 25;

export type RateBand = {
  /** Horní hranice plochy (m²), pod kterou sazba platí. null = vše nad předchozí pásmo. */
  maxExclusive: number | null;
  min: number;
  max: number;
  label: string;
};

export const windowBands: readonly RateBand[] = [
  { maxExclusive: 50, min: 45, max: 60, label: "do 50 m²" },
  { maxExclusive: 200, min: 35, max: 45, label: "50–200 m²" },
  { maxExclusive: 500, min: 25, max: 35, label: "200–500 m²" },
  { maxExclusive: null, min: 15, max: 25, label: "nad 500 m²" },
];

export const carpetBands: readonly RateBand[] = [
  { maxExclusive: 30, min: 45, max: 100, label: "do 30 m²" },
  { maxExclusive: 100, min: 30, max: 45, label: "30–100 m²" },
  { maxExclusive: 500, min: 20, max: 30, label: "100–500 m²" },
  { maxExclusive: null, min: 15, max: 20, label: "nad 500 m²" },
];

function rateForArea(bands: readonly RateBand[], area: number): RateBand {
  for (const band of bands) {
    if (band.maxExclusive === null || area < band.maxExclusive) return band;
  }
  return bands[bands.length - 1];
}

export function windowRate(area: number): RateBand {
  return rateForArea(windowBands, area);
}

export function carpetRate(area: number): RateBand {
  return rateForArea(carpetBands, area);
}

export function formatBandList(bands: readonly RateBand[]): string {
  return bands
    .map((band) => `${band.label} ${band.min}–${band.max} Kč/m²`)
    .join(", ");
}
