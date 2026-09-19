import { NextResponse, type NextRequest } from "next/server";
import { resolveSurface } from "@/lib/hostname";

/**
 * Hostname routing (STO-1).
 *
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` and the named export to
 * `proxy`. It runs on the Node runtime, which is not configurable.
 *
 * A storefront request is rewritten to `/s/<slug>/…` internally. The slug never
 * appears in the URL a buyer sees — their storefront lives at the root of their
 * own subdomain — and no page reads the Host header for itself, so there is one
 * place where tenancy enters the request.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // `/s/<slug>` is an internal target, never an address. It is refused here,
  // before the surface is resolved, because the apex returns early below —
  // with this check inside the storefront branch, a request to
  // `themerchhq.in/s/music-club` took the marketing path and was served the
  // storefront at a URL that should not exist. Also stops double-rewriting.
  if (url.pathname.startsWith("/s/")) {
    return new NextResponse(null, { status: 404 });
  }

  const surface = resolveSurface(request.headers.get("host"));

  if (surface.kind === "marketing") {
    return NextResponse.next();
  }

  url.pathname = `/s/${surface.slug}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Everything except Next's own assets and static files. The storefront needs
   * the rewrite on every page and route handler it serves.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"],
};
