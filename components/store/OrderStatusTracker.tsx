import { Icon } from "@/components/brand/Icon";
import type { IconName } from "@/components/brand/icons";
import { cn } from "@/lib/cn";

/**
 * Four fixed steps (POS-4): confirmed → in production → ready for collection →
 * collected.
 *
 * Done is Success, current carries an accent ring, upcoming is ink on Lavender
 * at 10.95:1 rather than Slate glyphs, which would fall to 2.57:1.
 *
 * State never rests on colour alone — the label and the icon carry it too, and
 * each step announces its own status to a screen reader.
 */

export const ORDER_STEPS = [
  { id: "confirmed", name: "Confirmed", icon: "tick" },
  { id: "production", name: "In production", icon: "tee" },
  { id: "ready", name: "Ready for collection", icon: "storefront" },
  { id: "collected", name: "Collected", icon: "kit" },
] as const satisfies ReadonlyArray<{ id: string; name: string; icon: IconName }>;

export type OrderStep = (typeof ORDER_STEPS)[number]["id"];

export function OrderStatusTracker({
  current,
  details,
}: {
  current: OrderStep;
  /** Optional per-step line, e.g. a date. Keyed by step id. */
  details?: Partial<Record<OrderStep, string>>;
}) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {ORDER_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const status = done ? "Done" : active ? "In progress" : "Not started yet";

        return (
          <li key={step.id} className="flex gap-3">
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full",
                done && "bg-state-success text-surface",
                active && "bg-accent text-surface ring-4 ring-accent-tint",
                !done && !active && "bg-tint text-ink",
              )}
            >
              <Icon name={done ? "tick" : step.icon} size={20} />
            </span>
            <span>
              <span className="t-body-sm block font-medium text-ink">
                {step.name}
              </span>
              <span className="t-caption block">
                {details?.[step.id] ?? status}
              </span>
              {/* The label above is visual; this is what is announced. */}
              <span className="sr-only">{status}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
