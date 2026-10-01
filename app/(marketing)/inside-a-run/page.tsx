import type { Metadata } from "next";
import { PhotoBand } from "@/components/marketing/PhotoBand";
import {
  ReceiptSpecimen,
  SIZE_TOTAL,
  SizeTableSpecimen,
  StorefrontSpecimen,
} from "@/components/marketing/Specimens";
import { getCatalogue } from "@/content/catalogue";
import { formatINR, timesQty, type Paise } from "@/lib/money";
import { gstOn } from "@/lib/tax";

export const metadata: Metadata = {
  title: "Inside a run — The Merch HQ",
  description:
    "One run, end to end: the storefront, the size table, the receipt and the boxes that land.",
};

/**
 * MKT-4 — what a campaign actually produces.
 *
 * This lived at /work, which read as a portfolio and sat one nav item away from
 * /how-it-works. The two names described the same thing to a reader who had not
 * clicked either. They are different pages: /how-it-works is the process, and
 * this is the artefacts — the screens, the table, the receipt and the money. The
 * site already called it this, in the home page's own band: what a run produces.
 *
 * There are no published case studies yet, and that is still not a reason to
 * invent a client: the sample campaigns in `lib/ops-data.ts` are demo fixtures
 * behind `/ops`, and publishing them as work would be the fabrication
 * `QuoteCards` refuses. So the page shows the run rather than a customer.
 *
 * Every artefact below is the real component the product renders — the same
 * storefront card, the same size table, the same receipt — so this page cannot
 * drift from the product, and becomes the case-study template the day a real
 * run ships.
 *
 * The three were stacked as full-width rows, each with its copy in a column
 * beside it, which made the page long and made three equal things look like
 * three separate arguments. They are one sequence, so they now sit as one
 * numbered row of three, and the whole sequence is visible without scrolling.
 *
 * The cost panel is derived from `content/catalogue.ts` rather than typed: a
 * hardcoded total is a price we might not honour.
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

/**
 * One artefact: a numeral, the specimen on its own panel, then the words.
 *
 * The numeral is `aria-hidden` and the three sit in an `<ol>`, so the order is
 * carried by the list rather than by a decorative glyph. It is Ink Gray at
 * 6.58:1 rather than the reference's near-white, which measures far below the
 * floor — the position in the row already does the work, so there is nothing to
 * gain by making the number itself hard to read.
 */
function Artefact({
  n,
  when,
  title,
  body,
  children,
}: {
  n: number;
  when: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <p
        aria-hidden="true"
        className="text-[44px] leading-none font-normal tracking-[-0.04em] text-ink-muted"
      >
        {n}
      </p>

      {/* One fixed height for all three, not a minimum. The storefront specimen
          is the tallest, and letting each card size to its own contents pushed
          the three titles onto different lines — which read as three unrelated
          blocks rather than one sequence. */}
      <div className="mt-5 flex h-[480px] flex-col bg-canvas p-5">
        <div className="flex grow flex-col justify-center">{children}</div>
        <p className="mt-5 self-center rounded-full border border-hairline bg-surface px-3 py-1 text-[12px] tracking-[-0.01em] text-ink-muted">
          {when}
        </p>
      </div>

      <h2 className="mt-5 text-[18px] leading-[1.25] font-medium tracking-[-0.03em] text-ink">
        {title}
      </h2>
      <p className="mt-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-ink-muted">
        {body}
      </p>
    </li>
  );
}

export default async function InsideARunPage() {
  const catalogue = await getCatalogue();
  const hoodie = catalogue.find((i) => i.slug === "heavyweight-hoodie");

  const tier = hoodie ? tierFor(hoodie.tiers, SIZE_TOTAL) : null;
  const subtotal = tier ? timesQty(tier.unitPrice, SIZE_TOTAL) : null;
  const gst = subtotal ? gstOn(subtotal, 1200) : null;

  return (
    <main className="bg-surface">
      {/* Heading and its qualifier side by side, so the page opens on one line
          rather than on a stack. */}
      <header className="px-4 pt-10 pb-10 sm:px-5 lg:pt-14 lg:pb-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="lg:col-span-7 text-[clamp(32px,2.2vw+24px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
            One run,{" "}
            <em className="font-normal tracking-[-0.03em] normal-case">
              end to end.
            </em>
          </h1>
          <p className="max-w-[46ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted lg:col-span-5 lg:text-right">
            Everything below is the real thing the product renders, not a
            mock-up of it. Named client campaigns appear here once the first one
            ships.
          </p>
        </div>
      </header>

      <section className="border-t border-hairline px-4 py-12 sm:px-5 lg:py-16">
        <ol className="grid gap-10 lg:grid-cols-3 lg:gap-6">
          <Artefact
            n={1}
            when="Day 5"
            title="The storefront your people see."
            body="Your subdomain, your logo, your accent colour, and the sizes a buyer picks from. One link goes to the group; nobody asks you what size to put down."
          >
            <StorefrontSpecimen />
          </Artefact>

          <Artefact
            n={2}
            when="At close"
            title="The table that goes to print."
            body="Every order carries the size its buyer chose, so this is finished the moment the storefront closes. No thread of corrections, and nothing to rebuild by hand."
          >
            <div className="flex items-center justify-between gap-4 pb-3">
              <p className="text-[13px] tracking-[-0.01em] text-ink-muted">
                Heavyweight hoodie — to print
              </p>
              <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium tracking-[-0.01em] text-ink">
                Closed
              </span>
            </div>
            {/* Compact: in a third of the width the default density wraps the
                size column onto two lines. */}
            <SizeTableSpecimen density="compact" />
          </Artefact>

          <Artefact
            n={3}
            when="On payment"
            title="Where the money goes."
            body="Buyers pay us directly by UPI, card or netbanking, and each one gets this. Nothing lands in a personal account, so there is no float to carry and nothing to reconcile at the end."
          >
            <div className="bg-surface p-5">
              <p className="mb-5 text-[13px] tracking-[-0.01em] text-ink-muted">
                Order MHQ-4KPR
              </p>
              <ReceiptSpecimen />
            </div>
          </Artefact>
        </ol>
      </section>

      <PhotoBand
        src="/studio/packing-bench.jpg"
        alt="An order being boxed and tied at the packing bench"
        title="Printed, packed and handed over"
        body={`Six days after close. ${SIZE_TOTAL} units to one address or split across a campus, with a collection list the handover desk works from.`}
      />

      {/* Derived, never typed — see `tierFor`. */}
      {hoodie && tier && subtotal && gst ? (
        <section className="border-t border-hairline px-4 py-12 sm:px-5 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="text-[12px] font-medium tracking-[0.02em] text-ink-muted uppercase">
                What it came to
              </p>
              <h2 className="mt-3 max-w-[16ch] text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink">
                The arithmetic, in full.
              </h2>
              <p className="mt-2 max-w-[44ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
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
                <dt className="text-[18px] font-medium tracking-[-0.03em] text-ink">
                  Total
                </dt>
                <dd className="figure text-[24px] font-medium tracking-[-0.03em] text-ink">
                  {formatINR(gst.total)}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}

      {/* The honest note, as a footnote rather than as the whole page. It
          carries no button of its own: the band below is the ask, and two in a
          row is the repetition this site keeps taking out. */}
      <section className="border-t border-hairline px-4 py-12 sm:px-5 lg:py-16">
        <h2 className="max-w-[26ch] text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink">
          No client campaigns are published here yet.
        </h2>
        <p className="mt-2 max-w-[58ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
          We would rather show you the machinery than invent a customer to put
          in front of it. The first real run becomes the first case study, with
          its units, its size spread and the date it landed.
        </p>
      </section>

      <PhotoBand
        emphasis
        src="/studio/dispatch-boxes.jpg"
        alt="Rows of open cartons waiting to be filled"
        title="Be the first campaign"
        body="Tell us the date and the headcount. We come back with a quote, a per-unit price and a delivery date you can hold us to."
        href="/quote"
        cta="Request a quote"
      />
    </main>
  );
}

function Line({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-5">
      <dt>
        <span className="block text-[15px] leading-[1.45] tracking-[-0.01em] text-ink">
          {k}
        </span>
        {sub ? (
          <span className="mt-1 block text-[13px] tracking-[-0.01em] text-ink-muted">
            {sub}
          </span>
        ) : null}
      </dt>
      <dd className="figure shrink-0 text-[18px] font-medium tracking-[-0.03em] text-ink">
        {v}
      </dd>
    </div>
  );
}
