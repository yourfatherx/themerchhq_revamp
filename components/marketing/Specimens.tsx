import { cn } from "@/lib/cn";

/**
 * The artefacts a run actually produces, built from the same tokens the product
 * uses — so these are specimens rather than illustrations, and when the real
 * thing changes, so do they.
 *
 * Two problems brought them here. The size table's data was declared twice, in
 * `HowItWorks` and `FeatureSplit`, where the copies could drift apart silently.
 * And the storefront card and the receipt lived only in `HowItWorks`, which
 * nothing imported — so the one artefact showing where a buyer's money goes was
 * built, correct, and rendered nowhere.
 *
 * `OfferBento` keeps its own card: it shows a live campaign's totals rather than
 * a storefront listing, so it looks similar but is not this.
 */

/**
 * A storefront listing: the address it lives at, and the card a buyer taps.
 *
 * The garment is not here. It is the card's own full-bleed photograph, set by
 * the page — this used to carry its own inset plate, which made it the one
 * artefact whose image stopped short of the card's edges while the other two
 * ran to them. The specimen is the panel; the product shot is the ground it
 * sits on, the same as every other card in the row.
 */
export function StorefrontSpecimen() {
  return (
    <>
      {/* On a chip, not straight on the photograph. Ink Gray over the garment's
          navy shoulder measures 3.19:1; on a solid chip it is 6.58:1 and does
          not depend on what the picture behind it happens to be doing. A
          storefront address belongs in something shaped like an address bar
          anyway. */}
      <p className="mb-3 inline-flex self-start rounded-full bg-surface px-2.5 py-1 text-[12px] tracking-[-0.01em] text-ink-muted">
        music-club.themerchhq.in
      </p>

      <div className="rounded-md border border-hairline bg-surface p-4">
        <p className="text-[17px] leading-[1.25] font-medium tracking-[-0.03em] text-ink">Hostel Night 2026</p>
        <p className="figure mt-1 text-[15px] text-ink-muted">
          From <span className="text-ink">₹899</span>
        </p>

        <div className="mt-4 flex gap-2">
          {["S", "M", "L", "XL"].map((s) => (
            <span
              key={s}
              className={cn(
                "figure grid size-8 place-items-center rounded-md border text-[13px]",
                s === "L"
                  ? "border-accent bg-accent text-surface"
                  : "border-hairline text-ink",
              )}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
          <span className="text-[12px] tracking-[-0.01em] text-ink-muted">Closes in</span>
          <span className="figure text-[15px] text-ink">9d 04h</span>
        </div>
      </div>
    </>
  );
}

/** DSH-3. The design file's note on it reads: one table is the whole pitch. */
export const SIZE_ROWS = [
  { size: "S", qty: 12 },
  { size: "M", qty: 41 },
  { size: "L", qty: 68 },
  { size: "XL", qty: 39 },
  { size: "2XL", qty: 11 },
] as const;

/** The run's total, derived rather than restated, so the two can never drift. */
export const SIZE_TOTAL = SIZE_ROWS.reduce((n, r) => n + r.qty, 0);

/**
 * Two densities, because the table appears both at full width and floating
 * inside a smaller panel over a photograph. An explicit variant rather than a
 * `className` override: `cn` is a plain join, not `tailwind-merge`, so layered
 * padding classes would both land and let source order decide.
 */
const DENSITY = {
  default: { cell: "py-2.5 text-[15px]", total: "py-3 text-[15px]" },
  compact: { cell: "py-2 text-[14px]", total: "py-2.5 text-[14px]" },
} as const;

export function SizeTableSpecimen({
  density = "default",
}: {
  density?: keyof typeof DENSITY;
}) {
  const max = Math.max(...SIZE_ROWS.map((r) => r.qty));
  const d = DENSITY[density];

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Quantity ordered by size for the Heavyweight hoodie
      </caption>
      <tbody>
        {SIZE_ROWS.map((r) => (
          <tr key={r.size} className="border-b border-hairline">
            <th
              scope="row"
              className={cn("figure font-medium text-ink", d.cell)}
            >
              {r.size}
            </th>
            <td className={cn("w-full px-4", d.cell)}>
              {/* The bar is the table's own data, not a second chart — it is
                  why the shape of a run is readable at a glance, and it is the
                  one place the accent is allowed to carry real area. */}
              <span
                aria-hidden="true"
                className="block h-2 rounded-full bg-accent"
                style={{ width: `${(r.qty / max) * 100}%` }}
              />
            </td>
            <td className={cn("figure text-right text-ink", d.cell)}>
              {r.qty}
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row" className={cn("font-semibold text-ink", d.total)}>
            Total
          </th>
          <td />
          <td
            className={cn("figure text-right font-semibold text-ink", d.total)}
          >
            {SIZE_TOTAL}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function ReceiptSpecimen() {
  return (
    <>
      <dl className="space-y-3">
        {[
          ["Hoodie × 1", "₹899.00"],
          ["GST at 12%", "₹108.00"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-[14px] leading-[1.45] tracking-[-0.01em] text-ink-muted">{k}</dt>
            <dd className="figure text-[15px] text-ink">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-hairline pt-3">
          <dt className="text-[15px] leading-[1.45] tracking-[-0.01em] font-medium text-ink">Paid</dt>
          <dd className="figure text-[17px] font-medium text-ink">₹1,007.00</dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-hairline pt-4 text-[12px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
        Paid to The Merch HQ by UPI, not to an individual&apos;s account.
      </p>
    </>
  );
}
