import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import type { IconName } from "@/components/brand/icons";
import { cn } from "@/lib/cn";

/**
 * Inline alert — tint fill at 8%, full-strength icon, 3px top rule.
 *
 * The text is always ink, so it never depends on the tint to be readable: ink
 * sits at 15.5–16.5:1 on all four grounds. Tints are the semantic hue at 8%
 * over white, derived with `color-mix` rather than added as new hexes.
 */

export type AlertTone = "info" | "success" | "warning" | "danger";

const TONE_VAR: Record<AlertTone, string> = {
  info: "var(--color-accent)",
  success: "var(--color-state-success)",
  warning: "var(--color-state-warning)",
  danger: "var(--color-state-danger)",
};

const TONE_ICON: Record<AlertTone, IconName> = {
  info: "clock",
  success: "tick",
  warning: "clock",
  danger: "cross",
};

export function Alert({
  tone = "info",
  title,
  children,
  icon,
  className,
}: {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  icon?: IconName;
  className?: string;
}) {
  const hue = TONE_VAR[tone];

  return (
    <div
      // Danger and warning are announced when they appear; the rest are not.
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg p-4", className)}
      style={{
        background: `color-mix(in srgb, ${hue} 8%, white)`,
        borderTop: `3px solid ${hue}`,
      }}
    >
      <span className="mt-[2px] shrink-0" style={{ color: hue }}>
        <Icon name={icon ?? TONE_ICON[tone]} size={20} />
      </span>
      <div>
        <p className="t-body font-medium text-ink">{title}</p>
        {children ? (
          <div className="t-body-sm mt-1 text-ink">{children}</div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Status badge.
 *
 * Solid fills, not tinted text: a badge has to stay legible on a zebra row and
 * on a hovered row alike, and warning text on `--surface-hover` measures
 * 4.44:1 — 0.06 short. White on the solid hue is background-independent.
 */
export function StatusBadge({
  tone,
  children,
}: {
  tone: AlertTone | "neutral";
  children: ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap text-surface"
      style={{
        background:
          tone === "neutral" ? "var(--color-ink-muted)" : TONE_VAR[tone],
      }}
    >
      {children}
    </span>
  );
}
