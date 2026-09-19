import { addPaise, type Paise } from "./money";

/**
 * GST (PAY-9) — calculated and shown separately at checkout.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * D2 is split in two. One half is settled here; the other is not ours to settle.
 *
 * SETTLED — how tax is rounded.
 *   Section 170 of the CGST Act, 2017: tax "shall be rounded off to the nearest
 *   rupee", with 50 paise and above rounding up and less than 50 paise ignored.
 *   Normal rounding, not always-up, so there is no systematic bias.
 *
 *   We therefore compute the tax exactly in paise, then round ONCE at the
 *   invoice level — not per line. Rounding each line and summing produces the
 *   one-paisa drift that shows up as a mismatch between a supplier's invoice
 *   and a buyer's books. Both figures are kept: `exact` is what GSTR-1 wants
 *   (reported to two decimals) and `rounded` is what the buyer pays.
 *
 *   This is why `Screens.dc.html` shows ₹234 and ₹2,181 on a ₹1,947 taxable
 *   value at 12% rather than ₹233.64 and ₹2,180.64. The design was right.
 *
 * NOT SETTLED — the rate, and whether a kit is a composite or a mixed supply.
 *   That determination has money and liability attached and belongs to a
 *   chartered accountant, not to this file. So the rate is configurable per
 *   product, defaults to unset, and a campaign cannot go live while any
 *   published product still lacks one. See `missingTaxRate` below.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Basis points, so the rate itself is exact and auditable. 1200 = 12%. */
export const GST_RATES = [
  { basisPoints: 0, label: "0% — exempt" },
  { basisPoints: 500, label: "5%" },
  { basisPoints: 1200, label: "12%" },
  { basisPoints: 1800, label: "18%" },
  { basisPoints: 2800, label: "28%" },
] as const;

export type GstBreakdown = {
  /** Tax to the paise, for GSTR-1 and reconciliation. */
  exact: Paise;
  /** Tax as charged, rounded to the nearest rupee per Section 170. */
  rounded: Paise;
  /** Taxable value + rounded tax. */
  total: Paise;
  rateBasisPoints: number;
};

/**
 * Compute GST on a taxable value.
 *
 * Round once, here, at the invoice level. Do not call this per line and sum the
 * results — that is the drift this function exists to avoid.
 */
export function gstOn(
  taxableValue: Paise,
  rateBasisPoints: number,
): GstBreakdown {
  if (!Number.isInteger(rateBasisPoints) || rateBasisPoints < 0) {
    throw new RangeError(
      `GST rate must be whole basis points, got ${rateBasisPoints}`,
    );
  }

  const exact = Math.round((taxableValue * rateBasisPoints) / 10_000) as Paise;

  // Section 170: ≥50 paise rounds up, <50 paise is ignored.
  const rupees = Math.floor(exact / 100);
  const paisePart = exact % 100;
  const rounded = ((paisePart >= 50 ? rupees + 1 : rupees) * 100) as Paise;

  return {
    exact,
    rounded,
    total: addPaise(taxableValue, rounded),
    rateBasisPoints,
  };
}

/**
 * The rate that applies to a product: its own, falling back to the campaign
 * default. `null` means nobody has decided yet, which is a launch blocker
 * rather than an implicit zero — silently charging 0% is the expensive failure.
 */
export function resolveGstRate(
  product: { taxRateBasisPoints: number | null },
  campaign: { taxRateBasisPoints: number | null },
): number | null {
  return product.taxRateBasisPoints ?? campaign.taxRateBasisPoints ?? null;
}

/**
 * OPS-2 / PAY-9 go-live guard. A campaign cannot be set live while any
 * published product has no resolvable GST rate.
 *
 * Returns the offending product names so the ops console can say which ones,
 * rather than refusing with a generic error.
 */
export function missingTaxRate(
  products: ReadonlyArray<{
    name: string;
    published: boolean;
    taxRateBasisPoints: number | null;
  }>,
  campaign: { taxRateBasisPoints: number | null },
): string[] {
  return products
    .filter((p) => p.published && resolveGstRate(p, campaign) === null)
    .map((p) => p.name);
}

/**
 * The question to put to the CA, kept in code so it does not drift from what
 * the system actually does. Rendered in the ops console beside the rate picker.
 */
export const CA_QUESTION = `We sell merchandise kits to colleges and companies at a single per-kit price — for example a hoodie, a cap and a sticker sheet for one amount. We also sell the same items individually.

1. For a kit at a single price, is this a composite supply under s.2(30) (naturally bundled, taxed at the principal supply's rate) or a mixed supply under s.2(74) (taxed at the highest rate among the components)?
2. What rate applies to each of: apparel below and above the Rs 1,000 threshold, headwear, printed paper and stickers, and insulated drinkware?
3. Does printing a customer's artwork on a blank change the classification from a supply of goods to a supply of services?`;
