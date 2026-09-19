import type { Metadata } from "next";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { ProcessPath } from "@/components/marketing/ProcessPath";
import { Alert } from "@/components/ui/Alert";

export const metadata: Metadata = {
  title: "How it works — The Merch HQ",
  description:
    "You tell us what you want and share one link. We do the design, the storefront, the money, the printing and the handover.",
};

const FAQ = [
  {
    q: "Who collects the money?",
    a: "We do. Buyers pay us directly by UPI, card or netbanking. Nothing goes through your personal account, so you are not reconciling payments or carrying the float for an event that isn't yours.",
  },
  {
    q: "What is a minimum order quantity?",
    a: "The number of units a campaign needs before it prints. Under it, the campaign either extends or refunds everyone in full — it never prints at a loss and never quietly ships fewer. The policy is set before the storefront opens and published on it.",
  },
  {
    q: "What if someone orders the wrong size?",
    a: "They fix it themselves. Every buyer can change the size on their order for 24 hours after paying, or until the storefront closes, whichever comes first. You are not the person collecting corrections.",
  },
  {
    q: "What do I get at the end?",
    a: "A size breakdown as a table — item by size by quantity — plus the full order list and a collection list with names and identifiers. That is what goes to the printer and what the handover desk works from.",
  },
  {
    q: "How long does it take?",
    a: "Five working days from quote to a live storefront. Production starts the day the storefront closes. The delivery date is on the quote before you commit.",
  },
  {
    q: "Can we use our own design?",
    a: "Yes. Send artwork and we print it, or tell us roughly what you want and we design it. Either way you approve a sample before the run.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1280px] px-5 pt-14 pb-4 sm:px-8 sm:pt-20">
        <h1 className="t-h1 mt-7 max-w-[18ch] text-ink">
          You share one link. We do the rest.
        </h1>
        <p className="t-body-lg mt-4 max-w-[64ch] text-ink-muted">
          The organiser&apos;s half of a merch run is the part nobody signed up
          for: the form, the spreadsheet, the UPI requests, the WhatsApp group
          full of people asking where their hoodie is. That half is what we take.
        </p>
      </section>

      <ProcessPath />

      <section className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 sm:pb-24">
        <h2 className="t-h2 text-ink">Questions we get first</h2>

        <dl className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt className="t-h4 text-ink">{f.q}</dt>
              <dd className="t-body mt-3 max-w-[62ch] text-ink-muted">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 max-w-[70ch]">
          <Alert
            tone="info"
            title="If a campaign misses its minimum, nobody loses money"
          >
            Every campaign carries a stated policy before it opens: extend the
            close date, or refund every order in full. It is published on the
            storefront, so buyers know the terms before they pay.
          </Alert>
        </div>
      </section>

      <CtaBlock />
    </main>
  );
}
