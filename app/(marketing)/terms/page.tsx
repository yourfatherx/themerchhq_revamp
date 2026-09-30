import type { Metadata } from "next";
import { LegalStub } from "@/components/marketing/LegalStub";

export const metadata: Metadata = {
  title: "Terms — The Merch HQ",
  description:
    "The terms a campaign runs under. The full text is not published yet.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalStub
      title="Terms"
      accent="of a campaign."
      standing="Two things a campaign already states before it opens: the minimum it needs before it prints, and what happens if it misses — the close date extends, or every order is refunded in full. Both are published on the storefront so buyers see them before they pay."
      covers={[
        "When a quote becomes an order, and what fixes the price",
        "The minimum order quantity, and the extend-or-refund policy in full",
        "The window a buyer has to change a size, and when it closes",
        "What happens if artwork is late, or approved and then changed",
        "Who owns the artwork, and what we may show as our own work",
        "Delivery, handover, and what counts as delivered",
      ]}
    />
  );
}
