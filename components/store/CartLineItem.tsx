"use client";

import { Icon } from "@/components/brand/Icon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatINR, timesQty, type Paise } from "@/lib/money";
import { CampaignBadge } from "./CampaignBadge";
import { ProductPlate } from "./ProductPlate";

/**
 * 96px plate at radius md · variant meta in body-sm · row hover on the whole
 * line.
 *
 * Any campaign badge inside this row uses its solid form: amber text on
 * `--surface-hover` measures 4.44:1, so `inRow` forces the background-
 * independent fill.
 */
export function CartLineItem({
  name,
  variant,
  unitPrice,
  qty,
  onQtyChange,
  onRemove,
  imageSrc,
  note,
}: {
  name: string;
  /** e.g. "Navy · L · left chest print". */
  variant: string;
  unitPrice: Paise;
  qty: number;
  onQtyChange: (next: number) => void;
  onRemove: () => void;
  imageSrc?: string;
  /** e.g. "16 more to hit MOQ". */
  note?: string;
}) {
  const lineTotal = timesQty(unitPrice, qty);

  return (
    <div className="flex flex-wrap items-start gap-4 rounded-md p-3 transition-colors duration-150 ease-brand hover:bg-surface-hover sm:flex-nowrap">
      <div className="w-24 shrink-0">
        <ProductPlate src={imageSrc} alt={name} className="rounded-md" />
      </div>

      <div className="min-w-[180px] grow">
        <h3 className="t-body font-medium text-ink">{name}</h3>
        <p className="t-body-sm mt-1 text-ink-muted">{variant}</p>

        {note ? (
          <span className="mt-3 inline-block">
            <CampaignBadge state="moqPending" inRow>
              {note}
            </CampaignBadge>
          </span>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <QuantityStepper
            value={qty}
            onChange={onQtyChange}
            label={`${name}, ${variant}`}
          />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-[14px] font-medium text-ink-muted transition-colors duration-150 ease-brand hover:text-state-danger"
          >
            <Icon name="trash" size={16} />
            Remove
            <span className="sr-only">
              {" "}
              {name}, {variant}
            </span>
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="figure text-[20px] text-ink">{formatINR(lineTotal)}</p>
        <p className="figure t-body-sm mt-1 text-ink-muted">
          {formatINR(unitPrice)} each
        </p>
      </div>
    </div>
  );
}
