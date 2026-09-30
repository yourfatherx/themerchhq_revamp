import type { Metadata } from "next";
import { LegalStub } from "@/components/marketing/LegalStub";

export const metadata: Metadata = {
  title: "Privacy — The Merch HQ",
  description:
    "What we collect when you request a quote or order from a storefront. The full policy is not published yet.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <LegalStub
      title="Privacy"
      accent="and what we hold."
      standing="A quote request carries the contact details you type into it. A storefront order carries the buyer's name, size, an identifier the organiser asked for, and what they paid. We do not sell any of it."
      covers={[
        "What a quote request stores, and for how long",
        "What a storefront order stores, and who on the client side can see it",
        "The payment gateway's role, and what it holds rather than us",
        "How a buyer asks for their record to be corrected or removed",
        "Who we share data with to print and deliver a run",
      ]}
    />
  );
}
