/**
 * Which surface a request belongs to, decided from the Host header alone.
 *
 * PRD §6: three surfaces, one codebase, routed by hostname.
 *
 *   themerchhq.in            marketing
 *   themerchhq.in/dashboard  organiser  (path, not host)
 *   themerchhq.in/ops        staff      (path, not host)
 *   <slug>.themerchhq.in     storefront
 *
 * Kept pure so the routing decision is testable without a request.
 */

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "themerchhq.in";

/**
 * Subdomains that are never a tenant slug. `OPS-1` validates a slug as unique,
 * lowercase and DNS-safe on save; this list is the other half of that — the
 * names a tenant may never take, because they either already mean something or
 * would be mistaken for us.
 */
export const RESERVED_SLUGS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "ops",
  "dashboard",
  "staff",
  "mail",
  "email",
  "smtp",
  "static",
  "assets",
  "cdn",
  "img",
  "images",
  "status",
  "help",
  "support",
  "blog",
  "shop",
  "store",
  "merch",
  "themerchhq",
]);

export type Surface =
  | { kind: "marketing" }
  | { kind: "storefront"; slug: string };

/**
 * Resolve a Host header.
 *
 * Handles the local development equivalents too: `localhost:3000` is the
 * marketing site and `music.localhost:3000` is that tenant's storefront, so the
 * multi-tenant path is exercised in development rather than only in production.
 */
export function resolveSurface(host: string | null | undefined): Surface {
  if (!host) return { kind: "marketing" };

  // Strip the port, and any IPv6 brackets.
  const name = host.split(":")[0].replace(/^\[|\]$/g, "").toLowerCase().trim();
  if (!name) return { kind: "marketing" };

  const base = localBase(name) ?? platformBase(name) ?? ROOT_DOMAIN;

  if (name === base) return { kind: "marketing" };
  if (!name.endsWith(`.${base}`)) return { kind: "marketing" };

  const sub = name.slice(0, -(base.length + 1));

  // Only a single label is a tenant: `a.b.themerchhq.in` is not a storefront.
  if (!sub || sub.includes(".")) return { kind: "marketing" };
  if (RESERVED_SLUGS.has(sub)) return { kind: "marketing" };
  if (!isSlugShaped(sub)) return { kind: "marketing" };

  return { kind: "storefront", slug: sub };
}

/** Local development: `localhost` and `127.0.0.1`. */
function localBase(name: string): string | null {
  if (name === "localhost" || name.endsWith(".localhost")) return "localhost";
  return null;
}

/**
 * Preview deployments are served from a platform domain with a generated
 * hostname; they are the marketing site, not a tenant called `merch-hq-abc123`.
 */
function platformBase(name: string): string | null {
  if (name.endsWith(".vercel.app")) return name;
  if (name === "127.0.0.1" || name === "0.0.0.0") return name;
  return null;
}

/**
 * OPS-1 — lowercase, DNS-safe. Letters, digits and internal hyphens only, 2–63
 * characters, which is the label limit DNS itself enforces.
 */
export function isSlugShaped(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])$/.test(slug);
}

/** Is this slug both well-formed and not reserved? Used by ops on save. */
export function isSlugAvailableShape(slug: string): boolean {
  return isSlugShaped(slug) && !RESERVED_SLUGS.has(slug);
}
