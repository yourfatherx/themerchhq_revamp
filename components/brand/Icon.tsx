import { useId } from "react";
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
 * An authored brand icon.
 *
 * Always `aria-hidden`: the rule is one icon per idea, always with a word
 * beside it, so the word carries the meaning and the glyph is decorative.
 *
 * Fill is `currentColor`, so an icon takes the accent from its container and
 * never carries state itself — state is carried by the label, not the glyph.
 */
export function Icon({ name, size = 24, className }: IconProps) {
  const def = ICONS[name];
  const cut = "cut" in def ? def.cut : undefined;
  const maskId = `mhqi-${useId()}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    >
      {cut ? (
        <>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#FFFFFF" />
            <g fill="#000000" dangerouslySetInnerHTML={{ __html: cut }} />
          </mask>
          <g
            mask={`url(#${maskId})`}
            dangerouslySetInnerHTML={{ __html: def.base }}
          />
        </>
      ) : (
        <g dangerouslySetInnerHTML={{ __html: def.base }} />
      )}
    </svg>
  );
}
