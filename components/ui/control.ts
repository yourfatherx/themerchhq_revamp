import { cn } from "@/lib/cn";

/**
 * Shared geometry and boundary colours for every text-entry control.
 *
 * Interactive boundaries are Slate Gray; decorative rules are Lavender. A
 * control that is disabled drops to a Lavender edge on a sunken fill, because
 * it is no longer interactive.
 *
 * Every control is at least 44px tall — checkout has to survive a thumb on a
 * mid-range Android.
 */

export const CONTROL_BASE =
  "w-full rounded-md border bg-surface text-ink outline-none " +
  "transition-all duration-150 ease-brand " +
  "placeholder:text-ink-muted";

export const CONTROL_HEIGHT = "h-12 px-4"; // 48px

export type ControlTone = "default" | "error" | "disabled";

export function controlTone(tone: ControlTone): string {
  switch (tone) {
    case "error":
      // The boundary carries the error; the message below carries the fix.
      return cn(
        "border-state-danger",
        "focus-visible:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-state-danger)]",
      );
    case "disabled":
      return "border-tint bg-surface-sunken text-rule cursor-not-allowed";
    default:
      return "border-rule focus-visible:border-accent";
  }
}
