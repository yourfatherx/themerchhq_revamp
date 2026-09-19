import type { ButtonHTMLAttributes } from "react";
import { Icon } from "@/components/brand/Icon";
import type { IconName } from "@/components/brand/icons";
import { cn } from "@/lib/cn";

/**
 * 44×44 hit target, radius md, an authored 24px glyph, and always an
 * `aria-label` — the glyph carries no text, so the label is the only name the
 * control has. `label` is required for that reason.
 *
 * The `circular` shape is the Pill primitive at full radius: carousels, hero
 * plates, "next step" affordances.
 */

type Shape = "ghost" | "circular" | "circularOutline";

const SHAPES: Record<Shape, string> = {
  ghost: cn(
    "size-11 rounded-md bg-transparent text-ink", // 44×44
    "enabled:hover:bg-surface-hover enabled:hover:text-accent-deep",
    "enabled:active:bg-surface-pressed enabled:active:text-accent-deep",
    "disabled:text-tint",
  ),
  circular: cn(
    "size-14 rounded-full bg-accent text-surface", // 56×56
    "enabled:hover:bg-accent-deep",
    "enabled:active:bg-brand-pressed",
    "disabled:bg-tint disabled:text-rule",
  ),
  circularOutline: cn(
    "size-14 rounded-full border border-hairline bg-surface text-ink",
    "enabled:hover:border-accent enabled:hover:bg-surface-hover enabled:hover:text-accent-deep",
    "enabled:active:bg-surface-pressed",
    "disabled:border-hairline disabled:text-rule",
  ),
};

export type IconButtonProps = {
  icon: IconName;
  /** The accessible name. Required — a glyph alone names nothing. */
  label: string;
  shape?: Shape;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "aria-label">;

export function IconButton({
  icon,
  label,
  shape = "ghost",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "grid place-items-center transition-all duration-150 ease-brand",
        "disabled:cursor-not-allowed",
        SHAPES[shape],
      )}
      {...rest}
    >
      <Icon name={icon} size={24} />
    </button>
  );
}
