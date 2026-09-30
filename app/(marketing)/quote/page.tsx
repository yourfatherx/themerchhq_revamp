import type { Metadata } from "next";
import { Icon } from "@/components/brand/Icon";
import { QuoteForm } from "./QuoteForm";

export const metadata: Metadata = {
  title: "Request a quote — The Merch HQ",
  description:
    "Tell us the headcount and the date. We come back with a per-unit price and a delivery date you can hold us to.",
};

/**
 * MKT-6, restyled into the storefront layout.
 *
 * The shell only: `QuoteForm` and the server action behind it are untouched.
 * This page changes its gutter, its type scale and the aside's ground, and
 * nothing that decides what a submitted quote contains.
 *
 * No closing band here, unlike the other marketing pages. Every one of them
 * ends by pointing at this page; a band on this page pointing at this page is
 * a loop, and the form is already the ask.
 */

const WHAT_HAPPENS = [
  {
    icon: "clock",
    title: "One working day",
    body: "A real person reads this and replies with a price, not an automated acknowledgement.",
  },
  {
    icon: "payment",
    title: "A fixed per-unit price",
    body: "Quoted at your headcount, with the tier prices above and below it so you can see what moving the number does.",
  },
  {
    icon: "storefront",
    title: "Live in five working days",
    body: "If you want the storefront, it opens on your own subdomain with your logo and colour.",
  },
] as const;

export default function QuotePage() {
  return (
    <main className="bg-surface pb-16">
      <header className="px-4 pt-10 pb-8 sm:px-5 lg:pt-14">
        <h1 className="max-w-[20ch] text-[clamp(32px,2.2vw+24px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
          Tell us the date{" "}
          <em className="font-normal tracking-[-0.03em] normal-case">
            and the headcount.
          </em>
        </h1>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
          Everything below takes about two minutes. No call is needed unless you
          want one.
        </p>
      </header>

      <div className="grid gap-12 border-t border-hairline px-4 pt-10 sm:px-5 lg:grid-cols-[1fr_340px] lg:gap-14">
        <QuoteForm />

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-canvas p-6">
            <h2 className="text-[18px] leading-[1.25] font-medium tracking-[-0.03em] text-ink">
              What happens next
            </h2>
            <ul className="mt-5 space-y-5">
              {WHAT_HAPPENS.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <span className="mt-[3px] shrink-0 text-accent">
                    <Icon name={w.icon} size={20} />
                  </span>
                  <span>
                    <span className="block text-[14px] leading-[1.4] font-medium tracking-[-0.02em] text-ink">
                      {w.title}
                    </span>
                    <span className="mt-0.5 block text-[14px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
                      {w.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-[14px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
            Would rather talk?{" "}
            <a href="mailto:hello@themerchhq.in">hello@themerchhq.in</a> or{" "}
            <a href="tel:+918047182200" className="figure">
              +91 80 4718 2200
            </a>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}
