import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Chip, Eyebrow, RoundLink, Slab } from "./Bits";

export type Quote = {
  body: string;
  name: string;
  /** Role and organisation, e.g. "Cultural Secretary, Music Club". */
  role: string;
  /** The campaign it came from, e.g. "Hostel Night 2026 · 312 units". */
  campaign: string;
};

/**
 * Customer quotes, three across.
 *
 * The oversize quotation mark this replaced was decoration standing in for
 * evidence. The reference runs three short quotes with a name and an
 * organisation under each and no ornament at all, which is the more credible
 * form: what makes a quote worth reading is who said it.
 *
 * `quotes` is deliberately allowed to be empty and there is no placeholder
 * copy. Until a real campaign has run this renders what is actually true rather
 * than an invented endorsement — fabricated social proof is the one thing on a
 * marketing page that cannot be corrected later, because a reader who catches
 * it stops believing the delivery dates too.
 */
export function QuoteCards({ quotes = [] }: { quotes?: readonly Quote[] }) {
  if (quotes.length === 0) return <NoQuotesYet />;

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
      <h2 className="t-h1 max-w-[16ch] text-ink">The people who ran one.</h2>

      <div className="mt-12 grid gap-x-5 gap-y-10 md:grid-cols-3">
        {quotes.slice(0, 3).map((q) => (
          <figure
            key={q.name}
            className="flex flex-col rounded-lg border border-hairline bg-surface p-6"
          >
            <blockquote className="t-body-lg grow text-ink">
              {q.body}
            </blockquote>
            <figcaption className="mt-8 border-t border-hairline pt-5">
              <span className="t-body font-medium text-ink">{q.name}</span>
              <span className="t-body-sm block text-ink-muted">{q.role}</span>
              <span className="figure t-caption mt-2 block">{q.campaign}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/**
 * Set in the reference's testimonial shape — a heading with a label opposite,
 * a card on the left and a tall image card on the right carrying chips and a
 * price. What the reference fills with a customer quote, this fills with the
 * admission that there isn't one yet. The layout is borrowed; the endorsement
 * is not invented to fill it.
 */
function NoQuotesYet() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <Slab>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="t-h2 max-w-[18ch] text-ink">
            The first campaign is what goes here.
          </h2>
          <Eyebrow className="lg:pb-2">Not yet written</Eyebrow>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <div className="flex flex-col rounded-lg bg-canvas p-6 lg:col-span-5">
            <p className="t-body text-ink">
              We would rather show you one real run — the units, the sizes, the
              date it landed — than a quote we wrote ourselves. Until then the
              catalogue and the pricing are the whole offer, and both are on
              this site in full.
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
              <ButtonLink href="/quote">Be the first campaign</ButtonLink>
              <RoundLink href="/how-it-works" label="How it works" tone="surface" />
            </div>
          </div>

          <div className="relative min-h-[380px] overflow-hidden rounded-lg lg:col-span-7">
            <Image
              src="/studio/s4.jpg"
              alt="An order being boxed for dispatch"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
            />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Chip tone="solid">Heavyweight hoodie</Chip>
              <Chip tone="solid">320 GSM</Chip>
            </div>

            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <div>
                <p className="t-h2 text-surface">From ₹849</p>
                <p className="t-body-sm mt-1 text-white/80">
                  per unit at 500 · before GST
                </p>
              </div>
              <RoundLink href="/catalogue" label="See the catalogue" />
            </div>
          </div>
        </div>
      </Slab>
    </section>
  );
}
