import Image from "next/image";
import { Chip, Eyebrow, RoundLink } from "./Bits";

/**
 * The reference's fourth block: a tall image card on the left carrying a data
 * panel that floats clear of its edges, and a column of copy on the right that
 * ends in a small image card and a circular control.
 *
 * The data panel is the real size table rather than a chart drawn for looks —
 * it is the one artefact that decides what gets printed, so it is the right
 * thing to float over a photograph of the print run.
 */

const SIZE_ROWS = [
  { size: "S", qty: 12 },
  { size: "M", qty: 41 },
  { size: "L", qty: 68 },
  { size: "XL", qty: 39 },
  { size: "2XL", qty: 11 },
] as const;

export function FeatureSplit() {
  const total = SIZE_ROWS.reduce((n, r) => n + r.qty, 0);
  const max = Math.max(...SIZE_ROWS.map((r) => r.qty));

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Image + floating data panel */}
        <div className="relative min-h-[560px] overflow-hidden rounded-xl lg:col-span-7">
          <Image
            src="/studio/s2.jpg"
            alt="A print run being checked in the studio"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />

          <div className="absolute inset-x-5 bottom-5 rounded-lg bg-surface p-5 sm:inset-x-8 sm:bottom-8 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="t-caption">Heavyweight hoodie — to print</p>
              <Chip tone="solid">Closed</Chip>
            </div>

            <table className="mt-4 w-full border-collapse text-left">
              <caption className="sr-only">
                Quantity ordered by size for the Heavyweight hoodie
              </caption>
              <tbody>
                {SIZE_ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-hairline">
                    <th
                      scope="row"
                      className="figure py-2 text-[14px] font-medium text-ink"
                    >
                      {r.size}
                    </th>
                    <td className="w-full px-4 py-2">
                      <span
                        aria-hidden="true"
                        className="block h-2 rounded-full bg-accent"
                        style={{ width: `${(r.qty / max) * 100}%` }}
                      />
                    </td>
                    <td className="figure py-2 text-right text-[14px] text-ink">
                      {r.qty}
                    </td>
                  </tr>
                ))}
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 text-[14px] font-semibold text-ink"
                  >
                    Total
                  </th>
                  <td />
                  <td className="figure py-2.5 text-right text-[14px] font-semibold text-ink">
                    {total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Copy column */}
        <div className="flex flex-col rounded-xl bg-surface p-6 sm:p-8 lg:col-span-5">
          <Eyebrow>At close</Eyebrow>
          <h2 className="t-h2 mt-4 max-w-[13ch] text-ink">Sizes arrive clean.</h2>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>Per-order sizing</Chip>
            <Chip>CSV export</Chip>
            <Chip>GST invoice</Chip>
          </div>

          <p className="t-body mt-6 max-w-[38ch] text-ink-muted">
            Every order carries the size its buyer picked on the page. At close
            you get the breakdown as a table — the thing you would otherwise
            rebuild by hand from a thread of corrections.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <RoundLink href="/how-it-works" label="See how a run works" />
            <p className="t-body-sm text-ink-muted">
              See how a run works
            </p>
          </div>

          {/* Small image card, as the reference's "coming soon" tile */}
          <div className="relative mt-auto min-h-[190px] overflow-hidden rounded-lg pt-10">
            <Image
              src="/products/campus-cap.png"
              alt="Blank navy six-panel campus cap"
              fill
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
              <Chip>Campus cap · ₹649</Chip>
              <RoundLink href="/catalogue" label="Open the catalogue" tone="surface" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
