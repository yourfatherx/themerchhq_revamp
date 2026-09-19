import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";
import { formatINR, type Paise } from "@/lib/money";

/**
 * Sticky on desktop · sunken plate · GST always shown separately (PAY-9).
 *
 * Tax is its own line, never folded into the total, so a corporate buyer can
 * read the invoice straight off the checkout screen.
 */

export type SummaryLine = {
  label: string;
  /** Rendered as a figure. Use `free` for a zero line that should read "Free". */
  amount: Paise;
  /** A reduction. Rendered with a minus and in Ink Gray, never Danger. */
  deduction?: boolean;
  free?: boolean;
};

export function OrderSummary({
  lines,
  total,
  children,
  note,
}: {
  lines: readonly SummaryLine[];
  total: Paise;
  /** Payment actions. UPI is presented first (PAY-4). */
  children?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-surface-sunken p-6 lg:sticky lg:top-6">
      <h2 className="t-h4 text-ink">Order summary</h2>

      <dl className="mt-5 space-y-3">
        {lines.map((l) => (
          <div key={l.label} className="flex items-baseline justify-between gap-4">
            <dt className="t-body-sm text-ink-muted">{l.label}</dt>
            <dd
              className={cn(
                "figure text-[15px] whitespace-nowrap",
                l.deduction ? "text-ink-muted" : "text-ink",
              )}
            >
              {l.free
                ? "Free"
                : l.deduction
                  ? `− ${formatINR(l.amount)}`
                  : formatINR(l.amount)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
        <span className="t-h4 text-ink">Total</span>
        <span className="figure text-[20px] text-ink">{formatINR(total)}</span>
      </div>

      {children ? <div className="mt-6 space-y-3">{children}</div> : null}

      {note ? (
        <p className="t-body-sm mt-6 flex items-start gap-2 text-ink-muted">
          <Icon name="clock" size={20} className="mt-[1px] shrink-0 text-accent" />
          <span>{note}</span>
        </p>
      ) : null}
    </div>
  );
}
