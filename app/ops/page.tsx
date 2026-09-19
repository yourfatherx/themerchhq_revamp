import type { Metadata } from "next";
import Link from "next/link";
import { Alert, StatusBadge } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { listTenants, usingSampleData, type OpsTenant } from "@/lib/ops-data";

/**
 * Staff read live data. Without this Next prerenders the page at build
 * time and the tenant list is frozen at whatever the database held when
 * the deploy ran — stale forever, with nothing to indicate it.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tenants — Ops",
  robots: { index: false, follow: false },
};

const STATUS_TONE = {
  lead: "warning",
  active: "success",
  archived: "neutral",
} as const;

const COLUMNS: ReadonlyArray<Column<OpsTenant>> = [
  {
    key: "name",
    header: "Tenant",
    render: (t) => (
      <span>
        <Link href={`/ops/tenants/${t.id}`} className="font-medium">
          {t.name}
        </Link>
        <span className="figure t-caption block">{t.slug}.themerchhq.in</span>
      </span>
    ),
  },
  { key: "type", header: "Type", render: (t) => t.type },
  {
    key: "contact",
    header: "Contact",
    render: (t) => (
      <span>
        {t.contactName}
        <span className="t-caption block">{t.contactEmail}</span>
      </span>
    ),
  },
  {
    key: "accent",
    header: "Accent",
    render: (t) => (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-5 rounded-sm border border-hairline"
          style={{ background: t.accentColour }}
        />
        <span className="figure text-[13px]">{t.accentColour}</span>
      </span>
    ),
  },
  {
    key: "campaigns",
    header: "Campaigns",
    numeric: true,
    render: (t) => t.campaignCount,
  },
  {
    key: "status",
    header: "Status",
    render: (t) => (
      <StatusBadge tone={STATUS_TONE[t.status]}>{t.status}</StatusBadge>
    ),
  },
];

export default async function OpsTenantsPage() {
  const tenants = await listTenants();
  const leads = tenants.filter((t) => t.status === "lead");

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h2 text-ink">Tenants</h1>
          <p className="t-body-sm mt-2 text-ink-muted">
            {tenants.length} total ·{" "}
            <span className="figure">{leads.length}</span> waiting to be
            converted from a quote request.
          </p>
        </div>
        <ButtonLink
          href="/ops/tenants/new"
        >
          New tenant
        </ButtonLink>
      </div>

      {usingSampleData() ? (
        <div className="mt-6 max-w-[80ch]">
          <Alert tone="warning" title="Showing sample data">
            <code className="font-mono text-[13px]">DATABASE_URL</code> is not
            set, so these rows are representative, not real. Point it at a
            Postgres instance and this page reads live tenants.
          </Alert>
        </div>
      ) : null}

      <div className="mt-8 rounded-lg border border-hairline bg-surface">
        <DataTable
          caption="All tenants"
          columns={COLUMNS}
          rows={tenants}
          getRowKey={(t) => t.id}
          footer={
            <span className="figure">
              Showing {tenants.length} of {tenants.length}
            </span>
          }
        />
      </div>
    </main>
  );
}
