import Image from "next/image";
import { Arrow, Chip, Eyebrow, RoundLink, Slab } from "./Bits";
import { cn } from "@/lib/cn";

/**
 * The operating numbers, as the reference's dark list block.
 *
 * These were a full-width blue panel with an icon over every figure, then four
 * identical columns of big-number-over-small-label. Both fail the same way:
 * four facts at equal weight read as a spec sheet, and a reader skims all four
 * and retains none.
 *
 * The reference solves exactly this shape — a dark slab, a heading, then a
 * stack of rows with the value at the right and one row filled in the accent,
 * with an image card lapping over the stack from the right. The emphasis is
 * honest here: "five days from quote to a live storefront" is the promise this
 * company is held to, and the other three qualify it.
 *
 * The rows reserve right padding at `lg` so no label ever runs under the image
 * card. White on New Car is 6.49:1, so the filled row clears the floor.
 */

type Row = { label: string; value: string; lead?: boolean };

const ROWS: Row[] = [
  { label: "From quote to a live storefront", value: "5 days", lead: true },
  { label: "Units a campaign can run", value: "40–2,000" },
  { label: "Orders reprinted for a size error", value: "1%" },
  { label: "Spreadsheets you maintain", value: "0" },
];

export function ProofRow() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <Slab tone="ink" className="relative overflow-hidden lg:p-14">
        <Eyebrow onDark>Measured</Eyebrow>
        <h2 className="t-h2 mt-4 max-w-[20ch] text-surface">
          Every number here is one we are held to on a real campaign.
        </h2>

        {/* Laps over the stack from the right, as the reference's does. */}
        <div className="pointer-events-none absolute right-14 bottom-14 hidden h-[260px] w-[300px] overflow-hidden rounded-lg lg:block">
          <Image
            src="/studio/s6.jpg"
            alt=""
            fill
            sizes="300px"
            className="object-cover"
          />
        </div>

        <dl className="mt-12">
          {ROWS.map((r) => (
            <div
              key={r.label}
              className={cn(
                "flex items-center justify-between gap-6 rounded-lg px-5 py-5 lg:pr-[360px]",
                r.lead ? "bg-accent" : "border-b border-white/12 last:border-b-0",
              )}
            >
              <div className="min-w-0">
                <dt
                  className={cn(
                    "t-body",
                    r.lead ? "font-medium text-surface" : "text-white/70",
                  )}
                >
                  {r.label}
                </dt>
                {r.lead ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip tone="dark">Artwork approved</Chip>
                    <Chip tone="dark">Subdomain live</Chip>
                    <Chip tone="dark">Link sent</Chip>
                  </div>
                ) : null}
              </div>

              <dd
                className={cn(
                  "figure flex shrink-0 items-center gap-4 text-surface",
                  r.lead ? "t-h2" : "t-h3",
                )}
              >
                {r.value}
                {r.lead ? (
                  <RoundLink
                    href="/quote"
                    label="Request a quote"
                    tone="surface"
                    className="pointer-events-auto"
                  />
                ) : (
                  <Arrow className="size-4 text-white/35" />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Slab>
    </section>
  );
}
