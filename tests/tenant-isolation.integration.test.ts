import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * NFR-2 — the deploy gate.
 *
 * "An automated test asserts that tenant A's order returns 404 on tenant B's
 * subdomain. Runs on every deploy."
 *
 * `tests/tenant-scope.test.ts` proves the scoping *logic* with no database and
 * runs everywhere. This file proves the same property against real Postgres,
 * through the real Prisma client, which is what the PRD asks to gate deploys.
 *
 * It needs a database, so it skips when `DATABASE_URL` is absent — a developer
 * without one still gets a green local run. **CI must set `DATABASE_URL`**, and
 * the guard below fails the run if CI is set but the database is not, so the
 * gate can never silently pass by being skipped.
 */

const HAS_DB = Boolean(process.env.DATABASE_URL);
const IS_CI = process.env.CI === "true" || process.env.CI === "1";

describe("NFR-2 is not silently skipped in CI", () => {
  it("CI provides a database for the isolation gate", () => {
    if (IS_CI) {
      expect(
        HAS_DB,
        "DATABASE_URL must be set in CI — NFR-2 gates every deploy and cannot be skipped",
      ).toBe(true);
    }
  });
});

describe.skipIf(!HAS_DB)("NFR-2 — cross-tenant access returns 404", () => {
  type Ctx = {
    a: { id: string; orderId: string };
    b: { id: string };
    forTenant: (id: string) => {
      order: {
        findUnique: (a: unknown) => Promise<unknown>;
        findMany: (a: unknown) => Promise<unknown[]>;
        count: (a?: unknown) => Promise<number>;
      };
    };
    cleanup: () => Promise<void>;
  };

  let ctx: Ctx;

  beforeAll(async () => {
    const { forTenant, staffDb } = await import("@/lib/db");
    const db = staffDb();

    const mk = async (slug: string) =>
      db.tenant.create({
        data: {
          slug,
          name: slug,
          type: "club",
          contactName: "Test",
          contactPhone: "+910000000000",
          contactEmail: `${slug}@example.test`,
          status: "active",
        },
      });

    const stamp = Date.now();
    const a = await mk(`iso-a-${stamp}`);
    const b = await mk(`iso-b-${stamp}`);

    const campaign = await db.campaign.create({
      data: {
        tenantId: a.id,
        title: "Isolation",
        description: "",
        opensAt: new Date(),
        closesAt: new Date(Date.now() + 86_400_000),
        deliveryEstimate: new Date(Date.now() + 10 * 86_400_000),
        collectionInstructions: "",
      },
    });

    const order = await db.order.create({
      data: {
        tenantId: a.id,
        campaignId: campaign.id,
        buyerName: "Priya",
        phone: "+919999999999",
        email: "priya@example.test",
        identifier: "2022B4A70123G",
        subtotal: 89_900,
        tax: 10_788,
        total: 100_688,
        pickupCode: `MHQ-${stamp.toString().slice(-4)}`,
      },
    });

    ctx = {
      a: { id: a.id, orderId: order.id },
      b: { id: b.id },
      forTenant: forTenant as unknown as Ctx["forTenant"],
      cleanup: async () => {
        await db.tenant.deleteMany({
          where: { id: { in: [a.id, b.id] } },
        });
      },
    };
  });

  afterAll(async () => {
    await ctx?.cleanup();
  });

  it("tenant A can read its own order", async () => {
    const order = await ctx
      .forTenant(ctx.a.id)
      .order.findUnique({ where: { id: ctx.a.orderId } });
    expect(order).not.toBeNull();
  });

  it("tenant B gets null for tenant A's order — the 404 case", async () => {
    const order = await ctx
      .forTenant(ctx.b.id)
      .order.findUnique({ where: { id: ctx.a.orderId } });
    // Null is what the page turns into notFound(), i.e. 404 rather than 403:
    // a 403 would confirm the order exists.
    expect(order).toBeNull();
  });

  it("tenant B cannot reach it through findMany either", async () => {
    const orders = await ctx.forTenant(ctx.b.id).order.findMany({});
    expect(orders).toHaveLength(0);
  });

  it("tenant B cannot count tenant A's orders", async () => {
    expect(await ctx.forTenant(ctx.b.id).order.count()).toBe(0);
  });

  it("supplying tenant A's id in the filter does not widen tenant B's scope", async () => {
    const orders = await ctx
      .forTenant(ctx.b.id)
      .order.findMany({ where: { tenantId: ctx.a.id } });
    expect(orders).toHaveLength(0);
  });
});
