import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { CONTROL_BASE, CONTROL_HEIGHT, controlTone } from "./control";
import { Spinner } from "./Spinner";

export type TextInputProps = {
  invalid?: boolean;
  /** Shown inside the control's trailing edge while a value is being checked. */
  loading?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

/** h 48 · radius md · 1px Slate boundary · value Inter 400 16 · placeholder Ink Gray. */
export function TextInput({
  invalid = false,
  loading = false,
  disabled,
  ...rest
}: TextInputProps) {
  const tone = disabled ? "disabled" : invalid ? "error" : "default";

  const input = (
    <input
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        CONTROL_BASE,
        CONTROL_HEIGHT,
        "text-[16px]",
        controlTone(tone),
        loading && "pr-12",
      )}
      {...rest}
    />
  );

  if (!loading) return input;

  return (
    <div className="relative">
      {input}
      <span className="absolute top-1/2 right-4 -translate-y-1/2 text-ink-muted">
        <Spinner size={18} />
      </span>
    </div>
  );
}

export type TextareaProps = {
  invalid?: boolean;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

/** min-height 116 · padding 14/16 · line-height 1.55 · resizes vertically only. */
export function Textarea({ invalid = false, disabled, ...rest }: TextareaProps) {
  const tone = disabled ? "disabled" : invalid ? "error" : "default";

  return (
    <textarea
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        CONTROL_BASE,
        "min-h-[116px] resize-y px-4 py-[14px] text-[16px] leading-[1.55]",
        controlTone(tone),
      )}
      {...rest}
    />
  );
}
