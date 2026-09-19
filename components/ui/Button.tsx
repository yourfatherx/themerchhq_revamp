import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

/**
 * Pill · height 36 / 48 / 56 · label Inter 600 · 150ms.
 *
 * `primary` is an ink fill, not a colour fill. On our own surfaces the chrome
 * is monochrome and colour arrives through the product, so a blue button would
 * be the loudest thing on a page it is not the subject of.
 *
 * `accent` is the coloured fill, and it reads `--color-accent` rather than
 * `--color-brand` — which is how one component serves both our blue and a
 * client's own. It is the storefront's order CTA: there, the client's colour is
 * the point, and the button is the subject of the page.
 *
 * Never below 36px. On the storefront — mobile-first by definition — the order
 * CTA is always `lg` and always `fullWidth`.
 */

type Variant = "primary" | "accent" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

/** Resting colours are kept apart from the disabled override so a *loading*
 *  button can be genuinely unclickable without also going grey. Loading keeps
 *  its resting fill and swaps the cursor — it is busy, not unavailable. */
type Palette = { base: string; disabled: string };

const BASE =
  "inline-flex items-center justify-center gap-[10px] rounded-full font-semibold " +
  "transition-colors duration-150 ease-brand";

// Side padding is generous relative to height — a pill needs the horizontal
// room or the label crowds its own curve.
const SIZES: Record<Size, string> = {
  sm: "h-9 px-5 text-[14px]", // 36 — the floor
  md: "h-12 px-7 text-[15px]", // 48 — default
  lg: "h-14 px-8 text-[16px]", // 56
};

/** On canvas. */
const VARIANTS: Record<Variant, Palette> = {
  primary: {
    base: cn(
      "bg-ink text-surface",
      "enabled:hover:bg-ink-hover",
      "enabled:active:bg-ink",
    ),
    disabled:
      "disabled:bg-surface-pressed disabled:text-rule disabled:cursor-not-allowed",
  },
  // The coloured fill. Ours on our surfaces, the client's on theirs.
  accent: {
    base: cn(
      "bg-accent text-surface",
      "enabled:hover:bg-accent-deep",
      "enabled:active:bg-accent-deep",
    ),
    disabled:
      "disabled:bg-surface-pressed disabled:text-rule disabled:cursor-not-allowed",
  },
  secondary: {
    base: cn(
      "border border-hairline bg-surface text-ink",
      "enabled:hover:border-hairline-strong enabled:hover:bg-surface-hover",
      "enabled:active:bg-surface-pressed",
    ),
    disabled:
      "disabled:border-hairline disabled:text-rule disabled:cursor-not-allowed",
  },
  // Ghost has no resting boundary — it needs a solid button beside it to read
  // as a control.
  ghost: {
    base: cn(
      "bg-transparent text-ink",
      "enabled:hover:bg-surface-hover",
      "enabled:active:bg-surface-pressed",
    ),
    disabled: "disabled:text-rule disabled:cursor-not-allowed",
  },
  // Ops-only. A buyer never sees one. The focus ring turns red so it never
  // promises a safe action.
  destructive: {
    base: cn(
      "bg-state-danger text-surface",
      "enabled:hover:bg-state-danger-hover",
      "enabled:active:bg-state-danger-pressed",
      "focus-visible:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-state-danger)]",
    ),
    disabled: "disabled:bg-tint disabled:text-rule disabled:cursor-not-allowed",
  },
};

/**
 * On a Chinese Black band or a Resolution Blue panel. An ink fill is invisible
 * on an ink ground, so `primary` inverts to a white fill; its label takes the
 * ground's own colour so the pairing is always the same 18.62:1 or 13.62:1
 * measured for that ground.
 *
 * New Car is never a button on a blue panel — it measures 1.37:1 against
 * Resolution Blue — which is why `accent` inverts here too rather than
 * being reused.
 */
const ON_DARK: Record<Variant, Palette> = {
  primary: {
    base: cn(
      "bg-surface text-ink",
      "enabled:hover:bg-white/90",
      "enabled:active:bg-white/80",
    ),
    disabled:
      "disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed",
  },
  accent: {
    base: cn(
      "bg-surface text-accent-deep",
      "enabled:hover:bg-white/90",
      "enabled:active:bg-white/80",
    ),
    disabled:
      "disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed",
  },
  secondary: {
    base: cn(
      "border border-white/30 bg-transparent text-surface",
      "enabled:hover:border-white/60 enabled:hover:bg-white/10",
      "enabled:active:bg-white/15",
    ),
    disabled:
      "disabled:border-white/15 disabled:text-white/40 disabled:cursor-not-allowed",
  },
  ghost: {
    base: cn(
      "bg-transparent text-surface",
      "enabled:hover:bg-white/10",
      "enabled:active:bg-white/15",
    ),
    disabled: "disabled:text-white/40 disabled:cursor-not-allowed",
  },
  destructive: VARIANTS.destructive,
};

/** The focus ring is 2px white offset plus 2px accent, and is never removed.
 *  On a dark ground the offset colour flips so the ring still separates. */
const ON_DARK_FOCUS =
  "focus-visible:shadow-[0_0_0_2px_var(--color-ink),0_0_0_4px_var(--color-surface)]";

export type ButtonLook = {
  variant?: Variant;
  size?: Size;
  /** Use on a Resolution Blue or Chinese Black panel. */
  onDark?: boolean;
  fullWidth?: boolean;
};

/**
 * The button's classes without the element.
 *
 * Exported so a navigational CTA can be a real `<a>` — a `<button>` nested
 * inside a link is invalid HTML and gives assistive technology two conflicting
 * controls. Anything that navigates uses `ButtonLink`; anything that acts uses
 * `Button`.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  onDark = false,
  fullWidth = false,
}: ButtonLook = {}): string {
  const palette = (onDark ? ON_DARK : VARIANTS)[variant];
  return cn(
    BASE,
    SIZES[size],
    palette.base,
    palette.disabled,
    onDark && variant !== "destructive" && ON_DARK_FOCUS,
    fullWidth && "w-full",
  );
}

export type ButtonProps = ButtonLook & {
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  variant = "primary",
  size = "md",
  onDark = false,
  fullWidth = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  disabled = false,
  type = "button",
  ...rest
}: ButtonProps) {
  const palette = (onDark ? ON_DARK : VARIANTS)[variant];

  return (
    <button
      type={type}
      // Loading is unclickable like disabled, but reads as busy rather than
      // unavailable — so it keeps its resting fill and only the cursor changes.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        BASE,
        SIZES[size],
        palette.base,
        loading ? "cursor-progress" : palette.disabled,
        onDark && variant !== "destructive" && ON_DARK_FOCUS,
        fullWidth && "w-full",
      )}
      {...rest}
    >
      {loading ? <Spinner size={18} /> : leadingIcon}
      {children}
      {loading ? null : trailingIcon}
    </button>
  );
}
