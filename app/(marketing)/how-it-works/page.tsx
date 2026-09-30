import type { Metadata } from "next";
import { FaqPanel } from "@/components/marketing/FaqPanel";
import { PhotoBand } from "@/components/marketing/PhotoBand";
import { Alert } from "@/components/ui/Alert";

export const metadata: Metadata = {
  title: "How it works — The Merch HQ",
  description:
    "You tell us what you want and share one link. We do the design, the storefront, the money, the printing and the handover.",
};

/**
 * MKT-3, in the storefront layout.
 *
 * The four steps were photographic plates carrying their numeral, title and
 * body directly on the photograph behind a 78% ink scrim. Type sits on a
 * photograph in the home hero and nowhere else, so this is a rebuild rather
 * than a restyle: each step is now a `PhotoBand`, which puts the same words on
 * a solid card and leaves the photograph to be a photograph.
 *
 * The section's argument — that only one step is the organiser's — is carried
 * by ground rather than by a label. Three cards are white; the one that is
 * actually yours is New Car. A reader counts the blue one without being told.
 *
 * Step 01 is ours. The organiser fills in a form; turning that into a spec, a
 * price and a date is our work, and the page's own headline says the thing they
 * do is share the link. The step data used to mark it as theirs, which
 * contradicted both the headline and the section heading above the bands.
 */

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
    <main className="bg-surface">
      <header className="px-4 pt-10 pb-6 sm:px-5 lg:pt-14">
        <h1 className="text-[clamp(32px,2.2vw+24px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
          You share one link,{" "}
          <em className="font-normal tracking-[-0.03em] normal-case">
            we do the rest.
          </em>
        </h1>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
          The organiser&apos;s half of a merch run is the part nobody signed up
          for: the form, the spreadsheet, the UPI requests, the WhatsApp group
          full of people asking where their hoodie is. That half is what we take.
        </p>
      </header>

      <section className="px-4 pt-6 pb-8 sm:px-5">
        <h2 className="max-w-[18ch] text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink">
          Four steps, and only one is yours.
        </h2>
        <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
          You tell us what you want and share one link. We do the rest — the
          design, the storefront, the money, the printing and the handover.
        </p>
      </section>

      {/* Paired by the caller, as `half` expects: side by side from lg, stacked
          below it. No link on a step band — it narrates, it does not ask. */}
      <div className="grid lg:grid-cols-2">
        <PhotoBand
          half
          src="/studio/brief.jpg"
          alt="An open notebook and pen beside a laptop on a café table"
          title="Tell us what you want"
          body="Headcount, occasion, budget, and the date it has to exist by. One form, no call needed."
        />
        <PhotoBand
          half
          src="/studio/storefront-build.jpg"
          alt="Hands at a laptop and drawing tablet, with colour swatch sheets and marker sketches beside them"
          title="We build the storefront"
          body="Products, prices, size charts and your branding, on your own subdomain."
        />
      </div>

      <div className="grid lg:grid-cols-2">
        {/* The one step that is actually the organiser's. */}
        <PhotoBand
          half
          tone="brand"
          src="/studio/share-link.jpg"
          alt="A person in a white shirt tapping on a phone"
          title="Share one link"
          body="Your batch orders and pays on it. You watch the size breakdown fill up."
        />
        <PhotoBand
          half
          src="/studio/print-press.jpg"
          alt="A screen printing carousel on the shop floor"
          title="We print and hand over"
          body="Production starts at close. Delivered to one person with a collection list."
        />
      </div>

      <FaqPanel items={FAQ} />

      <section className="px-4 pb-14 sm:px-5 lg:pb-20">
        <div className="max-w-[70ch]">
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

      <PhotoBand
        tone="brand"
        src="/studio/packing-bench.jpg"
        alt="An order being boxed and tied at the packing bench"
        title="Tell us the date and the headcount"
        body="We come back with a quote, a per-unit price and a delivery date you can hold us to. No call required."
        href="/quote"
        cta="Request a quote"
      />
    </main>
  );
}
