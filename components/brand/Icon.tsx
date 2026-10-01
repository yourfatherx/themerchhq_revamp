import { ICONS, type IconName } from "./icons";

/** 16 inline with body-sm · 20 in buttons and inputs · 24 default and
 *  standalone · 32 in empty states and stat rows. */
export type IconSize = 16 | 20 | 24 | 32;

type IconProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
};

/**
 * A brand icon.
 *
 * Always `aria-hidden`: the rule is one icon per idea, always with a word
 * beside it, so the word carries the meaning and the glyph is decorative.
 *
 * Colour is `currentColor`, so an icon takes the accent from its container and
 * never carries state itself — state is carried by the label, not the glyph.
 *
 * Stroke width is scaled so the line holds the same optical weight at every
 * size. Lucide is drawn at 2 on a 24 grid; left alone, that same 2 is a third
 * of the glyph at 16px and reads as a smudge, while at 32 it looks underdrawn.
 */
const STROKE: Record<IconSize, number> = {
  16: 2.25,
  20: 2,
  24: 1.9,
  32: 1.7,
};

export function Icon({ name, size = 24, className }: IconProps) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      width={size}
      height={size}
      strokeWidth={STROKE[size]}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: "block" }}
    />
  );
}
