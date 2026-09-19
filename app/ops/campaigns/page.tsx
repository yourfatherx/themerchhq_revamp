import type { Metadata } from "next";
import Link from "next/link";
import { CampaignBadge, type CampaignState } from "@/components/store/CampaignBadge";
import { Alert } from "@/components/ui/Alert";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { listCampaigns, usingSampleData, type OpsCampaign } from "@/lib/ops-data";
import { formatINR } from "@/lib/money";

/**
 * Staff read live data. Without this Next prerenders the page at build
 * time and the tenant list is frozen at whatever the database held when
 * the deploy ran — stale forever, with nothing to indicate it.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campaigns — Ops",
  robots: { index: false, follow: false },
};

/** Lifecycle status → the badge the rest of the system already speaks. */
const BADGE: Record<OpsCampaign["status"], { state: CampaignState; label: string }> = {
  draft: { state: "closed", label: "Draft" },
  live: { state: "open", label: "Live" },
  closed: { state: "closed", label: "Closed" },
  in_production: { state: "inProduction", label: "In production" },
  delivered: { state: "moqMet", label: "Delivered" },
  archived: { state: "closed", label: "Archived" },
};

const COLUMNS: ReadonlyArray<Column<OpsCampaign>> = [
  {
    key: "title",
    header: "Campaign",
    render: (c) => (
      <span>
        <Link href={`/ops/campaigns/${c.id}`} className="font-medium">
          {c.title}
        </Link>
        <span className="t-caption block">{c.tenantName}</span>
      </span>
    ),
  },
  {
    key: "window",
    header: "Window",
    render: (c) => (
      <span className="figure text-[14px]">
        {c.opensAt} → {c.closesAt}
      </span>
    ),
  },
  {
    key: "moq",
    header: "MOQ",
    numeric: true,
    render: (c) =>
      c.moq === 0 ? (
        "—"
      ) : (
        <span className={c.ordered >= c.moq ? "text-state-success" : undefined}>
          {c.ordered} / {c.moq}
        </span>
      ),
  },
  { key: "units", header: "Units", numeric: true, render: (c) => c.units },
  {
    key: "gross",
    header: "Gross",
    numeric: true,
    render: (c) => formatINR(c.gross),
  },
  {
    key: "attention",
    header: "Needs a human",
    numeric: true,
    render: (c) => {
      const n = c.unmatchedPayments + c.ordersWithoutPayment;
      // OPS-10 — empty by default; populated rows are actionable.
      return n === 0 ? <span className="text-ink-muted">—</span> : n;
    },
  },
  {
    key: "status",
    header: "Status",
    render: (c) => (
      <CampaignBadge state={BADGE[c.status].state} inRow>
        {BADGE[c.status].label}
      </CampaignBadge>
    ),
  },
];

export default async function OpsCampaignsPage() {
  const campaigns = await listCampaigns();
  const needsAttention = campaigns.filter(
    (c) => c.unmatchedPayments + c.ordersWithoutPayment > 0,
  );

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <h1 className="t-h2 text-ink">Campaigns</h1>
      <p className="t-body-sm mt-2 text-ink-muted">
        {campaigns.length} across all tenants.
      </p>

      {usingSampleData() ? (
        <div className="mt-6 max-w-[80ch]">
          <Alert tone="warning" title="Showing sample data">
            <code className="font-mono text-[13px]">DATABASE_URL</code> is not
            set, so these rows are representative, not real.
          </Alert>
        </div>
      ) : null}

      {needsAttention.length > 0 ? (
        <div className="mt-6 max-w-[80ch]">
          <Alert
            tone="warning"
            title={`${needsAttention.length} campaign needs reconciliation`}
          >
            A payment with no matching order, or an order with no matching
            payment. Both mean somebody has paid and does not have a hoodie, or
            the reverse — neither resolves itself.
          </Alert>
        </div>
      ) : null}

      <div className="mt-8 rounded-lg border border-hairline bg-surface">
        <DataTable
          caption="All campaigns"
          columns={COLUMNS}
          rows={campaigns}
          getRowKey={(c) => c.id}
        />
      </div>
    </main>
  );
}
