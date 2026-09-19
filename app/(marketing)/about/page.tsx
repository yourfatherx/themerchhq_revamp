import type { Metadata } from "next";
import { CtaBlock } from "@/components/marketing/CtaBlock";

export const metadata: Metadata = {
  title: "About — The Merch HQ",
  description:
    "We design and produce merch for colleges, clubs and companies, and give every client a storefront so their people order it themselves.",
};

const PRINCIPLES = [
  {
    title: "Dependable, not corporate",
    body: "A real date on the quote and a message the day it ships. No portal, no ticket number, no account manager who has to check.",
  },
  {
    title: "Plainspoken, not clever",
    body: "Plain words, real dates, exact numbers. We loosen the register for a club and tighten it for a procurement team, but never the facts.",
  },
  {
    title: "Exacting, not precious",
    body: "Every size chart is measured off the actual blank, not the mill's spec sheet. A wrong number there is a reprint, and the reprint is ours.",
  },
  {
    title: "On your side, not neutral",
    body: "If a campaign is going to miss its minimum, we say so while there is still time to do something about it.",
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="t-h1 mt-7 max-w-[20ch] text-ink">
          Someone has to run the merch. It shouldn&apos;t be you.
        </h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="t-body-lg text-ink-muted">
              Every merch run on a campus works the same way. One person — a club
              secretary, a fest head, someone in HR — ends up holding a Google
              Form, a spreadsheet, a UPI ID and a WhatsApp group. They collect
              money they are not equipped to collect, for an event that is not
              theirs, and they carry the risk personally if the numbers are
              wrong.
            </p>
            <p className="t-body-lg text-ink-muted">
              Then they hand the vendor a spreadsheet that is usually wrong, and
              the vendor eats the reprints.
            </p>
            <p className="t-body-lg text-ink-muted">
              The Merch HQ removes that half entirely. We host the store, collect
              the orders and the money, and hand the organiser a live view of
              what has been bought. They share one link. That is the whole job.
            </p>
          </div>

          <div className="rounded-xl bg-surface-sunken p-8">
            <h2 className="t-h4 text-ink">What we make</h2>
            <p className="t-body-sm mt-3 text-ink-muted">
              Apparel, headwear, bags, drinkware and paper goods, produced to
              order against a campaign. Nothing is held in stock, so nothing is
              ever sold out — a size is either offered on a campaign or it
              isn&apos;t.
            </p>
            <h2 className="t-h4 mt-8 text-ink">Where we are</h2>
            <p className="t-body-sm mt-3 text-ink-muted">
              Bengaluru for the studio and the storefronts, Tiruppur for
              production.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 sm:pb-24">
        <h2 className="t-h2 text-ink">How we work</h2>
        <dl className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <dt className="t-h4 text-ink">{p.title}</dt>
              <dd className="t-body mt-3 max-w-[58ch] text-ink-muted">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBlock />
    </main>
  );
}
