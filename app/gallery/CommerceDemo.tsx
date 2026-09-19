"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CampaignBadge } from "@/components/store/CampaignBadge";
import { CartLineItem } from "@/components/store/CartLineItem";
import { Countdown, MoqProgress } from "@/components/store/Countdown";
import { OrderStatusTracker } from "@/components/store/OrderStatusTracker";
import { OrderSummary } from "@/components/store/OrderSummary";
import { PickupCode } from "@/components/store/PickupCode";
import { Price, TierTable } from "@/components/store/Price";
import { ProductCard } from "@/components/store/ProductCard";
import { SizeChart } from "@/components/store/SizeChart";
import { addPaise, rupees, subtractPaise, timesQty, type Paise } from "@/lib/money";
import { gstOn } from "@/lib/tax";

const CHART = [
  { size: "S", chestCm: 52, lengthCm: 68, ordered: 4 },
  { size: "M", chestCm: 55, lengthCm: 70, ordered: 11 },
  { size: "L", chestCm: 58, lengthCm: 72, ordered: 18 },
  { size: "XL", chestCm: 61, lengthCm: 74, ordered: 12 },
  { size: "2XL", chestCm: 64, lengthCm: 76, ordered: 5 },
];

const TIERS = [
  { from: 1, to: 39, unitPrice: rupees(1099) },
  { from: 40, to: 99, unitPrice: rupees(899) },
  { from: 100, to: 249, unitPrice: rupees(799) },
  { from: 250, to: null, unitPrice: rupees(749) },
];

/** The close date and "now" are server values in the real storefront (STO-3).
 *  Fixed here so the specimen renders identically on every load. */
const NOW = new Date("2026-10-12T12:30:00+05:30");
const CLOSES = new Date("2026-10-14T23:59:00+05:30");

export function CommerceDemo() {
  const [hoodieQty, setHoodieQty] = useState(2);
  const [capQty, setCapQty] = useState(1);

  const hoodie = rupees(899);
  const cap = rupees(549);
  const subtotal = addPaise(
    timesQty(hoodie, hoodieQty),
    timesQty(cap, capQty),
  );
  const discount = rupees(400);
  const afterDiscount = subtractPaise(subtotal, discount);
  // Rounded once at the invoice level, per s.170 of the CGST Act.
  const { rounded: gst, total } = gstOn(afterDiscount, 1200);
  const units = hoodieQty + capQty;

  return (
    <div className="space-y-14">
      <div>
        <h3 className="t-h4 text-ink">Campaign status</h3>
        <p className="t-caption mt-1">
          radius sm · solid fills so they survive a hovered row
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <CampaignBadge state="open">Open</CampaignBadge>
          <CampaignBadge state="closing">Closes in 2 days</CampaignBadge>
          <CampaignBadge state="moqPending">MOQ pending · 16 to go</CampaignBadge>
          <CampaignBadge state="moqMet">MOQ met</CampaignBadge>
          <CampaignBadge state="closed">Closed</CampaignBadge>
          <CampaignBadge state="inProduction">In production</CampaignBadge>
          <CampaignBadge state="notOffered">Not offered</CampaignBadge>
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          The brief asked for in-stock / low-stock / sold-out. The product has no
          inventory — everything is made to order against a campaign — so those
          states can never be true. &ldquo;Not offered&rdquo; is the honest
          version of sold out. MOQ pending is the one outlined badge: it is a
          countdown, not a state.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="rounded-lg border border-hairline p-6">
          <Countdown
            closesAt={CLOSES}
            now={NOW}
            closesAtLabel="Friday 14 Oct, 23:59 IST"
          />
        </div>
        <div className="space-y-8 rounded-lg border border-hairline p-6">
          <MoqProgress ordered={50} required={40} />
          <MoqProgress
            ordered={24}
            required={40}
            tierNote="everyone drops to the tier 2 price"
          />
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Product card</h3>
        <p className="t-caption mt-1">
          no box · plate 4:5 at radius lg · facts set into the plate corners
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-3">
          <ProductCard
            href="#"
            name="Heavyweight hoodie"
            price={rupees(899)}
            was={rupees(1099)}
            colour="Navy"
            facts={["40 minimum", "11 days"]}
            colours={["Navy", "Black", "Oatmeal", "Maroon", "Olive"]}
          />
          <ProductCard
            href="#"
            name="Campus cap"
            price={rupees(549)}
            colour="Natural"
            facts={["60 minimum", "9 days"]}
            colours={["Natural", "Black"]}
          />
          <ProductCard
            href="#"
            name="Enamel pin set"
            price={rupees(299)}
            facts={["100 minimum", "14 days"]}
            unavailable
          />
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          Imagery is a placeholder plate — Lavender at 4:5 with the mark at 10% —
          until real flat-lays from a real run are supplied. Stock photography
          and mockup generators never enter this system.
        </p>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Price display</h3>
        <p className="t-caption mt-1">
          Inter 500 tabular · strikethrough is Ink Gray, never Danger
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-10">
          <Price amount={rupees(899)} size="xl" />
          <Price amount={rupees(899)} size="md" />
          <Price amount={rupees(899)} size="sm" />
          <Price amount={rupees(899)} was={rupees(1099)} size="md" tierLabel="Tier 2" />
        </div>
        <div className="mt-8 max-w-2xl">
          <TierTable tiers={TIERS} currentUnits={50} />
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Size chart</h3>
        <p className="t-caption mt-1">
          Measured cm, per product, inline — never behind a modal
        </p>
        <div className="mt-5 max-w-2xl">
          <SizeChart rows={CHART} showOrdered />
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          Charts are versioned per product — editing one never alters the chart
          attached to a closed campaign. This is the single highest-leverage
          table in the product: a wrong number here is a reprint.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h3 className="t-h4 text-ink">Cart line item</h3>
          <p className="t-caption mt-1">
            96px plate · variant meta in body-sm · row hover on the whole line · live
          </p>
          <div className="mt-5 divide-y divide-tint">
            <CartLineItem
              name="Heavyweight hoodie"
              variant="Navy · L · left chest print"
              unitPrice={hoodie}
              qty={hoodieQty}
              onQtyChange={setHoodieQty}
              onRemove={() => setHoodieQty(1)}
            />
            <CartLineItem
              name="Campus cap"
              variant="Bone · one size · embroidered"
              unitPrice={cap}
              qty={capQty}
              onQtyChange={setCapQty}
              onRemove={() => setCapQty(1)}
              note="16 more to hit MOQ"
            />
          </div>
        </div>

        <div>
          <OrderSummary
            lines={[
              { label: `2 items · ${units} units`, amount: subtotal },
              { label: "Tier 2 campaign price", amount: discount, deduction: true },
              { label: "Collection · department office", amount: 0 as Paise, free: true },
              { label: "GST 12%", amount: gst },
            ]}
            total={total}
            note="We print after the storefront closes on 14 Oct. You can change your size for 24 hours after paying."
          >
            <Button fullWidth size="lg">
              Pay with UPI
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth>
                Card
              </Button>
              <Button variant="secondary" fullWidth>
                Netbanking
              </Button>
            </div>
          </OrderSummary>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div>
          <h3 className="t-h4 text-ink">Pickup code</h3>
          <p className="t-caption mt-1">The one number a buyer has to keep</p>
          <div className="mt-5">
            <PickupCode code="MHQ-4821" />
          </div>
        </div>
        <div>
          <h3 className="t-h4 text-ink">Order status</h3>
          <p className="t-caption mt-1">
            Four fixed steps · done Success, current accent ring, upcoming ink on Lavender
          </p>
          <div className="mt-5">
            <OrderStatusTracker
              current="production"
              details={{ confirmed: "12 Oct", production: "Printing this week" }}
            />
          </div>
          <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
            Upcoming steps carry ink on Lavender at 10.95:1 rather than Slate
            glyphs, which would fall to 2.57:1. State never rests on colour
            alone — the label and the icon carry it too.
          </p>
        </div>
      </div>
    </div>
  );
}
