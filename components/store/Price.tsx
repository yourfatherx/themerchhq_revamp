import { cn } from "@/lib/cn";
import { formatINR, type Paise } from "@/lib/money";
import { CampaignBadge } from "./CampaignBadge";

/**
 * Inter 500, tabular.
 *
 * A struck-through "was" price is Ink Gray, never Danger — a reduction is good
 * news, and operational colours never leave order state.
 */

type PriceSize = "xl" | "md" | "sm";

const SIZES: Record<PriceSize, string> = {
  xl: "text-[32px] leading-[1.1]", // product page
  md: "text-[20px] leading-[1.2]", // card, cart
  sm: "text-[15px] leading-[1.2]", // table
};

export function Price({
  amount,
  was,
  size = "md",
  tierLabel,
  className,
}: {
  amount: Paise;
  /** The pre-reduction price, when a tier has brought it down. */
  was?: Paise;
  size?: PriceSize;
  /** e.g. "Tier 2". Rendered as a badge beside the figure. */
  tierLabel?: string;
  className?: string;
}) {
  return (
    <span className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className={cn("figure text-ink", SIZES[size])}>
        {formatINR(amount)}
      </span>
      {was ? (
        <span className="figure text-[18px] leading-[1.2] text-ink-muted line-through">
          {formatINR(was)}
        </span>
      ) : null}
      {tierLabel ? (
        <CampaignBadge state="moqMet">{tierLabel}</CampaignBadge>
      ) : null}
    </span>
  );
}

export type Tier = {
  /** Inclusive lower bound of the band. */
  from: number;
  /** Inclusive upper bound, or null for the open-ended top band. */
  to: number | null;
  unitPrice: Paise;
};

/**
 * Bulk tiers are a table, not a sentence.
 *
 * Tiers are campaign-wide, not per buyer — one more person ordering drops the
 * price for everyone. Unit price and tax are snapshotted onto the order line at
 * payment (PAY-8), so a later tier change never rewrites someone's receipt.
 */
export function TierTable({
  tiers,
  currentUnits,
}: {
  tiers: readonly Tier[];
  /** Campaign-wide units ordered so far, which decides the live band. */
  currentUnits: number;
}) {
  const base = tiers[0]?.unitPrice;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <caption className="sr-only">Bulk price tiers for this campaign</caption>
          <thead>
            <tr className="bg-surface-sunken">
              <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-ink-muted">
                Units
              </th>
              <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-right text-ink-muted">
                Per unit
              </th>
              <th scope="col" className="t-label border-b border-hairline px-4 py-3 text-right text-ink-muted">
                You save
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => {
              const live =
                currentUnits >= t.from && (t.to === null || currentUnits <= t.to);
              const saving = base ? base - t.unitPrice : 0;

              return (
                <tr
                  key={t.from}
                  className={cn(
                    "border-b border-hairline",
                    live && "bg-accent-tint",
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      "px-4 py-3 text-[15px] text-ink",
                      live ? "font-semibold" : "font-medium",
                    )}
                  >
                    <span className="figure">
                      {t.to === null ? `${t.from} +` : `${t.from} – ${t.to}`}
                    </span>
                    {live ? (
                      <span className="t-caption ml-2 text-accent-deep">· now</span>
                    ) : null}
                  </th>
                  <td className="figure px-4 py-3 text-right text-[15px] text-ink">
                    {formatINR(t.unitPrice)}
                  </td>
                  <td className="figure px-4 py-3 text-right text-[15px] text-ink">
                    {saving > 0 ? formatINR(saving as Paise) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="t-body-sm mt-3 max-w-[76ch] text-ink-muted">
        Tiers are campaign-wide, not per buyer — one more person ordering drops
        the price for everyone. Your unit price and tax are fixed at the moment
        you pay, so a later tier change never rewrites your receipt.
      </p>
    </div>
  );
}
