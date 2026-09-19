"use client";

import { useState } from "react";
import { Alert, StatusBadge } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Breadcrumb,
  Pagination,
  TabPanel,
  Tabs,
} from "@/components/ui/Navigation";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

type Order = {
  code: string;
  name: string;
  identifier: string;
  units: number;
  value: string;
  state: "Paid" | "In production" | "Ready" | "Refunded";
};

const ORDERS: Order[] = [
  { code: "MHQ-4821", name: "Priya Nair", identifier: "2022B4A70123G", units: 2, value: "₹1,798", state: "Paid" },
  { code: "MHQ-4822", name: "Arjun Mehta", identifier: "2021A7PS0456H", units: 1, value: "₹899", state: "In production" },
  { code: "MHQ-4823", name: "Sana Qureshi", identifier: "2023B3A10789K", units: 3, value: "₹2,697", state: "Ready" },
  { code: "MHQ-4824", name: "Rahul Iyer", identifier: "2022B1A80234M", units: 1, value: "₹899", state: "Refunded" },
  { code: "MHQ-4825", name: "Meera Joshi", identifier: "2024B2A40567P", units: 2, value: "₹1,798", state: "Paid" },
];

const STATE_TONE = {
  Paid: "success",
  "In production": "info",
  Ready: "success",
  Refunded: "danger",
} as const;

const COLUMNS: ReadonlyArray<Column<Order>> = [
  { key: "code", header: "Code", render: (o) => <span className="figure">{o.code}</span> },
  { key: "name", header: "Buyer", render: (o) => o.name },
  { key: "id", header: "Identifier", render: (o) => <span className="figure">{o.identifier}</span> },
  { key: "units", header: "Units", numeric: true, render: (o) => o.units },
  { key: "value", header: "Paid", numeric: true, render: (o) => o.value },
  {
    key: "state",
    header: "State",
    render: (o) => <StatusBadge tone={STATE_TONE[o.state]}>{o.state}</StatusBadge>,
  },
];

const TABS = [
  { id: "orders", label: "Orders" },
  { id: "sizes", label: "Size breakdown" },
  { id: "payouts", label: "Payout" },
] as const;

export function DataDemo() {
  const [tab, setTab] = useState<string>("orders");
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-14">
      <div>
        <h3 className="t-h4 text-ink">Breadcrumb</h3>
        <p className="t-caption mt-1">
          Body-sm, Slate chevron, current page in ink and not a link
        </p>
        <div className="mt-5">
          <Breadcrumb
            items={[
              { label: "Hostel Night 2026", href: "#" },
              { label: "Apparel", href: "#" },
              { label: "Heavyweight hoodie" },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Tabs</h3>
        <p className="t-caption mt-1">
          2px accent underline · 48px hit height · 500 → 600 when active · live
        </p>
        <div className="mt-5">
          <Tabs tabs={TABS} value={tab} onChange={setTab} label="Campaign views" />
          <div className="mt-6">
            <TabPanel id={tab}>
              <p className="t-body text-ink-muted">
                {tab === "orders"
                  ? "Every order placed on this campaign, searchable by name, phone, identifier or code."
                  : tab === "sizes"
                    ? "Item × size × quantity — the one table that goes to the printer."
                    : "Amount accrued, amount paid, expected date and reference."}
              </p>
            </TabPanel>
          </div>
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Data table</h3>
        <p className="t-caption mt-1">
          The one square-cornered component · zebra on sunken · figures right-aligned and tabular
        </p>
        <div className="mt-5 bg-surface">
          <DataTable
            caption="Orders on Hostel Night 2026"
            columns={COLUMNS}
            rows={ORDERS}
            getRowKey={(o) => o.code}
            footer={
              <>
                <span className="figure">Showing 1–5 of 50 orders</span>
                <Pagination page={page} pageCount={10} onChange={setPage} />
              </>
            }
          />
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Inline alert</h3>
        <p className="t-caption mt-1">
          Tint fill at 8% · full-strength icon · 3px top rule · text is always ink
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Alert tone="info" title="We print after 14 Oct">
            Orders placed after the storefront closes roll into the next
            campaign.
          </Alert>
          <Alert tone="success" title="MOQ met — everyone pays ₹899" icon="tick">
            The tier 2 price is applied to every order in this campaign,
            including the ones already placed.
          </Alert>
          <Alert
            tone="warning"
            title="Your size can be changed for 19 more hours"
          >
            After that the sizing spread goes to production and nothing can move.
          </Alert>
          <Alert tone="danger" title="Payment didn't go through" icon="cross">
            Nothing was charged. Try UPI again — your sizes are still here.
          </Alert>
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          Tints are the semantic hue at 8% over white — derived with color-mix,
          not new hexes. Ink sits at 15.5–16.5:1 on all four.
        </p>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Skeleton loader</h3>
        <p className="t-caption mt-1">
          Sunken base · 12% accent sweep · 1.4s linear · matches the real card&apos;s geometry
        </p>
        <div className="mt-5 max-w-sm rounded-lg border border-hairline bg-surface p-5">
          <Skeleton rounded="lg" className="h-40 w-full" />
          <div className="mt-4">
            <SkeletonText lines={2} size="body" />
          </div>
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          Text skeletons use the line-height of the type they replace, so nothing
          shifts on load. Nothing shimmers past 10 seconds — after that the empty
          state or an error alert takes over.
        </p>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Empty state</h3>
        <p className="t-caption mt-1">
          32px glyph on a 72px tint plate · one primary action, one escape hatch
        </p>
        <div className="mt-5 rounded-lg border border-hairline bg-surface">
          <EmptyState
            icon="storefront"
            title="No campaigns yet"
            action={<Button>Request a quote</Button>}
            escape={<Button variant="ghost">How campaigns work</Button>}
          >
            When your first storefront opens, every order lands here — with the
            size breakdown your printer needs.
          </EmptyState>
        </div>
      </div>
    </div>
  );
}
