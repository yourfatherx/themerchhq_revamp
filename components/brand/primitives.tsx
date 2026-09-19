import type { ReactNode } from "react";

/**
 * Four primitives, taken off the mark. Nothing in the system may be finer than
 * the Dot — it is the smallest permitted detail anywhere, print or screen.
 *
 * Dome  — the gorilla's back. Crops, panel tops, sticker shapes, photo masks.
 * Pill  — the face. Labels, status chips, price tags, garment care patches.
 * Dot   — the eyes.
 * Cut   — the leg gaps. Negative space removes material; it is never a white
 *         shape laid on top.
 */

const SHAPES = {
  dome: '<path d="M4 96V50a46 46 0 0 1 92 0v46z"/>',
  pill: '<rect x="2" y="26" width="96" height="48" rx="24"/>',
  dot: '<circle cx="34" cy="50" r="15"/><circle cx="72" cy="50" r="15"/>',
  cut: '<path d="M4 96V50a46 46 0 0 1 92 0v46H72c0-14-4-24-10-30-6 6-10 16-10 30H28c0-14-4-24-10-30-4 4-6 12-6 30z"/>',
} as const;

export type PrimitiveName = keyof typeof SHAPES;

/** The primitive rendered as flat artwork, for specimen and decorative use. */
export function Primitive({
  name,
  size = 104,
  className,
}: {
  name: PrimitiveName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
      dangerouslySetInnerHTML={{ __html: SHAPES[name] }}
    />
  );
}

/**
 * The Pill primitive as an eyebrow or label.
 *
 * Text is Inter 600 at 13px, uppercase, +0.10em. The outlined form uses a
 * Lavender Gray hairline because it is decorative; interactive boundaries are
 * Slate Gray and belong to controls, not to labels.
 */
export function Pill({
  children,
  tone = "outline",
  className = "",
}: {
  children: ReactNode;
  /** `outline` on white · `solid` on a tinted band · `inverse` on a dark ground */
  tone?: "outline" | "solid" | "inverse";
  className?: string;
}) {
  const tones = {
    outline: "text-brand-deep border border-hairline",
    solid: "text-brand-deep bg-accent-tint",
    inverse: "text-surface border border-white/30",
  } as const;

  return (
    <span
      className={`t-label inline-block whitespace-nowrap rounded-full px-4 py-[9px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The Dot primitive as a marker — the pin on a process connector, a step
 * indicator, a list bullet. Never smaller than 6px: nothing may be finer.
 */
export function Dot({
  size = 10,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full bg-current ${className}`}
      style={{ width: Math.max(size, 6), height: Math.max(size, 6) }}
    />
  );
}

/**
 * The Dome primitive as a container — a panel top, an image crop, a photo mask.
 * The dome runs across the top edge; the bottom stays square so it can sit flush
 * against what follows.
 */
export function Dome({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-t-full ${className}`}
      style={{ borderTopLeftRadius: "50% 28%", borderTopRightRadius: "50% 28%" }}
    >
      {children}
    </div>
  );
}
