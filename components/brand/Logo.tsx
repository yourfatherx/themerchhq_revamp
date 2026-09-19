import Image from "next/image";

/**
 * The lockup ships from the shared folder and is never rebuilt, never
 * re-typeset, never re-spaced. This component only ever places existing
 * artwork — it must not be extended to draw the wordmark in Archivo.
 *
 * Clear space is 1X on all four sides, where X is the wordmark's cap height,
 * measured from the outermost edge of the artwork. No type, no client logo and
 * no photo edge enters it. That is a layout responsibility of the caller; this
 * component does not add padding of its own.
 *
 * The logo is never placed on a photograph — on imagery it sits on a solid blue
 * or white block, never straight on the picture and never on a blurred panel.
 */

type Variant = "stacked" | "horizontal" | "mark" | "wordmark";

/**
 * Three colourways, and no others:
 *  - `blue`  on white or Lavender Gray
 *  - `white` on New Car, Resolution Blue or Chinese Black
 *  - `black` for single-colour print where blue isn't available
 *
 * Plus two single-colour artworks for specific grounds:
 *  - `deep`  Resolution Blue — the only artwork permitted on Lavender Gray
 *  - `ink`   Chinese Black, for single-colour dark-on-light documents
 *
 * Only the combinations below exist as files, so asking for one that doesn't is
 * a type error rather than a 404.
 */
type TonesFor = {
  stacked: "blue" | "white" | "black" | "ink";
  horizontal: "blue" | "white" | "black";
  mark: "blue" | "white" | "black" | "deep" | "ink";
  wordmark: "blue" | "white" | "black";
};

/** Intrinsic artwork dimensions, and the minimum width the brand book permits
 *  on screen. Below these the dot eyes close up and the face fills in. */
const ART = {
  stacked: { file: "lockup", w: 727, h: 592, minWidth: 96 },
  horizontal: { file: "horizontal", w: 1062, h: 198, minWidth: 140 },
  mark: { file: "mark", w: 727, h: 491, minWidth: 32 },
  wordmark: { file: "wordmark", w: 722, h: 76, minWidth: 120 },
} as const satisfies Record<
  Variant,
  { file: string; w: number; h: number; minWidth: number }
>;

type LogoProps<V extends Variant> = {
  variant: V;
  tone: TonesFor[V];
  /** Rendered width in px. Height follows the artwork's ratio. */
  width: number;
  /** Empty when the logo is decorative or the name is already adjacent. */
  alt?: string;
  priority?: boolean;
  className?: string;
};

export function Logo<V extends Variant>({
  variant,
  tone,
  width,
  alt = "The Merch HQ",
  priority,
  className,
}: LogoProps<V>) {
  const art = ART[variant];

  if (process.env.NODE_ENV !== "production" && width < art.minWidth) {
    console.warn(
      `[brand] Logo "${variant}" is ${width}px wide; the minimum on screen is ` +
        `${art.minWidth}px. Below this the mark degrades — switch to the ` +
        `wordmark rather than shrinking it further.`,
    );
  }

  return (
    <Image
      src={`/brand/logo-${art.file}-${tone}.png`}
      alt={alt}
      width={width}
      height={Math.round((width * art.h) / art.w)}
      priority={priority}
      className={className}
    />
  );
}
