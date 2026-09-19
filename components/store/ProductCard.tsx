import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatINR, type Paise } from "@/lib/money";
import { garmentTone, isPlateDark, ProductPlate } from "./ProductPlate";

/**
 * The product card is not a box.
 *
 * It has no border, no background, no padding and no shadow — it is a plate
 * with two lines of text beneath it. A grid of these reads as a grid of
 * products; a grid of bordered white rectangles reads as a grid of cards that
 * happen to contain products, which is the wrong subject.
 *
 * The two facts a buyer needs before clicking — the minimum and the lead time —
 * are set into the plate's own bottom corners rather than added as a row below
 * it. That costs no vertical space and keeps the text beneath the plate down to
 * the only two things that differ between one card and the next: what it is and
 * what it costs.
 */
export function ProductCard({
  href,
  name,
  price,
  was,
  imageSrc,
  colour,
  facts = [],
  colours = [],
  unavailable = false,
  priority,
}: {
  href: string;
  name: string;
  price: Paise;
  was?: Paise;
  imageSrc?: string;
  /** Garment colour name — grounds the plate until photography exists. */
  colour?: string | null;
  /** Up to two short facts, e.g. ["40 minimum", "11 days"]. */
  facts?: readonly string[];
  /** Colour names offered, for the swatch row. */
  colours?: readonly string[];
  unavailable?: boolean;
  priority?: boolean;
}) {
  const dark = isPlateDark(colour, Boolean(imageSrc));
  const overlay = dark ? "text-white/75" : "text-ink-muted";

  return (
    <Link
      href={href}
      aria-disabled={unavailable || undefined}
      className={cn(
        "group block no-underline hover:no-underline",
        unavailable && "opacity-60",
      )}
    >
      <ProductPlate
        src={imageSrc}
        alt={name}
        colour={colour}
        priority={priority}
        // The only hover the card has. No lift, no shadow, no border change —
        // the image itself answers, which is what a catalogue of photographs
        // should do.
        className="transition-[scale] duration-200 ease-brand group-hover:scale-[1.012]"
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5">
          {/* 12px, not the reference's 11px, and Ink Gray rather than its
              #86868B — that pairing measures 3.3:1 and fails the floor the
              token test enforces. Position and role are the reference's; the
              contrast is ours. */}
          <span
            className={cn(
              "flex flex-col gap-px text-[12px] leading-[1.35]",
              overlay,
            )}
          >
            {facts.slice(0, 2).map((f) => (
              <span key={f}>{f}</span>
            ))}
          </span>

          {colours.length > 0 ? (
            <Swatches colours={colours} dark={dark} />
          ) : null}
        </div>
      </ProductPlate>

      <h3 className="t-h4 mt-3 text-ink">{name}</h3>
      <p className="figure mt-1 text-[15px] leading-[1.2] text-ink-muted">
        From <span className="text-ink">{formatINR(price)}</span>
        {was ? (
          <span className="ml-2 line-through">{formatINR(was)}</span>
        ) : null}
      </p>
    </Link>
  );
}

/**
 * Four dots and a count. Showing every colour turns the plate corner into a
 * second control; the count says how much more there is without pretending the
 * card is where you choose.
 */
function Swatches({
  colours,
  dark,
}: {
  colours: readonly string[];
  dark: boolean;
}) {
  const shown = colours.slice(0, 4);
  const rest = colours.length - shown.length;

  return (
    <span className="flex items-center gap-[5px]">
      {shown.map((c) => (
        <span
          key={c}
          title={c}
          className={cn(
            "size-[13px] rounded-full",
            // The ring is what makes a white swatch visible on a light plate.
            dark ? "ring-1 ring-white/40" : "ring-1 ring-black/15",
          )}
          style={{ backgroundColor: garmentTone(c) ?? "var(--color-tint)" }}
        />
      ))}
      {rest > 0 ? (
        <span
          className={cn(
            "figure ml-px text-[12px] leading-none",
            dark ? "text-white/75" : "text-ink-muted",
          )}
        >
          +{rest}
        </span>
      ) : null}
    </span>
  );
}
