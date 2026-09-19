import "server-only";

import { cache } from "react";
import { forTenant } from "./db";
import type { Paise } from "./money";
import { resolveGstRate } from "./tax";

/**
 * Every read here goes through `forTenant()`. Nothing in the storefront can
 * reach another tenant's data, because nothing here can express a query that
 * is not scoped (NFR-1).
 */

export type StorefrontVariant = {
  id: string;
  size: string;
  colour: string | null;
  retired: boolean;
  /** Base price plus this variant's delta. */
  price: Paise;
};

export type StorefrontProduct = {
  id: string;
  name: string;
  description: string;
  printSpec: string;
  basePrice: Paise;
  images: string[];
  variants: StorefrontVariant[];
  sizeChart: Array<{ size: string; chestCm: number; lengthCm: number }>;
  taxRateBasisPoints: number | null;
};

export type StorefrontCampaign = {
  id: string;
  title: string;
  description: string;
  opensAt: Date;
  closesAt: Date;
  deliveryEstimate: Date;
  collectionInstructions: string;
  moq: number;
  moqFailurePolicy: "extend" | "refund";
  status: "draft" | "live" | "closed" | "in_production" | "delivered" | "archived";
  disclosureText: string | null;
  taxRateBasisPoints: number | null;
  /** Paid orders only — an abandoned checkout is not a unit anybody prints. */
  orderedUnits: number;
  products: StorefrontProduct[];
};

/**
 * The campaign a storefront shows.
 *
 * A tenant has at most one campaign a buyer can see at a time. `draft` is
 * included so staff can preview it at the live URL (OPS-6); the caller decides
 * whether the viewer is allowed to see a draft.
 */
export const getStorefrontCampaign = cache(
  async (
    tenantId: string,
    { includeDraft = false }: { includeDraft?: boolean } = {},
  ): Promise<StorefrontCampaign | null> => {
    const db = forTenant(tenantId);

    const campaign = await db.campaign.findFirst({
      where: {
        status: includeDraft
          ? { in: ["draft", "live", "closed", "in_production", "delivered"] }
          : { in: ["live", "closed", "in_production", "delivered"] },
      },
      orderBy: { closesAt: "desc" },
      include: {
        products: {
          where: { published: true },
          orderBy: { basePrice: "desc" },
          include: {
            // Sorted in garment order below, not here — alphabetical would put
            // 2XL first and S in the middle.
            variants: true,
            sizeChart: true,
          },
        },
        orders: {
          where: { paymentStatus: "paid" },
          select: { items: { select: { qty: true } } },
        },
      },
    });

    if (!campaign) return null;

    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      opensAt: campaign.opensAt,
      closesAt: campaign.closesAt,
      deliveryEstimate: campaign.deliveryEstimate,
      collectionInstructions: campaign.collectionInstructions,
      moq: campaign.moq,
      moqFailurePolicy: campaign.moqFailurePolicy,
      status: campaign.status,
      disclosureText: campaign.disclosureText,
      taxRateBasisPoints: campaign.taxRateBasisPoints,
      orderedUnits: campaign.orders.reduce(
        (n, o) => n + o.items.reduce((m, i) => m + i.qty, 0),
        0,
      ),
      products: campaign.products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        printSpec: p.printSpec,
        basePrice: p.basePrice as Paise,
        images: p.images,
        taxRateBasisPoints: resolveGstRate(p, campaign),
        variants: [...p.variants]
          .sort((a, b) => sizeRank(a.size) - sizeRank(b.size))
          .map((v) => ({
            id: v.id,
            size: v.size,
            colour: v.colour,
            retired: v.retired,
            price: (p.basePrice + v.priceDelta) as Paise,
          })),
        sizeChart: readChart(p.sizeChart?.measurements),
      })),
    };
  },
);

/**
 * Garment order, not alphabetical.
 *
 * Sorting sizes as strings puts 2XL first and S in the middle, which reads as a
 * broken control. Anything unrecognised sorts to the end rather than being
 * dropped — a one-size cap or a custom label still has to appear.
 */
const SIZE_ORDER = [
  "3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL",
  "ONE SIZE", "FREE SIZE",
];

export function sizeRank(size: string): number {
  const i = SIZE_ORDER.indexOf(size.trim().toUpperCase());
  return i === -1 ? SIZE_ORDER.length : i;
}

/** Size chart rows are stored as JSON; this is the one place that shape is read. */
function readChart(
  measurements: unknown,
): Array<{ size: string; chestCm: number; lengthCm: number }> {
  if (!Array.isArray(measurements)) return [];
  return measurements.flatMap((row) => {
    if (typeof row !== "object" || row === null) return [];
    const r = row as Record<string, unknown>;
    if (
      typeof r.size !== "string" ||
      typeof r.chestCm !== "number" ||
      typeof r.lengthCm !== "number"
    ) {
      return [];
    }
    return [{ size: r.size, chestCm: r.chestCm, lengthCm: r.lengthCm }];
  });
}

/**
 * PAY-11 / STO-8 / STO-10 — whether the storefront may take an order right now.
 *
 * Enforced server-side, never by hiding a button. Every write path calls this
 * before touching an order; the UI calls it only to decide what to render.
 */
export function orderingOpen(
  campaign: Pick<StorefrontCampaign, "status" | "opensAt" | "closesAt">,
  now: Date = new Date(),
): { open: true } | { open: false; reason: string } {
  if (campaign.status !== "live") {
    return { open: false, reason: "This storefront is closed." };
  }
  if (now < campaign.opensAt) {
    return { open: false, reason: "This storefront has not opened yet." };
  }
  if (now >= campaign.closesAt) {
    return { open: false, reason: "This storefront has closed." };
  }
  return { open: true };
}
