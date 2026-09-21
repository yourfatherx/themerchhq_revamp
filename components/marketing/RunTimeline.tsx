import Image from "next/image";
import { cn } from "@/lib/cn";
import { Chip, Eyebrow, Slab } from "./Bits";

/**
 * The stages of a run, on a track.
 *
 * This replaced a copy of the reference's carousel block, which was the wrong
 * borrowing. That block is a paginated carousel — "01 /8" is the position in a
 * set of eight, the circular buttons page through them, the chips filter them,
 * and the cards beside it are the current slice. Reproducing its parts around
 * content that is not a set produced a counter that counted nothing, controls
 * that navigated to unrelated pages, and filters that filtered nothing.
 *
 * What this content actually is, is a sequence with real durations in it, so it
 * gets the form a sequence deserves: a track, four stops, and the day count at
 * each one. Numbering is honest here for the same reason it was not there.
 *
 * The third stop is the one the organiser sets rather than one we promise, so
 * it is the only marker filled in the accent — the colour is carrying the
 * difference between a date we commit to and a date they choose, not
 * decorating the middle of the row.
 */

type Stage = {
  when: string;
  title: string;
  body: string;
  /** The stop the organiser controls rather than one we commit to. */
  theirs?: boolean;
};

const STAGES: Stage[] = [
  {
    when: "Day 1",
    title: "The quote",
    body: "You send a headcount and a date. We come back with a per-unit price and a delivery date — a fixed number, not a range.",
  },
  {
    when: "Day 5",
    title: "Storefront live",
    body: "Your subdomain, your logo, your accent colour. You send one link to the group and stop answering size questions.",
  },
  {
    when: "You set it",
    title: "Orders close",
    body: "On the date you chose, not whenever someone remembers. The size table is final the moment it closes.",
    theirs: true,
  },
  {
    when: "+6 days",
    title: "Delivered",
    body: "Printed and packed in-house, to one address or split across a campus. Every order carries its own size.",
  },
];

export function RunTimeline() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <Slab>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Chip>Campus clubs</Chip>
            <Chip>Company teams</Chip>
          </div>
          <Eyebrow>How a run works</Eyebrow>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <h2 className="t-h2 max-w-[18ch] text-ink">
            Quote on Monday, worn by the second Friday.
          </h2>
          <p className="t-body max-w-[38ch] text-ink-muted lg:pb-1">
            Five working days to a live storefront, six more from close to
            delivery. The dates are the deal, not an estimate.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-8 lg:grid-cols-4 lg:gap-5">
          {/* The track, drawn once from the first marker to the last rather
              than per-cell, so it never overshoots either end.
              The right inset is one column less the dot's radius: with four
              columns and a 20px gap a column is `25% - 15px`, so the line stops
              dead on the last dot's centre at `25% - 22px`. */}
          <span
            aria-hidden="true"
            className="absolute top-[7px] left-[7px] hidden h-px bg-hairline lg:block"
            style={{ right: "calc(25% - 22px)" }}
          />

          {STAGES.map((s) => (
            <li key={s.title} className="relative lg:pt-10">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0 left-0 hidden size-3.5 rounded-full lg:block",
                  s.theirs
                    ? "bg-accent"
                    : "border-2 border-ink-muted bg-surface",
                )}
              />

              <Chip tone={s.theirs ? "accent" : "solid"} className="lg:mb-4">
                {s.when}
              </Chip>

              <h3 className="t-h4 mt-3 text-ink lg:mt-0">{s.title}</h3>
              <p className="t-body-sm mt-2 max-w-[34ch] text-ink-muted">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Anchors the sequence in the place it ends up — the packing bench. */}
        <div className="relative mt-10 min-h-[220px] overflow-hidden rounded-lg sm:min-h-[280px]">
          <Image
            src="/studio/dispatch-boxes.jpg"
            alt="Rows of open cartons waiting to be filled"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
          {/* This card is short (280px) but carries a two-line heading over a
              body line, so the text reaches well above the bottom edge where a
              `via-ink/20` scrim still has real strength. Measured 2.62:1 before
              the stop was pushed to 60%. Re-measure if the photograph changes. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/80 via-60% to-ink/20"
          />
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="t-h3 text-surface">Printed and packed in-house</p>
              <p className="t-body-sm mt-2 max-w-[42ch] text-white/80">
                One team from artwork to dispatch, so nothing is handed to a
                third party mid-run.
              </p>
            </div>
            <Chip tone="solid">171 units · 11 days</Chip>
          </div>
        </div>
      </Slab>
    </section>
  );
}
