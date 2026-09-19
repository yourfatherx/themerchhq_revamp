/**
 * NFR-1 — a query that is not tenant-scoped must not be expressible.
 *
 * This module is the whole mechanism, kept pure so it can be proven correct
 * without a database. `lib/db.ts` feeds every Prisma operation through
 * `scopeArgs` via a client extension; nothing else may construct a client.
 */

/**
 * Models that carry a denormalised `tenantId` column. Every one of them gets a
 * filter injected on read and a value stamped on write.
 */
export const TENANT_SCOPED = new Set([
  "Campaign",
  "Product",
  "Variant",
  "SizeChart",
  "Order",
  "OrderItem",
  "Payout",
  "TenantUser",
]);

/**
 * `Tenant` is scoped by its own primary key rather than a `tenantId` column, so
 * it is handled separately but is still never readable across tenants.
 */
export const TENANT_ROOT = "Tenant";

/**
 * Deliberately unscoped. `StaffUser` is the only actor permitted to read across
 * tenants and is reachable solely through `staffDb()`. `AuditLog` carries a
 * nullable `tenantId` because gateway webhooks write rows with no tenant in
 * context; it is written through a dedicated append-only helper, never read by
 * a tenant-facing page.
 */
export const UNSCOPED = new Set(["StaffUser", "AuditLog"]);

/** Reads whose `where` must be narrowed. */
const READ_OPS = new Set([
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

/**
 * `findUnique` accepts only unique fields in `where`, so an extra `tenantId`
 * is rejected by Prisma. These are rewritten to their `findFirst` equivalent,
 * which accepts arbitrary filters and returns the same shape.
 */
const UNIQUE_READ_REWRITE: Record<string, string> = {
  findUnique: "findFirst",
  findUniqueOrThrow: "findFirstOrThrow",
};

/** Mutations whose `where` must be narrowed. */
const WHERE_MUTATIONS = new Set([
  "update",
  "updateMany",
  "delete",
  "deleteMany",
]);

/** Mutations whose `data` must carry the tenant. */
const CREATE_OPS = new Set(["create", "createMany", "createManyAndReturn"]);

export type ScopeResult = {
  /** The operation to run — may differ from the one requested. */
  operation: string;
  args: Record<string, unknown>;
};

export class UnscopedQueryError extends Error {
  constructor(model: string, operation: string) {
    super(
      `Refusing to run "${operation}" on "${model}" without a tenant. ` +
        `Use forTenant(tenantId), or staffDb() under an authenticated staff role.`,
    );
    this.name = "UnscopedQueryError";
  }
}

/**
 * Narrow one Prisma operation to a single tenant.
 *
 * Throws rather than silently passing through on an unrecognised operation
 * against a scoped model: a new Prisma verb we have not considered must fail
 * loudly, not leak.
 */
export function scopeArgs(
  model: string | undefined,
  operation: string,
  args: Record<string, unknown>,
  tenantId: string,
): ScopeResult {
  if (!model) throw new UnscopedQueryError("(raw)", operation);
  if (UNSCOPED.has(model)) return { operation, args };

  if (model === TENANT_ROOT) return scopeTenantRoot(operation, args, tenantId);
  if (!TENANT_SCOPED.has(model)) return { operation, args };

  const rewritten = UNIQUE_READ_REWRITE[operation];
  if (rewritten) {
    return {
      operation: rewritten,
      args: { ...args, where: and(args.where, { tenantId }) },
    };
  }

  if (READ_OPS.has(operation) || WHERE_MUTATIONS.has(operation)) {
    return { operation, args: { ...args, where: and(args.where, { tenantId }) } };
  }

  if (CREATE_OPS.has(operation)) {
    return { operation, args: { ...args, data: stamp(args.data, tenantId) } };
  }

  if (operation === "upsert") {
    return {
      operation,
      args: {
        ...args,
        where: and(args.where, { tenantId }),
        create: stamp(args.create, tenantId),
        update: args.update,
      },
    };
  }

  throw new UnscopedQueryError(model, operation);
}

/** The tenant row itself: readable only by its own id. */
function scopeTenantRoot(
  operation: string,
  args: Record<string, unknown>,
  tenantId: string,
): ScopeResult {
  const rewritten = UNIQUE_READ_REWRITE[operation];
  if (rewritten) {
    return {
      operation: rewritten,
      args: { ...args, where: and(args.where, { id: tenantId }) },
    };
  }
  if (READ_OPS.has(operation) || WHERE_MUTATIONS.has(operation)) {
    return { operation, args: { ...args, where: and(args.where, { id: tenantId }) } };
  }
  // A tenant is created by staff, never from inside a tenant context.
  throw new UnscopedQueryError(TENANT_ROOT, operation);
}

/**
 * Combine the caller's filter with ours using AND, so a caller cannot widen the
 * scope by supplying their own `tenantId` — both conditions must hold, and a
 * conflicting pair matches nothing.
 */
function and(
  where: unknown,
  ours: Record<string, string>,
): Record<string, unknown> {
  if (where == null) return ours;
  return { AND: [where as Record<string, unknown>, ours] };
}

/** Stamp the tenant onto created rows, for both single and batch creates. */
function stamp(data: unknown, tenantId: string): unknown {
  if (Array.isArray(data)) {
    return data.map((row) => ({ ...(row as object), tenantId }));
  }
  return { ...(data as object), tenantId };
}
