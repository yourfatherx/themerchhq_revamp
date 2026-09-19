import { notFound } from "next/navigation";
import { CampaignBadge } from "@/components/store/CampaignBadge";
import { Countdown, MoqProgress } from "@/components/store/Countdown";
import { ProductCard } from "@/components/store/ProductCard";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStorefrontCampaign, orderingOpen } from "@/lib/storefront";
import { resolveTenant } from "@/lib/tenant";

/**
 * STO-2 — the campaign landing page.
 *
 * Dynamic, never cached: the countdown (STO-3) and MOQ progress (STO-4) are
 * both "as of this page load", and a cached copy would show a buyer a close
 * date that has already passed.
 */
export const dynamic = "force-dynamic";

const IST = "Asia/Kolkata";

const longDate = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IST,
    hour12: false,
  }).format(d);

const shortDate = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    timeZone: IST,
  }).format(d);

export default async function StorefrontHome({
  params,
}: PageProps<"/s/[slug]">) {
  const { slug } = await params;
  const tenant = await resolveTenant(slug);
  if (!tenant) notFound();

  const campaign = await getStorefrontCampaign(tenant.id);
  if (!campaign) {
    return (
      <main className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <EmptyState icon="storefront" title="Nothing open right now">
          {tenant.name} doesn&apos;t have a campaign running. When the next one
          opens, it will be here.
        </EmptyState>
      </main>
    );
  }

  // Server time. The buyer's device clock never enters this (STO-3).
  const now = new Date();
  const gate = orderingOpen(campaign, now);

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="t-h1 max-w-[16ch] text-ink">{campaign.title}</h1>
          <p className="t-body-lg mt-5 max-w-[56ch] text-ink-muted">
            {campaign.description}
          </p>

          {!gate.open ? (
            // STO-10 — read-only once closed. There is no order path at all,
            // not merely a hidden button.
            <div className="mt-8 max-w-[62ch]">
              <Alert tone="info" title={gate.reason}>
                {campaign.status === "closed" ||
                campaign.status === "in_production" ? (
                  <>
                    Orders are with the printer. Collection details are below,
                    and everyone who ordered gets a message the day it&apos;s
                    ready.
                  </>
                ) : (
                  <>Nothing can be ordered right now.</>
                )}
              </Alert>
            </div>
          ) : null}
        </div>

        <div className="space-y-8 rounded-xl bg-surface-sunken p-6 sm:p-8">
          <Countdown
            closesAt={campaign.closesAt}
            now={now}
            closesAtLabel={`${longDate(campaign.closesAt)} IST`}
          />

          {campaign.moq > 0 ? (
            <div className="border-t border-hairline pt-8">
              <MoqProgress
                ordered={campaign.orderedUnits}
                required={campaign.moq}
                tierNote="everyone drops to the next price"
              />
            </div>
          ) : null}

          <dl className="space-y-4 border-t border-hairline pt-8">
            <div>
              <dt className="text-[13px] font-medium text-ink-muted">Delivery</dt>
              <dd className="figure t-body mt-1 text-ink">
                Around {shortDate(campaign.deliveryEstimate)}
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-ink-muted">Collection</dt>
              <dd className="t-body-sm mt-1 text-ink">
                {campaign.collectionInstructions}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="t-h2 text-ink">The drop</h2>
          {gate.open ? (
            <CampaignBadge state="open">Open</CampaignBadge>
          ) : (
            <CampaignBadge state="closed">Closed</CampaignBadge>
          )}
        </div>

        {campaign.products.length === 0 ? (
          <div className="mt-8 rounded-lg border border-hairline">
            <EmptyState icon="tee" title="Nothing listed yet">
              The products for this campaign are still being set up.
            </EmptyState>
          </div>
        ) : (
          // Tight column gutter, generous row gutter — the plates read as one
          // run of product rather than as separated cards.
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
            {campaign.products.map((p, i) => {
              const live = p.variants.filter((v) => !v.retired);
              const colours = [
                ...new Set(live.map((v) => v.colour).filter((c) => c !== null)),
              ];
              const sizes = new Set(live.map((v) => v.size)).size;

              return (
                <ProductCard
                  key={p.id}
                  href={`/p/${p.id}`}
                  name={p.name}
                  price={p.basePrice}
                  colour={colours[0]}
                  colours={colours}
                  facts={[p.printSpec, `${sizes} ${sizes === 1 ? "size" : "sizes"}`]}
                  priority={i === 0}
                  unavailable={!gate.open}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-20 max-w-[76ch]">
        <h2 className="t-h3 text-ink">Before you order</h2>
        <dl className="mt-8 space-y-8">
          <Faq q="When does this close?">
            <span className="figure">{longDate(campaign.closesAt)} IST</span>.
            Nothing can be ordered after that — production starts the next
            morning.
          </Faq>

          {campaign.moq > 0 ? (
            <Faq q={`What happens if it doesn't reach ${campaign.moq} units?`}>
              {campaign.moqFailurePolicy === "extend"
                ? "The close date is extended and everyone already in keeps their order and their price."
                : "Every order is refunded in full, automatically. Nothing prints at a loss and nobody has to ask."}
            </Faq>
          ) : null}

          <Faq q="Can I change my size?">
            Yes — for 24 hours after you pay, or until the storefront closes,
            whichever comes first. You do it yourself from the link in your
            confirmation. Nobody needs to be asked.
          </Faq>

          <Faq q="Where do I collect it?">{campaign.collectionInstructions}</Faq>

          <Faq q="Who am I paying?">
            The Merch HQ, directly — by UPI, card or netbanking. Not{" "}
            {tenant.name}, and not an individual&apos;s account.
          </Faq>

          {/* PYO-2 — mandatory on the storefront when the payee is an
              individual. Rendered here, never buried. */}
          {campaign.disclosureText ? (
            <Faq q="Does anyone earn from this?">
              {campaign.disclosureText}
            </Faq>
          ) : null}
        </dl>
      </section>
    </main>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="t-h4 text-ink">{q}</dt>
      <dd className="t-body mt-2 text-ink-muted">{children}</dd>
    </div>
  );
}
