import Image from "next/image";
import Link from "next/link";
import { Arrow, Chip, Eyebrow, RoundLink } from "./Bits";
import { SizeTableSpecimen } from "./Specimens";

/**
 * The reference's fourth block: a tall image card on the left carrying a data
 * panel that floats clear of its edges, and a column of copy on the right that
 * ends in a small image card and a circular control.
 *
 * The data panel is the real size table rather than a chart drawn for looks —
 * it is the one artefact that decides what gets printed, so it is the right
 * thing to float over a photograph of the print run.
 */

export function FeatureSplit() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Image + floating data panel */}
        <div className="relative min-h-[560px] overflow-hidden rounded-xl lg:col-span-7">
          <Image
            src="/studio/garment-rack.jpg"
            alt="A row of identical garments hanging on a rail"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />

          <div className="absolute inset-x-5 bottom-5 rounded-lg bg-surface p-5 sm:inset-x-8 sm:bottom-8 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="t-caption">Heavyweight hoodie — to print</p>
              <Chip tone="solid">Closed</Chip>
            </div>

            <div className="mt-4">
              <SizeTableSpecimen density="compact" />
            </div>
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

          {/* One target, not a button beside a label that repeats its accessible
              name — that reads the text twice and leaves the visible words
              inert. */}
          <Link
            href="/how-it-works"
            className="group mt-8 flex w-fit items-center gap-4 rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="bg-accent text-surface group-hover:bg-brand-deep grid size-12 shrink-0 place-items-center rounded-full transition-colors">
              <Arrow />
            </span>
            <span className="t-body-sm text-ink-muted transition-colors group-hover:text-ink">
              See how a run works
            </span>
          </Link>

          {/* The spacing lives on this wrapper, not on the card: `fill` resolves
              to `inset: 0`, so padding on the card itself is covered by the
              photograph rather than showing as a gap. */}
          <div className="mt-auto pt-12">
            <div className="relative min-h-[190px] overflow-hidden rounded-lg">
              <Image
                src="/products/campus-cap.png"
                alt="Blank navy six-panel campus cap"
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                <Chip>Campus cap · ₹649</Chip>
                <RoundLink
                  href="/catalogue"
                  label="Open the catalogue"
                  tone="surface"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
