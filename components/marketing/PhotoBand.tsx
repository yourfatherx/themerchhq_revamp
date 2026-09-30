import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * A photograph one viewport tall, with its caption set straight onto the frame.
 *
 * The caption used to ride down the photograph on a solid card. The card is
 * gone: the layout reference sets these captions directly on the picture, and
 * the card was reading as a sticker pasted over the image rather than part of
 * it.
 *
 * Losing the card loses the contrast guarantee the card gave for free, so the
 * band earns it back the way the home hero does — by construction, not by
 * measuring one photograph. A scrim runs from the corner the caption sits in,
 * and it does not fall below 66% ink anywhere the caption can reach. 66% ink
 * holds white type at 6.02:1 even over a pure-white frame — the same
 * construction as the hero's 62% at 5.22:1 — so the guarantee survives someone
 * swapping in a brighter picture later. Past the caption the
 * scrim clears to nothing, which is what keeps these looking like photographs
 * instead of grey rectangles.
 *
 * The stops are in pixels, not percentages, because the caption is a fixed
 * column: a percentage stop that clears the text at 1440px sits underneath it
 * at 1024px.
 *
 * That floor is also why the caption no longer sticks. While it rode down the
 * frame it could end up anywhere in it, so the only safe scrim was a flat one
 * over the whole picture. Anchored at the top, the scrim can be directional and
 * three-quarters of the photograph stays clean. The reference does not stick
 * these either.
 *
 * `half` bands are laid out in pairs by the caller: side by side at desktop,
 * stacked below it. It changes the `sizes` hint and nothing else — the caption
 * is the same width in a half band as in a full one, so the scrim is too.
 *
 * `href`/`cta` are optional together. A band that narrates a step — one of four
 * in a sequence — is explaining, not asking, and four buttons down one page is
 * the repetition we take out of pages rather than add to them. Pass both to get
 * a link, neither to get a plain caption; passing one without the other is a
 * type error rather than a silently missing control.
 *
 * `emphasis` marks the band that is the ask rather than a step in the argument,
 * normally the closing band of a page. It fills the pill instead of outlining
 * it. That is the whole distinction now: with no card there is no ground to
 * change, and the reference gives every band the same treatment.
 */

type PhotoBandProps = {
  src: string;
  alt: string;
  title: string;
  body?: string;
  /** The closing ask, rather than a step: a filled pill instead of an outline. */
  emphasis?: boolean;
  half?: boolean;
  /** CSS object-position, to keep a subject in frame on narrow screens. */
  position?: string;
} & ({ href: string; cta: string } | { href?: never; cta?: never });

/**
 * Stops in px, measured from the top-left corner the caption is anchored to.
 * `hold` is where the floor ends and the scrim may start clearing; it must sit
 * past the far edge of the caption. `clear` is where it reaches nothing.
 */
const SCRIM = {
  /** Stacked: the caption spans the width, so the scrim has to fall away
   *  downward instead. The tallest caption in the site measures 183px at
   *  390px wide; holding to 260 leaves room for roughly three more lines of
   *  body copy before anything needs revisiting. */
  mobile: { hold: 260, clear: 460 },
  /** Side by side: the caption column is 40px of padding plus a 380px measure,
   *  so it cannot reach past 420px however wide the frame is. Half bands use
   *  the same stops for that reason — the caption is the same size in both, so
   *  widening the scrim for them only veiled a photograph nobody was writing
   *  over. */
  desktop: { hold: 470, clear: 820 },
} as const;

function scrim(direction: string, { hold, clear }: { hold: number; clear: number }) {
  return (
    `linear-gradient(${direction}, ` +
    `color-mix(in srgb, var(--color-ink) 76%, transparent) 0px, ` +
    `color-mix(in srgb, var(--color-ink) 66%, transparent) ${hold}px, ` +
    `transparent ${clear}px)`
  );
}

export function PhotoBand({
  src,
  alt,
  title,
  body,
  href,
  cta,
  emphasis = false,
  half = false,
  position = "center",
}: PhotoBandProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-ink",
        "h-[85svh] min-h-[520px] lg:h-[100svh] lg:min-h-[640px]",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={half ? "(min-width: 1024px) 50vw, 100vw" : "100vw"}
        className="-z-20 object-cover"
        style={{ objectPosition: position }}
      />

      {/* The gradients are handed over as custom properties because an inline
          style cannot carry a media query, and the two differ by breakpoint. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[image:var(--scrim-sm)] lg:bg-[image:var(--scrim-lg)]"
        style={
          {
            "--scrim-sm": scrim("to bottom", SCRIM.mobile),
            // The horizontal scrim only makes sense once the caption stops
            // spanning the frame, which is where `half` pairs up as well.
            "--scrim-lg": scrim("to right", SCRIM.desktop),
          } as React.CSSProperties
        }
      />

      <div className="absolute inset-0 flex p-4 sm:p-10">
        <div className="max-w-[380px] self-start text-surface">
          <h2 className="text-[24px] leading-[1.15] font-medium tracking-[-0.04em]">
            {title}
          </h2>
          {body ? (
            <p className="mt-2 text-[15px] leading-[1.45] tracking-[-0.01em]">
              {body}
            </p>
          ) : null}
          {href && cta ? (
            <Link
              href={href}
              className={cn(
                "mt-5 inline-flex h-10 items-center rounded-full border px-5 text-[14px] font-medium no-underline transition-colors duration-150 ease-brand hover:no-underline",
                emphasis
                  ? "border-surface bg-surface text-ink hover:bg-surface-sunken hover:text-ink focus-visible:bg-surface-sunken focus-visible:text-ink"
                  : "border-white/85 text-surface hover:bg-surface hover:text-ink focus-visible:bg-surface focus-visible:text-ink",
              )}
            >
              {cta}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
