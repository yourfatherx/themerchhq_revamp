import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontFooterMark } from "@/components/chrome/SiteFooter";
import { StorefrontNavbar } from "@/components/chrome/StorefrontNavbar";
import { getStorefrontCampaign, orderingOpen } from "@/lib/storefront";
import { resolveTenant } from "@/lib/tenant";

/**
 * A client storefront, reached only through the `proxy.ts` rewrite from
 * `<slug>.themerchhq.in`. The slug never appears in the URL a buyer sees.
 *
 * The client leads here (STO-8, and the brand book's co-branding rule): their
 * logo is in the header at full size, the page takes their accent colour, and
 * our mark appears once in the footer.
 *
 * `--color-accent` is overridden on this element and nowhere else. Every
 * commerce component reads that variable, so the whole surface re-themes from
 * one line.
 */
export const dynamic = "force-dynamic";

/**
 * The client leads on their own storefront — including in the browser tab and
 * in anything a buyer shares. Without this the root layout's "The Merch HQ —
 * Merch, handled." leaks onto their page, which is both confusing to a buyer
 * and a co-branding violation.
 *
 * Not indexed: campaigns are time-boxed and a closed storefront in search
 * results is worse than none.
 */
export async function generateMetadata({
  params,
}: LayoutProps<"/s/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await resolveTenant(slug);
  if (!tenant) return { title: "Not found", robots: { index: false } };

  const campaign = await getStorefrontCampaign(tenant.id);

  return {
    title: campaign ? `${campaign.title} — ${tenant.name}` : tenant.name,
    description: campaign?.description,
    robots: { index: false, follow: false },
    openGraph: {
      title: campaign ? `${campaign.title} — ${tenant.name}` : tenant.name,
      description: campaign?.description,
    },
  };
}

export default async function StorefrontLayout({
  children,
  params,
}: LayoutProps<"/s/[slug]">) {
  const { slug } = await params;
  const tenant = await resolveTenant(slug);

  // STO-1 — an unknown or archived slug returns 404.
  if (!tenant) notFound();

  const campaign = await getStorefrontCampaign(tenant.id);

  return (
    <div
      style={
        {
          "--color-accent": tenant.accentColour,
          "--color-accent-deep": tenant.accentColour,
        } as React.CSSProperties
      }
      className="flex min-h-full flex-col"
    >
      <StorefrontNavbar
        tenantName={tenant.name}
        campaignTitle={campaign?.title ?? "No campaign open"}
        logoSrc={tenant.logoUrl ?? undefined}
        timeLeftLabel={campaign ? timeLeft(campaign) : undefined}
      />
      <div className="grow">{children}</div>
      <StorefrontFooterMark />
    </div>
  );
}

/**
 * Server-rendered remaining time (STO-3) — computed here, not in the browser,
 * so a buyer whose device clock is wrong still sees the truth.
 */
function timeLeft(campaign: {
  status: Parameters<typeof orderingOpen>[0]["status"];
  opensAt: Date;
  closesAt: Date;
}): string | undefined {
  const now = new Date();
  if (!orderingOpen(campaign, now).open) return undefined;

  const ms = campaign.closesAt.getTime() - now.getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days} ${days === 1 ? "day" : "days"} left`;

  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `${hours} ${hours === 1 ? "hour" : "hours"} left`;

  return "Closes today";
}
