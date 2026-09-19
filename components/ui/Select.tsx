import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";
import { CONTROL_BASE, CONTROL_HEIGHT, controlTone } from "./control";

/**
 * A native `<select>` with the native arrow suppressed and the authored chevron
 * drawn over it.
 *
 * Deliberately native rather than a custom listbox: on a phone this opens the
 * OS picker, which is the right control for a buyer choosing a collection point
 * with one thumb, and it keeps keyboard and screen-reader behaviour for free.
 * The design's open state is the OS picker's job, not ours.
 */
export type SelectProps = {
  invalid?: boolean;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">;

export function Select({
  invalid = false,
  disabled,
  children,
  ...rest
}: SelectProps) {
  const tone = disabled ? "disabled" : invalid ? "error" : "default";

  return (
    <div className="relative">
      <select
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL_BASE,
          CONTROL_HEIGHT,
          "cursor-pointer appearance-none pr-12 text-[16px]",
          controlTone(tone),
          disabled && "cursor-not-allowed",
        )}
        {...rest}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2",
          disabled ? "text-rule" : "text-ink",
        )}
      >
        <Icon name="chevron" size={20} />
      </span>
    </div>
  );
}

/** Search is a pill — the face primitive at full radius. */
export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
>;

export function SearchInput({ disabled, ...rest }: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-full border px-[18px]",
        "transition-all duration-150 ease-brand",
        "focus-within:border-accent focus-within:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent)]",
        disabled ? "border-hairline bg-surface-sunken" : "border-hairline bg-surface",
      )}
    >
      <Icon
        name="search"
        size={20}
        className={cn("shrink-0", disabled ? "text-rule" : "text-ink-muted")}
      />
      <input
        type="search"
        disabled={disabled}
        className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed disabled:text-rule"
        {...rest}
      />
    </div>
  );
}
