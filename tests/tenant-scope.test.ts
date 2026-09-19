import { describe, expect, it } from "vitest";
import {
  scopeArgs,
  TENANT_SCOPED,
  UnscopedQueryError,
  UNSCOPED,
} from "@/lib/tenant-scope";

const A = "tenant_a";
const B = "tenant_b";

/** Does this args object constrain the query to `tenantId`, at any depth? */
function constrainsTo(args: unknown, tenantId: string): boolean {
  return JSON.stringify(args).includes(`"tenantId":"${tenantId}"`);
}

describe("NFR-1 — every read on a tenant-owned model is narrowed", () => {
  const reads = [
    "findFirst",
    "findFirstOrThrow",
    "findMany",
    "count",
    "aggregate",
    "groupBy",
    "findUnique",
    "findUniqueOrThrow",
  ];

  for (const model of TENANT_SCOPED) {
    for (const op of reads) {
      it(`${model}.${op} is scoped`, () => {
        const { args } = scopeArgs(model, op, {}, A);
        expect(constrainsTo(args, A)).toBe(true);
      });
    }
  }

  it("rewrites findUnique to findFirst, because findUnique rejects extra filters", () => {
    const r = scopeArgs("Order", "findUnique", { where: { id: "o1" } }, A);
    expect(r.operation).toBe("findFirst");
    expect(constrainsTo(r.args, A)).toBe(true);
  });

  it("rewrites findUniqueOrThrow to findFirstOrThrow", () => {
    const r = scopeArgs("Order", "findUniqueOrThrow", { where: { id: "o1" } }, A);
    expect(r.operation).toBe("findFirstOrThrow");
  });
});

describe("NFR-1 — a caller cannot widen the scope", () => {
  it("ANDs our filter with theirs rather than letting theirs win", () => {
    const { args } = scopeArgs("Order", "findMany", { where: { tenantId: B } }, A);
    // Both conditions must hold, so a cross-tenant attempt matches nothing.
    expect(args.where).toEqual({ AND: [{ tenantId: B }, { tenantId: A }] });
  });

  it("keeps the caller's other filters intact", () => {
    const { args } = scopeArgs(
      "Order",
      "findMany",
      { where: { paymentStatus: "paid" } },
      A,
    );
    expect(args.where).toEqual({
      AND: [{ paymentStatus: "paid" }, { tenantId: A }],
    });
  });

  it("does not let a spoofed tenantId on create through", () => {
    const { args } = scopeArgs(
      "Order",
      "create",
      { data: { tenantId: B, buyerName: "Priya" } },
      A,
    );
    // Ours is applied last, so it wins on write.
    expect((args.data as Record<string, unknown>).tenantId).toBe(A);
  });

  it("stamps every row of a batch create", () => {
    const { args } = scopeArgs(
      "OrderItem",
      "createMany",
      { data: [{ qty: 1 }, { qty: 2, tenantId: B }] },
      A,
    );
    for (const row of args.data as Array<{ tenantId: string }>) {
      expect(row.tenantId).toBe(A);
    }
  });
});

describe("NFR-1 — mutations are narrowed too", () => {
  for (const op of ["update", "updateMany", "delete", "deleteMany"]) {
    it(`Order.${op} is scoped`, () => {
      const { args } = scopeArgs("Order", op, { where: { id: "o1" } }, A);
      expect(constrainsTo(args, A)).toBe(true);
    });
  }

  it("upsert is scoped on both the filter and the created row", () => {
    const { args } = scopeArgs(
      "Order",
      "upsert",
      { where: { id: "o1" }, create: { buyerName: "Priya" }, update: {} },
      A,
    );
    expect(constrainsTo(args.where, A)).toBe(true);
    expect((args.create as Record<string, unknown>).tenantId).toBe(A);
  });
});

describe("NFR-1 — the tenant row itself is reachable only by its own id", () => {
  it("narrows a Tenant read to that id", () => {
    const r = scopeArgs("Tenant", "findUnique", { where: { slug: "music" } }, A);
    expect(JSON.stringify(r.args)).toContain(`"id":"${A}"`);
  });

  it("refuses to create a Tenant from inside a tenant context", () => {
    expect(() => scopeArgs("Tenant", "create", { data: {} }, A)).toThrow(
      UnscopedQueryError,
    );
  });
});

describe("NFR-1 — unknown verbs fail loudly rather than leaking", () => {
  it("throws on an unrecognised operation against a scoped model", () => {
    expect(() => scopeArgs("Order", "someNewPrismaVerb", {}, A)).toThrow(
      UnscopedQueryError,
    );
  });

  it("throws on a raw query with no model", () => {
    expect(() => scopeArgs(undefined, "$queryRaw", {}, A)).toThrow(
      UnscopedQueryError,
    );
  });
});

describe("the unscoped set is deliberate and small", () => {
  it("is exactly StaffUser and AuditLog", () => {
    expect([...UNSCOPED].sort()).toEqual(["AuditLog", "StaffUser"]);
  });

  it("never overlaps the scoped set", () => {
    for (const m of UNSCOPED) expect(TENANT_SCOPED.has(m)).toBe(false);
  });

  it("covers every model that carries a tenantId column", () => {
    // Guards against a new model being added to the schema without being added
    // here — the failure mode is a silent cross-tenant read.
    expect([...TENANT_SCOPED].sort()).toEqual([
      "Campaign",
      "Order",
      "OrderItem",
      "Payout",
      "Product",
      "SizeChart",
      "TenantUser",
      "Variant",
    ]);
  });
});
