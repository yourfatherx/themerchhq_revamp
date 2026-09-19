"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Six cells, 52×60, Inter 500 tabular 24px — the only gate before payment.
 *
 * Rules, from the design:
 *  - Autofocus the first empty cell; paste fills all six.
 *  - `inputmode="numeric"` so the phone keypad comes up, not the full keyboard.
 *  - Never disable the resend button — show a countdown inside it.
 */
export type OtpInputProps = {
  value: string;
  onChange: (next: string) => void;
  /** Fired once the last cell is filled, so the form can submit itself. */
  onComplete?: (code: string) => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  label?: string;
  /** Focus the first empty cell on mount. Correct on a real verification step;
   *  turn it off where the control is only being displayed. */
  autoFocus?: boolean;
};

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  invalid = false,
  disabled = false,
  label = "Verification code",
  autoFocus = true,
}: OtpInputProps) {
  const base = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length).slice(0, length).split("");

  // Autofocus the first empty cell, not simply the first cell.
  useEffect(() => {
    if (disabled || !autoFocus) return;
    const first = Math.min(value.length, length - 1);
    refs.current[first]?.focus();
    // Only on mount: moving focus on every keystroke would fight the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAt = (i: number, digit: string) => {
    const next = value.padEnd(length).split("");
    next[i] = digit;
    const joined = next.join("").trimEnd();
    onChange(joined);
    return joined;
  };

  const handleInput = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const joined = setAt(i, digit);
    if (i < length - 1) refs.current[i + 1]?.focus();
    if (joined.replace(/\s/g, "").length === length) onComplete?.(joined);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]?.trim()) {
        setAt(i, " ");
      } else if (i > 0) {
        setAt(i - 1, " ");
        refs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  // A pasted code fills every cell, wherever it was pasted.
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const code = pasted.slice(0, length);
    onChange(code);
    refs.current[Math.min(code.length, length - 1)]?.focus();
    if (code.length === length) onComplete?.(code);
  };

  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap gap-2 sm:gap-3"
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={`${base}-${i}`}
          value={digits[i]?.trim() ?? ""}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-label={`Digit ${i + 1} of ${length}`}
          inputMode="numeric"
          // Lets the OS offer the code straight from the SMS.
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          className={cn(
            "figure h-[60px] w-[52px] rounded-md border text-center text-[24px] outline-none",
            "transition-all duration-150 ease-brand",
            disabled && "cursor-not-allowed border-hairline bg-surface-sunken text-rule",
            !disabled && invalid && "border-state-danger bg-surface text-ink",
            !disabled &&
              !invalid &&
              "border-hairline bg-surface text-ink focus-visible:border-accent",
          )}
        />
      ))}
    </div>
  );
}
