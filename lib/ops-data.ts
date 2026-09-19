import "server-only";

import { databaseConfigured, staffDb } from "./db";
import type { Paise } from "./money";

/**
 * Reads for the staff console.
 *
 * These are the legitimate cross-tenant reads, so they use `staffDb()`. Every
 * call site is behind `/ops`, which Phase 5 puts a staff-role magic link in
 * front of. Nothing here is reachable from a tenant-facing surface.
 */

export function usingSampleData(): boolean {
  return !databaseConfigured();
}

export type OpsTenant = {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: "lead" | "active" | "archived";
  contactName: string;
  contactEmail: string;
  accentColour: string;
  campaignCount: number;
};

export type OpsCampaign = {
  id: string;
  tenantName: string;
  tenantSlug: string;
  title: string;
  status:
    | "draft"
    | "live"
    | "closed"
    | "in_production"
    | "delivered"
    | "archived";
  opensAt: string;
  closesAt: string;
  moq: number;
  ordered: number;
  units: number;
  gross: Paise;
  /**
   * OPS-10. Only the orders-without-payment half is computable from our own
   * data. Detecting a *payment* with no matching order needs the gateway's
   * settlement list, which arrives with Razorpay in Phase 4 — so this stays 0
   * rather than reporting a clean reconciliation we have not actually done.
   */
  unmatchedPayments: number;
  ordersWithoutPayment: number;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

export async function listTenants(): Promise<OpsTenant[]> {
  if (!databaseConfigured()) return [];

  const rows = await staffDb().tenant.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      status: true,
      contactName: true,
      contactEmail: true,
      accentColour: true,
      _count: { select: { campaigns: true } },
    },
  });

  return rows.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    type: t.type,
    status: t.status,
    contactName: t.contactName,
    contactEmail: t.contactEmail,
    accentColour: t.accentColour,
    campaignCount: t._count.campaigns,
  }));
}

export async function listCampaigns(): Promise<OpsCampaign[]> {
  if (!databaseConfigured()) return [];

  const rows = await staffDb().campaign.findMany({
    orderBy: { closesAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      opensAt: true,
      closesAt: true,
      moq: true,
      tenant: { select: { name: true, slug: true } },
      orders: {
        select: {
          paymentStatus: true,
          total: true,
          items: { select: { qty: true } },
        },
      },
    },
  });

  return rows.map((c) => shape(c));
}

export async function getCampaign(id: string): Promise<OpsCampaign | null> {
  if (!databaseConfigured()) return null;

  const c = await staffDb().campaign.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
      opensAt: true,
      closesAt: true,
      moq: true,
      tenant: { select: { name: true, slug: true } },
      orders: {
        select: {
          paymentStatus: true,
          total: true,
          items: { select: { qty: true } },
        },
      },
    },
  });

  return c ? shape(c) : null;
}

type Row = {
  id: string;
  title: string;
  status: OpsCampaign["status"];
  opensAt: Date;
  closesAt: Date;
  moq: number;
  tenant: { name: string; slug: string };
  orders: Array<{
    paymentStatus: string;
    total: number;
    items: Array<{ qty: number }>;
  }>;
};

/** Only paid orders count toward MOQ, units and gross — an abandoned checkout
 *  is not a unit anybody is printing. */
function shape(c: Row): OpsCampaign {
  const paid = c.orders.filter((o) => o.paymentStatus === "paid");

  return {
    id: c.id,
    tenantName: c.tenant.name,
    tenantSlug: c.tenant.slug,
    title: c.title,
    status: c.status,
    opensAt: iso(c.opensAt),
    closesAt: iso(c.closesAt),
    moq: c.moq,
    ordered: paid.length,
    units: paid.reduce(
      (n, o) => n + o.items.reduce((m, i) => m + i.qty, 0),
      0,
    ),
    gross: paid.reduce((n, o) => n + o.total, 0) as Paise,
    unmatchedPayments: 0,
    ordersWithoutPayment: c.orders.filter(
      (o) => o.paymentStatus === "pending",
    ).length,
  };
}

/**
 * OPS-7 — the lifecycle. Transitions are explicit staff actions and there is no
 * automatic progression past `closed`, so this returns only what a human may do
 * next, never what will happen on its own.
 */
export function nextTransitions(status: OpsCampaign["status"]): Array<{
  to: OpsCampaign["status"];
  label: string;
  destructive?: boolean;
  warning?: string;
}> {
  switch (status) {
    case "draft":
      return [
        {
          to: "live",
          label: "Open the storefront",
          warning:
            "Buyers can order from the moment this is live. Payout config and the size chart must already be set.",
        },
      ];
    case "live":
      return [
        {
          to: "closed",
          label: "Close & send to production",
          destructive: true,
          warning:
            "Closing locks the sizing spread. Nobody can add to this campaign afterwards.",
        },
      ];
    case "closed":
      return [{ to: "in_production", label: "Mark in production" }];
    case "in_production":
      return [{ to: "delivered", label: "Mark delivered" }];
    case "delivered":
      return [{ to: "archived", label: "Archive" }];
    case "archived":
      return [];
  }
}
