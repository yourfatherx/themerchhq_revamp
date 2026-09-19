import "server-only";

import { cache } from "react";
import { databaseConfigured, staffDb } from "./db";
import { isSlugAvailableShape } from "./hostname";

/**
 * Resolving a slug to a tenant is the one lookup that cannot itself be tenant-
 * scoped — it is what *establishes* the tenant. It is therefore deliberately
 * narrow: it selects only the fields a storefront chrome needs, never orders or
 * buyer data, and it is the single place `staffDb()` is used outside `/ops`.
 *
 * Everything downstream uses `forTenant(tenant.id)`.
 */

export type StorefrontTenant = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  accentColour: string;
};

/**
 * `cache` dedupes this within a single render pass, so a layout and a page
 * resolving the same slug hit the database once.
 */
export const resolveTenant = cache(
  async (slug: string): Promise<StorefrontTenant | null> => {
    // A malformed or reserved slug can never match a tenant, so it never
    // reaches the database.
    if (!isSlugAvailableShape(slug)) return null;
    if (!databaseConfigured()) return null;

    const tenant = await staffDb().tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        accentColour: true,
        status: true,
      },
    });

    // STO-1 — an unknown or archived slug is a 404, never a redirect and never
    // an empty storefront. A lead has no storefront either.
    if (!tenant || tenant.status !== "active") return null;

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      logoUrl: tenant.logoUrl,
      accentColour: tenant.accentColour,
    };
  },
);
