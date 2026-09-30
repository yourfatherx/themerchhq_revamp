/** WCAG 2.1 relative luminance and contrast ratio.
 *  Every ratio in the design system is measured against a stated ground, never
 *  estimated — this is the function that does the measuring. */

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * A translucent colour laid over an opaque one, as the browser composites it.
 *
 * Type set on photography cannot name the colour behind it, so the places that
 * do it guarantee a floor instead: a scrim that never thins past a stated
 * alpha. The worst frame a photograph can present is a pure white one, so
 * compositing the scrim over white gives the contrast the type is guaranteed
 * whatever the picture turns out to be.
 */
export function composite(fg: string, alpha: number, bg: string): string {
  const a = toRgb(fg);
  const b = toRgb(bg);
  const mix = a.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return `#${mix.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Contrast ratio between two opaque colours, 1–21. */
export function contrast(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Rounded to two places, the form the design system states ratios in. */
export function ratio(fg: string, bg: string): number {
  return Math.round(contrast(fg, bg) * 100) / 100;
}
