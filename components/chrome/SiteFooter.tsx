import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * White ground · link columns on the left · the lockup set large on the right.
 *
 * The oversized closing mark is the layout's signature, but our mark is placed
 * artwork, not type, so it is shown whole and never cropped by the page edge,
 * with its clear space kept on every side. It never renders above its native
 * 1062px width, so it is never upscaled past the artwork's resolution.
 *
 * Headings are ink, links Ink Gray (6.58:1 on white). Four link columns at
 * desktop, two below.
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
  {
    heading: "Talk to a human",
    links: [
      { href: "mailto:hello@themerchhq.in", label: "hello@themerchhq.in" },
      { href: "tel:+918047182200", label: "+91 80 4718 2200" },
    ],
    note: "Bengaluru · Tiruppur",
  },
  {
    heading: "The small print",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/gst", label: "GST & invoicing" },
    ],
  },
] as const;

const linkClass =
  "text-[14px] font-medium tracking-[-0.01em] text-ink-muted no-underline transition-opacity duration-150 ease-brand hover:text-ink-muted hover:no-underline hover:opacity-70";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="flex flex-col gap-16 px-5 pt-20 pb-10 lg:flex-row lg:items-end lg:gap-16 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 lg:shrink-0">
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
                {col.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) =>
                  l.href.startsWith("/") ? (
                    <li key={l.href}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <a href={l.href} className={linkClass}>
                        {l.label}
                      </a>
                    </li>
                  ),
                )}
                {"note" in col ? (
                  <li className="text-[14px] tracking-[-0.01em] text-ink-muted">{col.note}</li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>

        {/* Clear space: the padding around the artwork is never less than its
            cap height, so nothing in the row above can crowd it. */}
        <div className="flex min-w-0 grow justify-end">
          <Logo
            variant="horizontal"
            tone="blue"
            width={1062}
            alt="The Merch HQ"
            className="h-auto w-full max-w-[1062px] p-[2.2%]"
          />
        </div>
      </div>

      <p className="border-t border-hairline px-5 py-5 text-[13px] text-ink-muted">
        © 2026 The Merch HQ
      </p>
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
