import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteNavbar } from "@/components/chrome/SiteNavbar";

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
    <>
      <SiteNavbar />
      <div className="grow">{children}</div>
      <SiteFooter />
    </>
  );
}
