/**
 * Measured garment dimensions in cm, per product, rendered inline — never
 * behind a modal (STO-5, STO-6).
 *
 * This is the single highest-leverage table in the product: a wrong number here
 * is a reprint. The figures are measured off the actual blank, not the mill's
 * spec sheet.
 *
 * Charts are versioned per product — editing one never alters the chart
 * attached to a closed campaign (OPS-4). This component renders whatever
 * version the campaign is pinned to; it does not resolve versions itself.
 */

export type SizeRow = {
  size: string;
  /** Chest measured flat, in cm. */
  chestCm: number;
  /** Body length, in cm. */
  lengthCm: number;
  /** Units ordered so far on this campaign, when the viewer is allowed to see it. */
  ordered?: number;
};

export function SizeChart({
  rows,
  showOrdered = false,
  caption = "Size chart — measured flat, in centimetres",
}: {
  rows: readonly SizeRow[];
  showOrdered?: boolean;
  caption?: string;
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-surface-sunken">
              <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-ink-muted">
                Size
              </th>
              <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-right text-ink-muted">
                Chest, flat
              </th>
              <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-right text-ink-muted">
                Length
              </th>
              {showOrdered ? (
                <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-right text-ink-muted">
                  Ordered
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.size}
                className={cnRow(i)}
              >
                <th scope="row" className="px-4 py-3 text-[15px] font-medium text-ink">
                  {r.size}
                </th>
                <td className="figure px-4 py-3 text-right text-[15px] text-ink">
                  {r.chestCm} cm
                </td>
                <td className="figure px-4 py-3 text-right text-[15px] text-ink">
                  {r.lengthCm} cm
                </td>
                {showOrdered ? (
                  <td className="figure px-4 py-3 text-right text-[15px] text-ink">
                    {r.ordered ?? 0}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-body-sm mt-3 text-ink-muted">
        Measured off the actual blank, not the mill&apos;s spec sheet.
      </p>
    </div>
  );
}

function cnRow(i: number) {
  return i % 2 === 1
    ? "border-b border-hairline bg-surface-sunken/60"
    : "border-b border-hairline";
}
