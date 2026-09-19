import Image from "next/image";
import { Chip, Eyebrow, RoundLink, Slab } from "./Bits";

/**
 * The reference's second block: a chip row and a label facing each other across
 * the top, a heading with its supporting line set beside rather than under it,
 * then a three-up of a counter, a dark card and an image card.
 *
 * The counter is the reference's "01/8". Ours counts the stages of a run, which
 * is a real sequence — numbering content that is not a sequence is the thing
 * that makes numbered markers read as decoration.
 */

export function ProgramRow() {
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

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {/* Counter */}
          <div className="flex flex-col justify-between rounded-lg bg-canvas p-6 lg:col-span-3">
            <div>
              <p className="figure text-[64px] leading-[0.9] font-semibold text-ink">
                01
                <span className="text-[28px] text-ink-muted">/4</span>
              </p>
              <p className="t-body-sm mt-3 text-ink-muted">
                Quote in one
                <br />
                working day
              </p>
            </div>
            <div className="mt-10 flex gap-2">
              <RoundLink
                href="/how-it-works"
                label="How it works"
                tone="surface"
              />
              <RoundLink href="/quote" label="Request a quote" />
            </div>
          </div>

          {/* Dark card */}
          <div className="flex flex-col rounded-lg bg-ink p-6 lg:col-span-4">
            <p className="t-h3 text-surface">
              You send a headcount. We send a fixed number, not a range.
            </p>
            <div className="mt-auto flex items-center gap-2 pt-10">
              <Chip tone="accent">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-surface"
                />
                Live
              </Chip>
              <Chip tone="dark" className="border border-white/15">
                themerchhq.in
              </Chip>
            </div>
          </div>

          {/* Image card with overlay copy */}
          <div className="relative min-h-[300px] overflow-hidden rounded-lg lg:col-span-5">
            <Image
              src="/studio/s5.jpg"
              alt="Garments being wrapped for dispatch"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
            />
            <div className="absolute top-4 left-4">
              <Chip tone="solid">171 units</Chip>
            </div>
            <div className="absolute inset-x-5 bottom-5">
              <p className="t-h3 text-surface">Printed and packed in-house</p>
              <p className="t-body-sm mt-2 max-w-[30ch] text-white/80">
                One team from artwork to dispatch, so nothing is handed to a
                third party mid-run.
              </p>
            </div>
          </div>
        </div>
      </Slab>
    </section>
  );
}
