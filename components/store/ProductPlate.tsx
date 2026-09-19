import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The plate a product sits on. 4:5, radius lg, one flat grey.
 *
 * Photography, when it exists, is shot on this exact grey — so the plate and
 * the photograph's own ground are the same value and the garment appears to
 * float rather than sit inside a second box. That is why the image is
 * `object-contain` and not `object-cover`: contain never crops the garment,
 * and with the grounds matched there is no letterboxing to see.
 *
 * Until a run is photographed, the plate renders the garment's own colour with
 * the mark at low opacity. It reads as a deliberate colour-blocked tile rather
 * than a missing image, and it is honest — that really is the colour being
 * printed. Swapping in a photograph changes nothing else about the card.
 */

/**
 * Garment colours are stored as the names a supplier uses, not as hex. This is
 * the one place that vocabulary is resolved. Anything unrecognised falls back
 * to the plate grey, which is correct rather than merely safe: an unknown
 * colour should not be guessed at on a page where someone is choosing one.
 */
const GARMENT_TONES: Record<string, string> = {
  black: "#1a1a1a",
  charcoal: "#3a3a40",
  navy: "#1f2a44",
  "royal blue": "#1e40af",
  white: "#f4f4f6",
  "off white": "#eae7e0",
  natural: "#e2dac9",
  oatmeal: "#d8d2c6",
  sand: "#d9c9a8",
  grey: "#9a9aa0",
  gray: "#9a9aa0",
  "heather grey": "#b8b8be",
  maroon: "#5c1f2b",
  red: "#b3202e",
  olive: "#4f5340",
  "bottle green": "#1d4a36",
  forest: "#1d4a36",
};

export function garmentTone(colour: string | null | undefined): string | null {
  if (!colour) return null;
  return GARMENT_TONES[colour.trim().toLowerCase()] ?? null;
}

/**
 * Whether a plate's ground is dark enough that anything overlaid on it has to
 * flip to white. Exported because the card writes its corner facts onto the
 * plate and has to make the same decision this file does.
 *
 * A plate with a photograph on it is always the grey, never the garment colour,
 * so it is always light.
 */
export function isPlateDark(
  colour: string | null | undefined,
  hasPhoto: boolean,
): boolean {
  if (hasPhoto) return false;
  const tone = garmentTone(colour);
  return tone ? isDark(tone) : false;
}

/** A blank plate needs a light mark on a dark garment and a dark one on a
 *  light garment. Threshold is relative luminance, not lightness. */
function isDark(hex: string): boolean {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.4;
}

export function ProductPlate({
  src,
  alt,
  colour,
  className,
  priority,
  children,
}: {
  /** Omit until a real flat-lay exists for this product. */
  src?: string;
  alt: string;
  /** Garment colour name, e.g. "Navy". Grounds the plate when there is no photo. */
  colour?: string | null;
  className?: string;
  priority?: boolean;
  /** Corner facts, overlaid inside the plate and clipped by its radius. */
  children?: ReactNode;
}) {
  const tone = garmentTone(colour);

  return (
    <div
      className={cn(
        "relative aspect-4/5 overflow-hidden rounded-lg bg-plate",
        className,
      )}
      style={tone ? { backgroundColor: tone } : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <Image
            src={
              tone && isDark(tone)
                ? "/brand/logo-mark-white.png"
                : "/brand/logo-mark-deep.png"
            }
            alt=""
            width={727}
            height={491}
            aria-hidden="true"
            className={cn("w-[34%]", tone && isDark(tone) ? "opacity-20" : "opacity-10")}
          />
          <span className="sr-only">
            {alt} — photography pending from the first production run
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
