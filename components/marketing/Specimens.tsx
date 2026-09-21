import Image from "next/image";
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
 * The reference's image card with a panel floating over its lower edge. Here
 * the "image" is the garment plate, so the card reads as a storefront listing
 * rather than as decoration.
 */
export function StorefrontSpecimen() {
  return (
    // The plate needs real height for the panel to overlay *onto*. It carries
    // the actual catalogue flat-lay rather than a flat colour block: the card is
    // depicting a storefront listing, and a listing shows the garment.
    <div className="relative min-h-[380px] overflow-hidden rounded-md bg-plate p-5">
      <Image
        src="/products/heavyweight-hoodie.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover object-top"
      />

      <p className="t-caption relative">music-club.themerchhq.in</p>

      <div className="absolute inset-x-4 bottom-4 rounded-md border border-hairline bg-surface p-4">
        <p className="t-h4 text-ink">Hostel Night 2026</p>
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
          <span className="t-caption">Closes in</span>
          <span className="figure text-[15px] text-ink">9d 04h</span>
        </div>
      </div>
    </div>
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
            <dt className="t-body-sm text-ink-muted">{k}</dt>
            <dd className="figure text-[15px] text-ink">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-hairline pt-3">
          <dt className="t-body font-medium text-ink">Paid</dt>
          <dd className="figure text-[17px] font-medium text-ink">₹1,007.00</dd>
        </div>
      </dl>

      <p className="t-caption mt-5 border-t border-hairline pt-4">
        Paid to The Merch HQ by UPI, not to an individual&apos;s account.
      </p>
    </>
  );
}
