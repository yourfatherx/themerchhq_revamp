import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";

/**
 * themerchhq.in — the public marketing surface (MKT-1…MKT-5).
 *
 * Our own chrome: we lead here, and no client logo appears without written
 * permission. The storefront surface has its own layout, because there the
 * client leads.
 */
export default function MarketingLayout({
  children,
}: LayoutProps<"/">) {
  return (
    // Instrument Sans sets a narrow word space (2px at 12px), and the tight
    // tracking this layout uses closes it further; small uppercase labels
    // started reading as one word. Opened up here rather than globally so the
    // storefront and ops surfaces are unchanged.
    <div className="flex grow flex-col [word-spacing:0.12em]">
      <SiteHeader />
      <div className="grow">{children}</div>
      <SiteFooter />
    </div>
  );
}
