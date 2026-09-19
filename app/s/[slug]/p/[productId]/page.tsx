import { notFound } from "next/navigation";
import { ProductPlate } from "@/components/store/ProductPlate";
import { SizeChart } from "@/components/store/SizeChart";
import { Breadcrumb } from "@/components/ui/Navigation";
import { Alert } from "@/components/ui/Alert";
import { getStorefrontCampaign, orderingOpen } from "@/lib/storefront";
import { resolveTenant } from "@/lib/tenant";
import { BuyPanel } from "./BuyPanel";

/**
 * STO-5 — images, description, price, size selector and size chart.
 *
 * The size chart is rendered inline, on the page, never behind a modal: it is
 * the thing that prevents a reprint, and a buyer who has to open a dialog to
 * see it mostly doesn't.
 */
export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: PageProps<"/s/[slug]/p/[productId]">) {
  const { slug, productId } = await params;

  const tenant = await resolveTenant(slug);
  if (!tenant) notFound();

  const campaign = await getStorefrontCampaign(tenant.id);
  if (!campaign) notFound();

  const product = campaign.products.find((p) => p.id === productId);
  if (!product) notFound();

  const gate = orderingOpen(campaign, new Date());

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumb
        items={[
          { label: campaign.title, href: "/" },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <ProductPlate
            src={product.images[0]}
            alt={product.name}
            priority
          />
        </div>

        <div>
          <h1 className="t-h1 text-ink">{product.name}</h1>
          <p className="t-body-lg mt-4 max-w-[52ch] text-ink-muted">
            {product.description}
          </p>
          <p className="t-body-sm mt-3 text-ink-muted">{product.printSpec}</p>

          <div className="mt-8">
            {gate.open ? (
              <BuyPanel
                productName={product.name}
                variants={product.variants}
              />
            ) : (
              // STO-10 — no order path at all once closed.
              <Alert tone="info" title={gate.reason}>
                This product can no longer be ordered on this campaign.
              </Alert>
            )}
          </div>
        </div>
      </div>

      {product.sizeChart.length > 0 ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="t-h3 text-ink">Size chart</h2>
          <p className="t-body mt-2 max-w-[62ch] text-ink-muted">
            Measured flat, in centimetres (STO-6). Lay a garment you already own
            flat and compare — it is more reliable than a size label.
          </p>
          <div className="mt-6">
            <SizeChart rows={product.sizeChart} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
