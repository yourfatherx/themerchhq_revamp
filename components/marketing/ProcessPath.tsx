import { cn } from "@/lib/cn";

/**
 * Four steps, numbered.
 *
 * The numbering is earned: this content genuinely is a sequence, and step three
 * cannot happen before step two. The tilt, the dashed connector and the pinned
 * dots that used to carry it were not — they decorated a list that was already
 * ordered, and a rotated card is harder to read than a straight one for no gain
 * a reader receives.
 *
 * What replaced them is the thing the sequence actually turns on: who does the
 * work. Only one of the four steps is the organiser's, and putting that in the
 * left column of every row is the argument the section exists to make.
 */

const STEPS = [
  {
    n: "01",
    title: "Tell us what you want",
    body: "Headcount, occasion, budget, and the date it has to exist by. One form, no call needed.",
    who: "You",
  },
  {
    n: "02",
    title: "We build the storefront",
    body: "Products, prices, size charts and your branding, on your own subdomain.",
    who: "Us",
  },
  {
    n: "03",
    title: "Share one link",
    body: "Your batch orders and pays on it. You watch the size breakdown fill up.",
    who: "You",
  },
  {
    n: "04",
    title: "We print and hand over",
    body: "Production starts at close. Delivered to one person with a collection list.",
    who: "Us",
  },
] as const;

export function ProcessPath() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <h2 className="t-h1 max-w-[16ch] text-ink">
          Four steps, and only one is yours.
        </h2>
        <p className="t-body-lg max-w-[54ch] text-ink-muted">
          You tell us what you want and share one link. We do the rest — the
          design, the storefront, the money, the printing and the handover.
        </p>
      </div>

      <ol className="mt-16 border-t border-hairline">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 border-b border-hairline py-7 sm:grid-cols-[3rem_5rem_1fr] sm:gap-x-8 sm:py-8"
          >
            <span className="figure t-h3 text-ink-muted">{s.n}</span>

            <span
              className={cn(
                "order-3 text-[13px] font-semibold sm:order-none",
                // The whole point of the column: two of these say "You".
                s.who === "You" ? "text-accent" : "text-ink-muted",
              )}
            >
              {s.who}
            </span>

            <div className="col-start-2 sm:col-start-3">
              <h3 className="t-h4 text-ink">{s.title}</h3>
              <p className="t-body-sm mt-1.5 max-w-[62ch] text-ink-muted">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
