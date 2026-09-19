"use client";

import { useMemo, useState } from "react";
import { Price } from "@/components/store/Price";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SizePicker } from "@/components/ui/SizePicker";
import type { Paise } from "@/lib/money";

type Variant = {
  id: string;
  size: string;
  colour: string | null;
  retired: boolean;
  price: Paise;
};

/**
 * Size, quantity and the order CTA.
 *
 * On the storefront — mobile-first by definition — the order button is always
 * `lg` and always full-width. Nothing is added to a cart until a size is
 * chosen, because an order line without a size is the thing this whole product
 * exists to prevent.
 */
export function BuyPanel({
  productName,
  variants,
}: {
  productName: string;
  variants: Variant[];
}) {
  const sizes = useMemo(
    () =>
      variants.map((v) => ({ label: v.size, retired: v.retired })),
    [variants],
  );

  const firstAvailable = variants.find((v) => !v.retired)?.size ?? null;
  const [size, setSize] = useState<string | null>(firstAvailable);
  const [qty, setQty] = useState(1);

  const chosen = variants.find((v) => v.size === size) ?? null;

  return (
    <div>
      <Price
        amount={chosen?.price ?? variants[0]?.price ?? (0 as Paise)}
        size="xl"
      />

      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[13px] font-medium text-ink-muted">Size</h2>
          <p className="t-body-sm text-ink-muted">
            {size ? `Chosen: ${size}` : "Pick a size"}
          </p>
        </div>
        <div className="mt-4">
          <SizePicker
            options={sizes}
            value={size}
            onChange={setSize}
            name={`Size — ${productName}`}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-[13px] font-medium text-ink-muted">How many</h2>
        <div className="mt-4">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            label={`${productName}${size ? `, ${size}` : ""}`}
          />
        </div>
      </div>

      <div className="mt-10">
        {/* `accent`, not `primary`. Our own surfaces are monochrome and their
            buttons are ink, but this one is on the client's storefront and
            takes the client's colour — it is the single control the whole page
            exists for, and STO-8 says the client leads here. */}
        <Button variant="accent" size="lg" fullWidth disabled={!chosen}>
          {chosen ? "Add to my order" : "Pick a size first"}
        </Button>
        <p className="t-body-sm mt-3 text-ink-muted">
          You can change the size for 24 hours after paying, or until the
          storefront closes — whichever comes first.
        </p>
      </div>
    </div>
  );
}
