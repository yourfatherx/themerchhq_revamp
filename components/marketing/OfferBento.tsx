import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Chip, Eyebrow, Slab } from "./Bits";

/**
 * The reference's three-column block: a column of copy with an accordion under
 * it, a quiet card of prose, and an image card with a panel floating over its
 * lower edge and a tag pinned to its top corner.
 *
 * The widths are deliberately unequal (4 / 3 / 5 of twelve) and each column is
 * a different *kind* of thing — that combination is what stops a three-up row
 * reading as three of the same card.
 *
 * The accordion is a real `details`, so it opens without JavaScript, keeps
 * keyboard behaviour for free, and the first one ships open the way the
 * reference shows it.
 */

const FAQ = [
  {
    q: "Your own subdomain",
    a: "club.themerchhq.in, your logo, your accent colour. Live in five working days from the quote, and it closes on the date you set.",
    open: true,
  },
  {
    q: "A print-ready size table",
    a: "Every order carries the size the buyer picked. At close it is a table, not a thread of corrections.",
  },
];

export function OfferBento() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <Slab>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-5">
          {/* Copy + accordion */}
          <div className="lg:col-span-4">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="t-h2 mt-4 max-w-[14ch] text-ink">
              The organiser&apos;s half, removed.
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>Storefront</Chip>
              <Chip>Size breakdown</Chip>
            </div>

            <div className="mt-8">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  open={f.open}
                  className="group border-t border-hairline py-4 last:border-b"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink marker:hidden">
                    <span className="t-body font-medium">{f.q}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-6 shrink-0 place-items-center rounded-full border border-hairline text-ink-muted"
                    >
                      <span className="block group-open:hidden">+</span>
                      <span className="hidden group-open:block">−</span>
                    </span>
                  </summary>
                  <p className="t-body-sm mt-3 max-w-[34ch] text-ink-muted">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Quiet prose card */}
          <div className="flex flex-col rounded-lg bg-canvas p-6 lg:col-span-3">
            <Eyebrow>Since 2021</Eyebrow>
            <p className="t-body-sm mt-4 text-ink-muted">
              We print in-house on 320 GSM blanks, so the thing that arrives is
              the thing you approved — not a substitute the supplier had in
              stock that week.
            </p>
            <h3 className="t-h3 mt-auto pt-10 max-w-[12ch] text-ink">
              Made, not sourced.
            </h3>
            <div className="mt-5">
              <ButtonLink href="/catalogue" size="sm">
                See the catalogue
              </ButtonLink>
            </div>
          </div>

          {/* Image card with floating panel */}
          <div className="relative min-h-[420px] overflow-hidden rounded-lg lg:col-span-5">
            <Image
              src="/studio/s3.jpg"
              alt="A campaign being packed in the studio"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />

            <div className="absolute top-4 right-4">
              <Chip tone="accent">Closes in 9d</Chip>
            </div>

            <div className="absolute inset-x-4 bottom-4 rounded-lg bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-caption">music-club.themerchhq.in</p>
                  <p className="t-h4 mt-1 text-ink">Hostel Night 2026</p>
                </div>
                <Chip tone="solid">Live</Chip>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-hairline pt-4">
                <div>
                  <p className="figure text-[28px] leading-none font-semibold text-ink">
                    171
                  </p>
                  <p className="t-caption mt-1">units ordered</p>
                </div>
                <div className="text-right">
                  <p className="figure text-[28px] leading-none font-semibold text-accent">
                    ₹899
                  </p>
                  <p className="t-caption mt-1">per unit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slab>
    </section>
  );
}
