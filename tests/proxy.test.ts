import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

/**
 * NFR-2 at the routing layer.
 *
 * `/s/<slug>` is the internal rewrite target and must never be reachable as an
 * address. It was: the guard lived inside the storefront branch, and an apex
 * request returned early from the marketing branch before reaching it, so
 * `themerchhq.in/s/music-club` served that tenant's storefront on our own
 * domain — outside the subdomain the co-branding and metadata rules assume,
 * and with the internal slug exposed in the URL.
 */

const req = (host: string, path = "/") =>
  new NextRequest(`http://${host}${path}`, { headers: { host } });

describe("the internal storefront path is not an address", () => {
  it("404s on the apex, which is where it used to be served", () => {
    expect(proxy(req("themerchhq.in", "/s/music-club")).status).toBe(404);
  });

  it("404s on a tenant subdomain too, so it cannot be double-rewritten", () => {
    expect(
      proxy(req("music-club.themerchhq.in", "/s/music-club")).status,
    ).toBe(404);
  });

  it("404s for a nested path under it, not just the root", () => {
    expect(
      proxy(req("themerchhq.in", "/s/music-club/p/abc123")).status,
    ).toBe(404);
  });
});

describe("routing the surfaces it should serve", () => {
  it("rewrites a subdomain root to that tenant's storefront", () => {
    const res = proxy(req("music-club.themerchhq.in", "/"));
    expect(res.headers.get("x-middleware-rewrite")).toContain("/s/music-club");
  });

  it("carries the rest of the path through the rewrite", () => {
    const res = proxy(req("music-club.themerchhq.in", "/p/abc123"));
    expect(res.headers.get("x-middleware-rewrite")).toContain(
      "/s/music-club/p/abc123",
    );
  });

  it("leaves the marketing site alone", () => {
    const res = proxy(req("themerchhq.in", "/catalogue"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.status).toBe(200);
  });
});
