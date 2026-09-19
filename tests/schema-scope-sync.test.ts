import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TENANT_ROOT, TENANT_SCOPED, UNSCOPED } from "@/lib/tenant-scope";

/**
 * The scoping module and the schema must not drift.
 *
 * Adding a model with a `tenantId` column and forgetting to register it in
 * `TENANT_SCOPED` produces a silent cross-tenant read — nothing errors, the
 * data is simply visible to the wrong tenant. This test makes that a build
 * failure instead.
 */

const schema = readFileSync(
  join(process.cwd(), "prisma/schema.prisma"),
  "utf8",
);

/** Every `model X { ... }` block, with its body. */
function models(): Map<string, string> {
  const out = new Map<string, string>();
  const re = /^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(schema))) out.set(m[1], m[2]);
  return out;
}

const ALL = models();

describe("schema and tenant-scope stay in sync", () => {
  it("finds every model in the schema", () => {
    expect(ALL.size).toBeGreaterThan(8);
  });

  it("every model with a non-nullable tenantId is registered as scoped", () => {
    const withTenantId = [...ALL.entries()]
      .filter(([, body]) => /^\s*tenantId\s+String\s*$/m.test(body))
      .map(([name]) => name);

    expect(withTenantId.length).toBeGreaterThan(0);
    for (const name of withTenantId) {
      expect(
        TENANT_SCOPED.has(name),
        `${name} has a tenantId column but is not in TENANT_SCOPED — it would be readable across tenants`,
      ).toBe(true);
    }
  });

  it("every registered scoped model actually has a tenantId column", () => {
    for (const name of TENANT_SCOPED) {
      const body = ALL.get(name);
      expect(body, `${name} is registered as scoped but is not in the schema`).toBeDefined();
      expect(
        /^\s*tenantId\s+String/m.test(body!),
        `${name} is registered as scoped but has no tenantId column`,
      ).toBe(true);
    }
  });

  it("accounts for every model — nothing is silently unclassified", () => {
    const classified = new Set([...TENANT_SCOPED, ...UNSCOPED, TENANT_ROOT]);
    for (const name of ALL.keys()) {
      expect(
        classified.has(name),
        `${name} is in the schema but neither scoped nor explicitly unscoped`,
      ).toBe(true);
    }
  });
});

describe("NFR-7 — no money field is a float", () => {
  it("uses Int for every money column", () => {
    const moneyFields =
      /^\s*(basePrice|priceDelta|subtotal|tax|total|unitPrice|taxAmount|amount|payoutValue)\s+(\w+)/gm;
    let m: RegExpExecArray | null;
    let found = 0;
    while ((m = moneyFields.exec(schema))) {
      found++;
      expect(m[2], `${m[1]} must be Int paise, found ${m[2]}`).toBe("Int");
    }
    expect(found).toBeGreaterThanOrEqual(8);
  });

  it("declares no Float or Decimal anywhere", () => {
    expect(schema).not.toMatch(/^\s*\w+\s+Float/m);
    expect(schema).not.toMatch(/^\s*\w+\s+Decimal/m);
  });
});

describe("PAY-6 — webhook idempotency is enforced by the database", () => {
  it("paymentRef is unique, so a replayed webhook collides", () => {
    const order = ALL.get("Order")!;
    expect(order).toMatch(/paymentRef\s+String\?\s+@unique/);
  });

  it("pickupCode is unique (PAY-10)", () => {
    expect(ALL.get("Order")!).toMatch(/pickupCode\s+String\s+@unique/);
  });
});
