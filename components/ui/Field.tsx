import { useId, type ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";

/**
 * Label, control, and exactly one message beneath it.
 *
 * Errors say what to *do*, not what went wrong: "Use your company address —
 * this storefront is open to verified employees only", never "Invalid email".
 *
 * A disabled label measures 2.57:1, so it is decorative by definition. Never
 * put the only explanation inside one — the helper line below carries it, and
 * it stays at Ink Gray whether the control is disabled or not.
 */

export type FieldProps = {
  label: string;
  /** Standing guidance. Always readable, including when the control is disabled. */
  helper?: string;
  /** Replaces `helper` when present, and names the fix rather than the fault. */
  error?: string;
  optional?: boolean;
  /** Rendered opposite the label — a character counter, a "Resend in 0:24". */
  labelAside?: ReactNode;
  /** Receives the ids it must wire up so the message is announced. */
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
};

export function Field({
  label,
  helper,
  error,
  optional = false,
  labelAside,
  children,
}: FieldProps) {
  const base = useId();
  const id = `f-${base}`;
  const messageId = `m-${base}`;
  const message = error ?? helper;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="t-body-sm font-medium text-ink">
          {label}
          {optional ? (
            <span className="t-caption ml-2 font-normal">Optional</span>
          ) : null}
        </label>
        {labelAside}
      </div>

      <div className="mt-2">
        {children({
          id,
          describedBy: message ? messageId : undefined,
          invalid: Boolean(error),
        })}
      </div>

      {message ? (
        <p
          id={messageId}
          // Errors are announced when they appear; helper text is not.
          role={error ? "alert" : undefined}
          className={cn(
            "t-body-sm mt-2 flex items-start gap-2",
            error ? "text-state-danger" : "text-ink-muted",
          )}
        >
          {error ? (
            <Icon name="cross" size={16} className="mt-[3px] shrink-0" />
          ) : null}
          <span>{message}</span>
        </p>
      ) : null}
    </div>
  );
}
