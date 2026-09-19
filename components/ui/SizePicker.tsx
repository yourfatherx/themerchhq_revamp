"use client";

import { cn } from "@/lib/cn";

/**
 * Selection is a fill, not a tick.
 *
 * Retired variants stay visible and stay unclickable: a size not offered on
 * this campaign keeps its place in the row so the buyer doesn't wonder whether
 * they missed it.
 *
 * DEVIATION from Components.dc.html: the retired label there is Slate Gray
 * #767888, which measures 4.04:1 on the sunken fill — under the 4.5 floor, and
 * against Foundations' own stronger rule that Slate Gray is "never text at any
 * size in UI". Since a retired label is information the buyer has to read, it
 * uses --ink-muted here at 6.09:1. The disabled *button* elsewhere keeps its
 * 2.57:1 treatment, which the design calls decorative by intent and which WCAG
 * exempts.
 */

export type SizeOption = {
  label: string;
  /** Not offered on this campaign. Shown, never selectable. */
  retired?: boolean;
};

export function SizePicker({
  options,
  value,
  onChange,
  name = "Size",
}: {
  options: readonly SizeOption[];
  value: string | null;
  onChange: (next: string) => void;
  name?: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-3">
      {options.map((o) => {
        const selected = value === o.label;
        return (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={o.retired}
            aria-label={
              o.retired
                ? `${o.label} — not offered on this campaign`
                : undefined
            }
            onClick={() => onChange(o.label)}
            className={cn(
              "h-12 min-w-[60px] rounded-md border px-4 text-[16px] font-medium",
              "transition-all duration-150 ease-brand",
              o.retired &&
                "cursor-not-allowed border-hairline bg-surface-sunken text-ink-muted",
              !o.retired &&
                selected &&
                "border-accent bg-accent text-surface",
              !o.retired &&
                !selected &&
                "border-hairline bg-surface text-ink hover:border-accent hover:bg-surface-hover",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export type ColourOption = {
  name: string;
  /** The real garment colour. This is the one place a field colour may appear. */
  hex: string;
  retired?: boolean;
};

export function ColourSwatches({
  options,
  value,
  onChange,
}: {
  options: readonly ColourOption[];
  value: string | null;
  onChange: (next: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-3">
      {options.map((o) => {
        const selected = value === o.name;
        return (
          <button
            key={o.name}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={o.retired}
            onClick={() => onChange(o.name)}
            title={o.name}
            className={cn(
              "flex items-center gap-3 rounded-md border py-2 pr-4 pl-2",
              "transition-all duration-150 ease-brand",
              o.retired && "cursor-not-allowed border-hairline text-ink-muted",
              !o.retired && selected && "border-accent bg-accent-tint",
              !o.retired &&
                !selected &&
                "border-hairline hover:border-accent hover:bg-surface-hover",
            )}
          >
            <span
              aria-hidden="true"
              // A hairline keeps a pale garment colour visible on white.
              className="size-8 rounded-sm border border-hairline"
              style={{ background: o.hex }}
            />
            <span className="text-[16px] font-medium text-ink">{o.name}</span>
          </button>
        );
      })}
    </div>
  );
}
