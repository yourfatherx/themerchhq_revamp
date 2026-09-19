import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/brand/Icon";
import { CampaignBadge } from "@/components/store/CampaignBadge";
import { MoqProgress } from "@/components/store/Countdown";
import { SizeChart } from "@/components/store/SizeChart";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCampaign, nextTransitions } from "@/lib/ops-data";
import { formatINR } from "@/lib/money";

export const metadata: Metadata = {
  title: "Campaign — Ops",
  robots: { index: false, follow: false },
};

/** Representative production spread. Phase 4 reads this from order items. */
const SPREAD = [
  { size: "S", chestCm: 52, lengthCm: 68, ordered: 6 },
  { size: "M", chestCm: 55, lengthCm: 70, ordered: 14 },
  { size: "L", chestCm: 58, lengthCm: 72, ordered: 21 },
  { size: "XL", chestCm: 61, lengthCm: 74, ordered: 15 },
  { size: "2XL", chestCm: 64, lengthCm: 76, ordered: 6 },
];

export default async function OpsCampaignPage({
  params,
}: PageProps<"/ops/campaigns/[id]">) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const transitions = nextTransitions(campaign.status);
  const reconciliationRows =
    campaign.unmatchedPayments + campaign.ordersWithoutPayment;

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="t-caption">{campaign.tenantName}</p>
          <h1 className="t-h2 mt-1 text-ink">{campaign.title}</h1>
          <p className="figure t-body-sm mt-2 text-ink-muted">
            {campaign.opensAt} → {campaign.closesAt} ·{" "}
            {campaign.tenantSlug}.themerchhq.in
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CampaignBadge
            state={campaign.status === "live" ? "open" : "closed"}
          >
            {campaign.status.replace("_", " ")}
          </CampaignBadge>
          {/* OPS-6 — a draft is previewable at its live URL with a staff session. */}
          <ButtonLink
            href={`/s/${campaign.tenantSlug}`}
            variant="secondary"
            size="sm"
          >
            Preview storefront
          </ButtonLink>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-lg border border-hairline bg-surface p-6">
            <h2 className="t-h4 text-ink">Production spread</h2>
            <p className="t-body-sm mt-1 text-ink-muted">
              Item by size by quantity — what goes to the printer (OPS-9).
            </p>
            <div className="mt-6">
              <SizeChart rows={SPREAD} showOrdered />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                leadingIcon={<Icon name="sizes" size={20} />}
              >
                Export size breakdown · CSV
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<Icon name="batch" size={20} />}
              >
                Export order lines · CSV
              </Button>
            </div>
          </section>

          <section className="rounded-lg border border-hairline bg-surface p-6">
            <h2 className="t-h4 text-ink">Payment reconciliation</h2>
            <p className="t-body-sm mt-1 text-ink-muted">
              Payments with no matching order, and orders with no matching
              payment (OPS-10).
            </p>

            {reconciliationRows === 0 ? (
              <EmptyState
                icon="tick"
                title="Nothing to reconcile"
                action={undefined}
              >
                Every payment on this campaign matches an order and every order
                matches a payment. This is the state it should be in.
              </EmptyState>
            ) : (
              <div className="mt-6">
                <Alert
                  tone="warning"
                  title={`${reconciliationRows} row needs a decision`}
                >
                  {campaign.ordersWithoutPayment > 0 ? (
                    <p>
                      <span className="figure">
                        {campaign.ordersWithoutPayment}
                      </span>{" "}
                      order has no matching payment — the buyer may have
                      abandoned checkout, or the webhook may not have arrived.
                    </p>
                  ) : null}
                  {campaign.unmatchedPayments > 0 ? (
                    <p className="mt-2">
                      <span className="figure">
                        {campaign.unmatchedPayments}
                      </span>{" "}
                      payment has no matching order. Somebody has paid and has
                      nothing recorded.
                    </p>
                  ) : null}
                </Alert>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-hairline bg-surface p-6">
            <h2 className="t-h4 text-ink">Where it stands</h2>
            <dl className="mt-5 space-y-4">
              <Stat label="Orders" value={String(campaign.ordered)} />
              <Stat label="Units" value={String(campaign.units)} />
              <Stat label="Gross" value={formatINR(campaign.gross)} />
            </dl>
            {campaign.moq > 0 ? (
              <div className="mt-6 border-t border-hairline pt-6">
                <MoqProgress ordered={campaign.ordered} required={campaign.moq} />
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-hairline bg-surface p-6">
            <h2 className="t-h4 text-ink">Lifecycle</h2>
            <p className="t-body-sm mt-1 text-ink-muted">
              Every move is an explicit action. Nothing advances past{" "}
              <span className="font-medium">closed</span> on its own (OPS-7).
            </p>

            {transitions.length === 0 ? (
              <p className="t-body-sm mt-5 text-ink-muted">
                This campaign is archived. There is nothing left to do.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                {transitions.map((t) => (
                  <div key={t.to}>
                    <Button
                      variant={t.destructive ? "destructive" : "primary"}
                      fullWidth
                    >
                      {t.label}
                    </Button>
                    {t.warning ? (
                      <p className="t-body-sm mt-2 text-ink-muted">
                        {t.warning}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="t-body-sm text-ink-muted">{label}</dt>
      <dd className="figure text-[18px] text-ink">{value}</dd>
    </div>
  );
}
