import type { Metadata } from "next";
import { LegalStub } from "@/components/marketing/LegalStub";

export const metadata: Metadata = {
  title: "GST & invoicing — The Merch HQ",
  description:
    "How GST is charged and invoiced on a run. The full note is not published yet.",
  robots: { index: false, follow: false },
};

export default function GstPage() {
  return (
    <LegalStub
      title="GST"
      accent="and invoicing."
      standing="Catalogue prices are shown before GST, and GST is added separately on the invoice rather than folded into the per-unit price. Every buyer on a storefront gets a GST invoice for what they paid."
      covers={[
        "The rate charged on each category, and why apparel and paper differ",
        "Whether your organisation is invoiced, or each buyer is",
        "What a client needs to give us to claim input credit",
        "How rounding is applied to the tax line on an invoice",
        "What changes when a campaign is refunded after invoicing",
      ]}
    />
  );
}
