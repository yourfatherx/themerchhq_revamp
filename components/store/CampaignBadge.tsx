import { Icon } from "@/components/brand/Icon";
import type { IconName } from "@/components/brand/icons";
import { cn } from "@/lib/cn";

/**
 * Campaign status. Radius sm, label type, solid fills so they survive a hovered
 * row.
 *
 * A CHANGE FROM THE ORIGINAL BRIEF, carried over from the design: the brief
 * asked for in-stock / low-stock / sold-out badges. The product has no
 * inventory — everything is made to order against a campaign — so those three
 * states can never be true, and shipping them would teach buyers to look for a
 * signal that doesn't exist. They are replaced by the states a campaign
 * actually passes through. "Not offered" is the honest version of sold out: a
 * variant this campaign didn't include.
 */

export type CampaignState =
  | "open"
  | "closing"
  | "moqPending"
  | "moqMet"
  | "closed"
  | "inProduction"
  | "notOffered";

const SOLID: Record<CampaignState, { bg: string; icon?: IconName }> = {
  open: { bg: "var(--color-state-success)", icon: "tick" },
  closing: { bg: "var(--color-state-warning)", icon: "clock" },
  moqPending: { bg: "var(--color-state-warning)", icon: "clock" },
  moqMet: { bg: "var(--color-state-success)", icon: "tick" },
  closed: { bg: "var(--color-ink)" },
  inProduction: { bg: "var(--color-accent)", icon: "tee" },
  notOffered: { bg: "var(--color-state-danger)", icon: "cross" },
};

export function CampaignBadge({
  state,
  children,
  /**
   * Set on any badge sitting inside a hoverable row. `moqPending` is the one
   * outlined badge — it is a countdown, not a state, and the hollow form keeps
   * it from competing with the campaign status beside it. Its amber text sits
   * on white at 5.02:1, but on `--surface-hover` it falls to 4.44:1, so inside
   * a row it switches to the solid form, which is background-independent.
   */
  inRow = false,
}: {
  state: CampaignState;
  children: React.ReactNode;
  inRow?: boolean;
}) {
  const spec = SOLID[state];
  const outlined = state === "moqPending" && !inRow;

  return (
    <span
      className={cn(
        "t-label inline-flex items-center gap-[6px] rounded-sm px-[10px] py-[6px] whitespace-nowrap",
        outlined ? "border bg-surface" : "text-surface",
      )}
      style={
        outlined
          ? {
              borderColor: "var(--color-state-warning)",
              color: "var(--color-state-warning)",
            }
          : { background: spec.bg }
      }
    >
      {spec.icon ? <Icon name={spec.icon} size={16} /> : null}
      {children}
    </span>
  );
}
