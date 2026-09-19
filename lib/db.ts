import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { scopeArgs } from "./tenant-scope";

/**
 * The only way to reach the database.
 *
 * NFR-1: the raw client is NOT exported. Application code gets either
 * `forTenant(tenantId)`, which cannot express an unscoped query, or
 * `staffDb()`, which is unscoped by design and is the one place a
 * cross-tenant read is permitted. `server-only` means importing any of this
 * from a client component is a build error, not a runtime leak.
 */

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run `neon link`, or copy .env.example to .env " +
        "and point it at a Postgres instance.",
    );
  }
  return hardenSsl(url);
}

/**
 * Pin `sslmode=verify-full`.
 *
 * `node-postgres` currently treats `require` as `verify-full`, but in pg v9 it
 * adopts libpq semantics, where `require` encrypts without verifying the
 * server's certificate — which is an unauthenticated channel a MITM can sit on.
 * Neon hands out `sslmode=require`, and that string is regenerated every time
 * `neon link` runs, so normalising it here is the only fix that survives.
 *
 * Buyer PII and payment references cross this connection (NFR-6).
 */
function hardenSsl(url: string): string {
  try {
    const u = new URL(url);
    const mode = u.searchParams.get("sslmode");
    if (mode === null || mode === "require" || mode === "prefer") {
      u.searchParams.set("sslmode", "verify-full");
    }
    return u.toString();
  } catch {
    // Not a parseable URL — hand it through and let the driver report why.
    return url;
  }
}

/**
 * Built lazily and cached across hot reloads. Constructing it at module load
 * would make every route that merely imports a type require a live database.
 */
let base: PrismaClient | undefined;

const globalForPrisma = globalThis as unknown as {
  __mhqPrisma?: PrismaClient;
};

function client(): PrismaClient {
  if (globalForPrisma.__mhqPrisma) return globalForPrisma.__mhqPrisma;
  if (!base) {
    base = new PrismaClient({
      adapter: new PrismaPg({ connectionString: connectionString() }),
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.__mhqPrisma = base;
    }
  }
  return base;
}

/**
 * A database handle that can only see one tenant.
 *
 * Every operation passes through `scopeArgs`, which narrows reads and
 * mutations to `tenantId` and stamps it onto writes. An operation it does not
 * recognise throws rather than passing through unscoped.
 */
export function forTenant(tenantId: string) {
  if (!tenantId) {
    throw new Error("forTenant() requires a tenant id.");
  }

  return client().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const scoped = scopeArgs(
            model,
            operation,
            args as Record<string, unknown>,
            tenantId,
          );
          // `scopeArgs` may rewrite findUnique to findFirst, which Prisma's
          // `query` callback cannot do on its own — so re-dispatch by name.
          if (scoped.operation !== operation) {
            const delegate = client() as unknown as Record<
              string,
              Record<string, (a: unknown) => Promise<unknown>>
            >;
            const key = model.charAt(0).toLowerCase() + model.slice(1);
            return delegate[key][scoped.operation](scoped.args);
          }
          return query(scoped.args);
        },
      },
    },
  });
}

/**
 * Unscoped access, for staff only.
 *
 * Named so that it is obvious in a diff and greppable in review. Every call
 * site must already have established an authenticated staff role — this
 * function does not check, because it has no request context; the caller does.
 */
export function staffDb(): PrismaClient {
  return client();
}

/** True when a database is configured, so pages can degrade rather than throw. */
export function databaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
