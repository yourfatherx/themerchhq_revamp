"use client";

import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";

/**
 * 48px hit targets · Inter 500 tabular value · MOQ-aware.
 *
 * There is no stock ceiling — everything is made to order against the campaign
 * — so the stepper has a floor of 1 and no cap. The only limit a buyer meets is
 * the close date.
 */
export type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  /** The floor. 1 in a cart; 0 only where a line is being removed. */
  min?: number;
  disabled?: boolean;
  invalid?: boolean;
  /** Names what the control is counting, e.g. "Heavyweight hoodie, XL". */
  label: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  disabled = false,
  invalid = false,
  label,
}: QuantityStepperProps) {
  const atFloor = value <= min;

  const step = (delta: number) => {
    const next = value + delta;
    if (next < min) return;
    onChange(next);
  };

  const buttonClass = (off: boolean) =>
    cn(
      "grid size-12 place-items-center transition-colors duration-150 ease-brand",
      off
        ? "cursor-not-allowed bg-surface-sunken text-rule"
        : "bg-surface text-ink enabled:hover:bg-surface-hover enabled:hover:text-accent-deep enabled:active:bg-surface-pressed",
    );

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-md border",
        "focus-within:border-accent focus-within:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent)]",
        disabled && "border-hairline bg-surface-sunken",
        !disabled && invalid && "border-state-danger",
        !disabled && !invalid && "border-hairline bg-surface",
      )}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={disabled || atFloor}
        aria-label={`Fewer — ${label}`}
        className={buttonClass(disabled || atFloor)}
      >
        <Icon name="minus" size={24} />
      </button>

      <output
        aria-live="polite"
        aria-label={`Quantity — ${label}`}
        className={cn(
          "figure h-12 min-w-14 border-x border-hairline text-center text-[18px] leading-[48px]",
          disabled ? "text-rule" : "text-ink",
        )}
      >
        {value}
      </output>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={disabled}
        aria-label={`More — ${label}`}
        className={buttonClass(disabled)}
      >
        <Icon name="plus" size={24} />
      </button>
    </div>
  );
}
