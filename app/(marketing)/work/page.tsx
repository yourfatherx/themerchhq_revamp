import type { Metadata } from "next";
import Image from "next/image";
import { Chip, Eyebrow, Slab } from "@/components/marketing/Bits";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import {
  ReceiptSpecimen,
  SIZE_TOTAL,
  SizeTableSpecimen,
  StorefrontSpecimen,
} from "@/components/marketing/Specimens";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCatalogue } from "@/content/catalogue";
import { formatINR, timesQty, type Paise } from "@/lib/money";
import { gstOn } from "@/lib/tax";

export const metadata: Metadata = {
  title: "Work — The Merch HQ",
  description:
    "One run, end to end: the storefront, the size table, the receipt and the boxes that land.",
};

/**
 * MKT-4 — what a campaign actually produces.
 *
 * This page used to be a single dashed-bordered empty state wrapped around an
 * empty `CASE_STUDIES` array, because there are no published case studies yet.
 * That is still true, and it is still not a reason to invent a client: the
 * sample campaigns in `lib/ops-data.ts` are demo fixtures behind `/ops`, and
 * publishing them as work would be the fabrication `QuoteCards` refuses.
 *
 * So the page shows the run rather than a customer. Every artefact below is the
 * real component the product renders — the same storefront card, the same size
 * table, the same receipt — which means this page cannot drift from the
 * product, and becomes the case-study template the day a real run ships.
 *
 * The cost panel is derived from `content/catalogue.ts` rather than typed, for
 * the same reason: a hardcoded total is a price we might not honour.
 */

/** The tier a run of this size actually falls into — the largest tier it
 *  reaches, never the next one up. Hardcoding 250 for a 171-unit run would
 *  quote a price the quote engine would not stand behind. */
function tierFor(
  tiers: { units: number; unitPrice: Paise }[],
  qty: number,
): { units: number; unitPrice: Paise } {
  const reached = tiers.filter((t) => qty >= t.units);
  return reached.length
    ? reached[reached.length - 1]
    : // Below the smallest tier, the smallest tier's price is what applies.
      tiers[0];
}

export default async function WorkPage() {
  const catalogue = await getCatalogue();
  const hoodie = catalogue.find((i) => i.slug === "heavyweight-hoodie");

  const tier = hoodie ? tierFor(hoodie.tiers, SIZE_TOTAL) : null;
  const subtotal = tier ? timesQty(tier.unitPrice, SIZE_TOTAL) : null;
  const gst = subtotal ? gstOn(subtotal, 1200) : null;

  return (
    <main>
      <section className="mx-auto max-w-[1280px] px-5 pt-14 sm:px-8 sm:pt-20">
        <span aria-hidden="true" className="block h-0.5 w-10 bg-accent" />
        <Eyebrow className="mt-4">Work</Eyebrow>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h1 className="t-h1 max-w-[14ch] text-ink">One run, end to end.</h1>
          <p className="t-body max-w-[42ch] text-ink-muted lg:justify-self-end lg:pb-2 lg:text-right">
            Everything below is the real thing the product renders, not a mock-up
            of it. Named client campaigns appear here once the first one ships.
          </p>
        </div>
      </section>

      {/* Image-led: the listing floats over the studio frame, as on the home page. */}
      <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
        <Slab>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Chip tone="accent">Day 5</Chip>
              <h2 className="t-h2 mt-4 max-w-[14ch] text-ink">
                The storefront your people see.
              </h2>
              <p className="t-body mt-4 max-w-[40ch] text-ink-muted">
                Your subdomain, your logo, your accent colour, and the sizes a
                buyer picks from. One link goes to the group; nobody asks you
                what size to put down.
              </p>
            </div>

            <div className="lg:col-span-7">
              <StorefrontSpecimen />
            </div>
          </div>
        </Slab>
      </section>

      {/* Data-led: the table takes the width, the copy takes the margin. */}
      <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
        <Slab>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between gap-4">
                <p className="t-caption">Heavyweight hoodie — to print</p>
                <Chip tone="solid">Closed</Chip>
              </div>
              <div className="mt-5">
                <SizeTableSpecimen />
              </div>
            </div>

            <div className="lg:col-span-5 lg:pt-10">
              <Chip>At close</Chip>
              <h2 className="t-h2 mt-4 max-w-[14ch] text-ink">
                The table that goes to print.
              </h2>
              <p className="t-body mt-4 max-w-[38ch] text-ink-muted">
                Every order carries the size its buyer chose, so this is
                finished the moment the storefront closes. No thread of
                corrections, and nothing to rebuild by hand.
              </p>
            </div>
          </div>
        </Slab>
      </section>

      {/* Narrow artefact, wide copy — a receipt is a small object and reads
          wrong blown up to fill a column. */}
      <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
        <Slab>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Chip>On payment</Chip>
              <h2 className="t-h2 mt-4 max-w-[16ch] text-ink">
                Where the money goes.
              </h2>
              <p className="t-body mt-4 max-w-[46ch] text-ink-muted">
                Buyers pay us directly by UPI, card or netbanking, and each one
                gets this. Nothing lands in a personal account, so there is no
                float to carry and nothing to reconcile at the end.
              </p>
            </div>

            <div className="rounded-lg bg-canvas p-6 lg:col-span-5">
              <p className="t-caption mb-5">Order MHQ-4KPR</p>
              <ReceiptSpecimen />
            </div>
          </div>
        </Slab>
      </section>

      {/* The run ends where the photography shows it ending. */}
      <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
        <div className="relative min-h-[320px] overflow-hidden rounded-xl sm:min-h-[420px]">
          <Image
            src="/studio/packing-bench.jpg"
            alt="An order being boxed and tied at the packing bench"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
          {/* The text block here is tall, so its top edge lands near the middle
              of the card — where a default `via-ink/30` scrim is weakest. The
              previous photograph was a mid-tone table and got away with it; this
              one is a white bench, and the heading measured 2.98:1 against it.
              The stop is pushed to 60% so full strength is reached above the
              text rather than at the very bottom edge. Measured: 12.53:1
              heading, 9.47:1 body. Re-measure if the photograph changes. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/80 via-60% to-ink/20"
          />
          <div className="absolute inset-x-6 bottom-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Chip tone="dark" className="border border-white/15">
                +6 days
              </Chip>
              <h2 className="t-h2 mt-4 max-w-[16ch] text-surface">
                Printed, packed and handed over.
              </h2>
              <p className="t-body-sm mt-3 max-w-[44ch] text-white/80">
                To one address or split across a campus, with a collection list
                the handover desk works from.
              </p>
            </div>
            <Chip tone="solid">{SIZE_TOTAL} units · 11 days</Chip>
          </div>
        </div>
      </section>

      {/* Derived, never typed — see `tierFor`. */}
      {hoodie && tier && subtotal && gst ? (
        <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
          <Slab>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <Chip>What it came to</Chip>
                <h2 className="t-h2 mt-4 max-w-[14ch] text-ink">
                  The arithmetic, in full.
                </h2>
                <p className="t-body mt-4 max-w-[38ch] text-ink-muted">
                  {SIZE_TOTAL} units of the {hoodie.name.toLowerCase()} at the{" "}
                  {tier.units}-unit price, which is the tier a run this size
                  reaches. Prices come straight from the catalogue on this site.
                </p>
              </div>

              <dl className="lg:col-span-7">
                <Line
                  k={`${hoodie.name} × ${SIZE_TOTAL}`}
                  v={formatINR(subtotal)}
                  sub={`${formatINR(tier.unitPrice)} per unit at ${tier.units}+`}
                />
                {/* `rounded`, not `exact` — Section 170 is what a buyer is
                    actually charged, and `total` is built from it. Showing the
                    exact paise here would not add up to the total below. */}
                <Line k="GST at 12%" v={formatINR(gst.rounded)} />
                <div className="flex items-baseline justify-between gap-6 border-t border-hairline pt-5">
                  <dt className="t-h4 text-ink">Total</dt>
                  <dd className="figure t-h3 text-ink">
                    {formatINR(gst.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </Slab>
        </section>
      ) : null}

      {/* The honest note, as a footnote rather than as the whole page. */}
      <section className="mx-auto max-w-[1280px] px-5 py-6 pb-20 sm:px-8 sm:pb-24">
        <Slab>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h2 className="t-h3 max-w-[26ch] text-ink">
                No client campaigns are published here yet.
              </h2>
              <p className="t-body mt-3 max-w-[58ch] text-ink-muted">
                We would rather show you the machinery than invent a customer to
                put in front of it. The first real run becomes the first case
                study, with its units, its size spread and the date it landed.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <ButtonLink href="/quote">Be the first campaign</ButtonLink>
            </div>
          </div>
        </Slab>
      </section>

      <CtaBlock />
    </main>
  );
}

function Line({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-5">
      <dt>
        <span className="t-body block text-ink">{k}</span>
        {sub ? <span className="t-caption mt-1 block">{sub}</span> : null}
      </dt>
      <dd className="figure t-h4 shrink-0 text-ink">{v}</dd>
    </div>
  );
}
