"use client";

import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Control 22px, checkbox at radius sm. The whole label row is the hit area —
 * a 22px box alone is not a thumb target.
 */

type BaseProps = {
  label: ReactNode;
  /** A second line under the label. Stays readable when the control is disabled. */
  note?: string;
  invalid?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type">;

function Row({
  children,
  note,
  label,
  disabled,
}: {
  children: ReactNode;
  note?: string;
  label: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md py-2",
        disabled && "cursor-not-allowed",
      )}
    >
      {children}
      <span>
        <span className={cn("t-body block", disabled ? "text-rule" : "text-ink")}>
          {label}
        </span>
        {note ? <span className="t-caption block">{note}</span> : null}
      </span>
    </label>
  );
}

const BOX =
  "grid size-[22px] shrink-0 place-items-center rounded-sm border mt-[3px] " +
  "transition-all duration-150 ease-brand";

export function Checkbox({
  label,
  note,
  invalid = false,
  indeterminate = false,
  disabled,
  checked,
  ...rest
}: BaseProps & { indeterminate?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);

  // `indeterminate` is a property, not an attribute — it cannot be set in JSX.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const on = checked || indeterminate;

  return (
    <Row label={label} note={note} disabled={disabled}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          BOX,
          "peer-focus-visible:border-accent peer-focus-visible:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent)]",
          disabled && "border-hairline bg-surface-sunken",
          !disabled && on && "border-accent bg-accent",
          !disabled && !on && invalid && "border-state-danger bg-surface",
          !disabled && !on && !invalid && "border-hairline bg-surface",
        )}
      >
        {indeterminate ? (
          <span className="h-[2.6px] w-[11px] rounded-full bg-surface" />
        ) : checked ? (
          <svg viewBox="0 0 24 24" className="size-4 text-surface" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </Row>
  );
}

export function Radio({ label, note, invalid = false, disabled, checked, ...rest }: BaseProps) {
  return (
    <Row label={label} note={note} disabled={disabled}>
      {/* No `aria-invalid` here: validity belongs to the radio *group*, not to
          an individual option. `invalid` only drives the visual edge. */}
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          BOX,
          "rounded-full",
          "peer-focus-visible:border-accent peer-focus-visible:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent)]",
          disabled && "border-hairline bg-surface-sunken",
          !disabled && checked && "border-accent bg-surface",
          !disabled && !checked && invalid && "border-state-danger bg-surface",
          !disabled && !checked && !invalid && "border-hairline bg-surface",
        )}
      >
        {checked ? <span className="size-3 rounded-full bg-accent" /> : null}
      </span>
    </Row>
  );
}

/**
 * Track 48×26, knob 22.
 *
 * The off track is Slate, not Lavender — a 1.70:1 track reads as disabled
 * rather than off, and "off" is a state the user chose.
 */
export function Toggle({ label, note, disabled, checked, ...rest }: BaseProps) {
  return (
    <Row label={label} note={note} disabled={disabled}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-[2px] block h-[26px] w-12 shrink-0 rounded-full",
          "transition-colors duration-150 ease-brand",
          "peer-focus-visible:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent)]",
          disabled ? "bg-tint" : checked ? "bg-accent" : "bg-rule",
        )}
      >
        <span
          className={cn(
            // The one place a shadow survives outside an overlay: the knob has
            // to read as sitting on the track, and a hairline can't say that.
            "absolute top-[2px] size-[22px] rounded-full shadow-[0_1px_3px_rgb(0_0_0/0.25)]",
            "transition-[left] duration-150 ease-brand",
            disabled ? "bg-surface-sunken" : "bg-surface",
          )}
          style={{ left: checked ? 24 : 2 }}
        />
      </span>
    </Row>
  );
}
