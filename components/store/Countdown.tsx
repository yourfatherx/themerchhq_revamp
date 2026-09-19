import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";

/**
 * Time remaining until a campaign closes (STO-3).
 *
 * Server-rendered: `now` is passed in from the server, and this component never
 * reads the browser clock or ticks. A buyer whose device clock is a day out
 * still sees the true remaining time, and there is no hydration mismatch.
 * Refreshing the number is a page load, not an interval.
 */
export function Countdown({
  closesAt,
  now,
  closesAtLabel,
}: {
  closesAt: Date;
  now: Date;
  /** Pre-formatted in the campaign's timezone by the server, e.g. "Friday 14 Oct, 23:59 IST". */
  closesAtLabel: string;
}) {
  const ms = Math.max(0, closesAt.getTime() - now.getTime());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const over = ms === 0;

  return (
    <div>
      <p className="text-[13px] font-medium text-ink-muted">
        {over ? "Storefront closed" : "Storefront closes"}
      </p>

      {over ? (
        <p className="t-h3 mt-3 text-ink">Ordering has ended</p>
      ) : (
        <div className="mt-3 flex items-end gap-5">
          <Unit value={days} unit={days === 1 ? "day" : "days"} />
          <Unit value={hours} unit={hours === 1 ? "hour" : "hours"} />
        </div>
      )}

      <p className="t-body-sm mt-3 text-ink-muted">
        <span className="figure">{closesAtLabel}</span>
        <br />
        Nothing can be ordered after this.
      </p>
    </div>
  );
}

function Unit({ value, unit }: { value: number; unit: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="figure t-h2 text-ink">{value}</span>
      <span className="t-body-sm text-ink-muted">{unit}</span>
    </span>
  );
}

/**
 * MOQ progress (STO-4). Updates on page load; no live socket required.
 *
 * The bar is accent while it is climbing and Success only once it has cleared —
 * never amber, because a campaign under MOQ isn't a warning, it's a campaign in
 * progress.
 */
export function MoqProgress({
  ordered,
  required,
  tierNote,
}: {
  ordered: number;
  required: number;
  /** What clearing the minimum gets everyone, e.g. "everyone drops to the tier 2 price". */
  tierNote?: string;
}) {
  const met = ordered >= required;
  const pct = Math.min(100, Math.round((ordered / required) * 100));
  const remaining = Math.max(0, required - ordered);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13px] font-medium text-ink-muted">
          {met ? "Minimum reached" : "MOQ pending"}
        </p>
        <p className="figure t-body-sm text-ink">
          {ordered} of {required} ordered
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={ordered}
        aria-valuemin={0}
        aria-valuemax={required}
        aria-label="Minimum order quantity progress"
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-tint"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-150 ease-brand",
            met ? "bg-state-success" : "bg-accent",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="t-body-sm mt-3 flex items-start gap-2 text-ink">
        {met ? (
          <>
            <Icon
              name="tick"
              size={16}
              className="mt-[3px] shrink-0 text-state-success"
            />
            <span>Minimum reached — this campaign is going to print.</span>
          </>
        ) : (
          <span>
            <span className="figure">{remaining} more</span>
            {tierNote ? ` and ${tierNote}.` : " to reach the minimum."}
          </span>
        )}
      </p>
    </div>
  );
}
