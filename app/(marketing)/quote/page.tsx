import type { Metadata } from "next";
import { Icon } from "@/components/brand/Icon";
import { QuoteForm } from "./QuoteForm";

export const metadata: Metadata = {
  title: "Request a quote — The Merch HQ",
  description:
    "Tell us the headcount and the date. We come back with a per-unit price and a delivery date you can hold us to.",
};

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
    <main className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
      <h1 className="t-h1 mt-7 max-w-[20ch] text-ink">
        Tell us the date and the headcount
      </h1>
      <p className="t-body-lg mt-4 max-w-[62ch] text-ink-muted">
        Everything below takes about two minutes. No call is needed unless you
        want one.
      </p>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_340px]">
        <QuoteForm />

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-surface-sunken p-6">
            <h2 className="t-h4 text-ink">What happens next</h2>
            <ul className="mt-6 space-y-6">
              {WHAT_HAPPENS.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <span className="mt-[2px] shrink-0 text-accent">
                    <Icon name={w.icon} size={20} />
                  </span>
                  <span>
                    <span className="t-body-sm block font-medium text-ink">
                      {w.title}
                    </span>
                    <span className="t-body-sm block text-ink-muted">
                      {w.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="t-body-sm mt-6 text-ink-muted">
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
