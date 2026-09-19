import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * Resolution Blue panel · white lockup · links in Lavender at 8.01:1 · four
 * columns collapsing to two, then one.
 *
 * This is our own footer. On a client storefront the footer is theirs — see
 * `StorefrontFooterMark`.
 */

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/catalogue", label: "Catalogue" },
      { href: "/catalogue#gifting", label: "Corporate gifting" },
      { href: "/catalogue#campus", label: "Campus campaigns" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      // MKT-5: the organiser's way in lives in the footer.
      { href: "/dashboard", label: "Organiser login" },
      { href: "/quote", label: "Request a quote" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo variant="horizontal" tone="white" width={180} alt="" />
            <p className="t-body-sm mt-5 max-w-[46ch] text-white/70">
              Merch and gifting for colleges, clubs and companies. We host the
              storefront, collect the orders and the money, and hand you the
              numbers.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-[14px] font-semibold text-white/60">{col.heading}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="t-body-sm text-white/70 no-underline hover:text-surface"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-[14px] font-semibold text-white/60">Talk to a human</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:hello@themerchhq.in"
                  className="t-body-sm text-white/70 no-underline hover:text-surface"
                >
                  hello@themerchhq.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+918047182200"
                  className="figure t-body-sm text-white/70 no-underline hover:text-surface"
                >
                  +91 80 4718 2200
                </a>
              </li>
              <li className="t-body-sm text-white/70">Bengaluru · Tiruppur</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
          <p className="t-body-sm text-white/70">© 2026 The Merch HQ</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/gst", label: "GST & invoicing" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="t-body-sm text-white/70 no-underline hover:text-surface"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

/**
 * What we are allowed to put on a client's storefront footer: the horizontal
 * lockup at 120px and one line. Nothing else — the page is theirs.
 */
export function StorefrontFooterMark() {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <Logo variant="horizontal" tone="blue" width={120} alt="" />
      <p className="t-body-sm text-ink-muted">Storefront by The Merch HQ</p>
    </div>
  );
}
