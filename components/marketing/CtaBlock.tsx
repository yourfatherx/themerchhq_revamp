import { ButtonLink } from "@/components/ui/ButtonLink";
import { Chip, RoundLink } from "./Bits";

/**
 * The closing block — an ink slab, then the wordmark, as the reference closes.
 *
 * It was Resolution Blue and centred. With the chrome monochrome, a blue panel
 * at the foot is the only coloured thing on the page and pulls harder than the
 * product does. Ink closes the page the way the reference's does: the value
 * changes, the geometry does not.
 *
 * Left-aligned, because the two sentences above the buttons are read, not
 * scanned, and centred body copy costs a reader the left margin they were
 * tracking down the rest of the page.
 *
 * The rings are the one decorative thing on the page, and they are decoration
 * rather than a second message: concentric circles of white at a few percent
 * each, stacking where they overlap so the steps read as bands. They are value,
 * not hue.
 *
 * They are centred on the slab's right edge and sized `w-full`, so the visible
 * half always covers exactly the right 50% at any width, and the bright middle
 * stays clipped. The copy crosses them, which was measured rather than assumed:
 * over the full six-ring stack the ground composites to `rgb(59 58 69)`, leaving
 * the white headline at 11.19:1 and the `white/75` paragraph at 7.11:1 — both
 * clear of the 4.5:1 floor. That floor is what caps these opacities.
 *
 * The wordmark repeats the hero's, in ink and cropped by the page edge. The
 * reference opens and closes on the same mark; repeating it is what makes it
 * read as a signature rather than a header.
 */

const RINGS: [r: number, opacity: number][] = [
  [150, 0.022],
  [122, 0.025],
  [96, 0.028],
  [72, 0.032],
  [50, 0.036],
  [30, 0.042],
];

export function CtaBlock() {
  return (
    <section className="mx-auto max-w-[1280px] overflow-hidden px-5 pt-6 sm:px-8">
      <div className="relative overflow-hidden rounded-xl bg-ink px-6 py-16 sm:px-12 sm:py-20">
        <svg
          aria-hidden="true"
          viewBox="0 0 320 320"
          className="pointer-events-none absolute top-1/2 right-0 hidden aspect-square w-full -translate-y-1/2 translate-x-1/2 sm:block"
        >
          {RINGS.map(([r, opacity]) => (
            <circle
              key={r}
              cx="160"
              cy="160"
              r={r}
              fill="#fff"
              fillOpacity={opacity}
            />
          ))}
        </svg>

        <div className="relative">
          <h2 className="t-h1 max-w-[20ch] text-surface">
            Tell us the date and the headcount.
          </h2>
          <p className="t-body-lg mt-5 max-w-[54ch] text-white/75">
            We come back with a quote, a per-unit price and a delivery date you
            can hold us to. No call required.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Chip tone="dark" className="border border-white/15">
              Quote in one working day
            </Chip>
            <Chip tone="dark" className="border border-white/15">
              40–2,000 units
            </Chip>
            <Chip tone="dark" className="border border-white/15">
              GST invoice
            </Chip>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/quote" size="lg" onDark>
              Request a quote
            </ButtonLink>
            <ButtonLink href="/catalogue" size="lg" onDark variant="secondary">
              See the catalogue
            </ButtonLink>
            <RoundLink href="/how-it-works" label="How it works" />
          </div>
        </div>
      </div>

      {/* Set whole rather than cropped, unlike the hero's: the site footer
          starts immediately under this one, so a crop here reads as the footer
          clipping the mark by accident rather than as a deliberate bleed. */}
      <p
        aria-hidden="true"
        className="mt-8 w-full text-center leading-[0.82] font-bold tracking-[-0.045em] text-ink"
        style={{ fontSize: "13.2vw" }}
      >
        The Merch HQ
      </p>
    </section>
  );
}
