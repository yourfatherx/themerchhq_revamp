import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * Ink ground · the mascot set huge and bleeding off two edges · links right.
 *
 * This breaks the mark's own placement rule, which is that it is artwork and is
 * never cropped by a page edge, with clear space kept on all four sides. That
 * was a deliberate instruction, not an oversight: the whole point of the
 * composition is a mark too big for its box. It holds everywhere else — the
 * header, the storefront footer below, and any co-branded surface.
 *
 * Two things the bleed has to not do, and the layout is built around them:
 *
 *  - Never sit under type. The mascot is white and so is the text, so an
 *    overlap is not low contrast, it is invisible. The mark is confined to a
 *    left-hand gutter the columns never enter, and on small screens it gets a
 *    band of its own below everything else.
 *  - Never take the pointer. It is `aria-hidden` and `pointer-events-none`:
 *    decoration that swallows clicks meant for the links beside it.
 *
 * White on Chinese Black is 18.62:1. The labels and the closing line are white
 * at 60%, which composites to 7.17:1 on the same ground — both stated in
 * lib/tokens.ts.
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
      { href: "/inside-a-run", label: "Inside a run" },
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
  "text-[14px] tracking-[-0.01em] text-surface no-underline transition-opacity duration-150 ease-brand hover:text-surface hover:no-underline hover:opacity-60 focus-visible:opacity-60";

/** Tracked capitals, which is the reference's whole voice. Small enough that
 *  the tracking reads as a label rather than as shouting. */
const labelClass =
  "text-[11px] font-medium tracking-[0.14em] text-surface/60 uppercase";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-surface">
      {/* Bleeds past the left edge and below the bottom one. Sized in vw so the
          overhang stays proportional instead of swallowing a narrow screen. */}
      <Logo
        variant="mark"
        tone="white"
        width={727}
        alt=""
        className="pointer-events-none absolute -bottom-[7%] -left-[8%] z-0 h-auto w-[78vw] max-w-[320px] select-none lg:w-[38vw] lg:max-w-[560px]"
      />

      <div className="relative z-10 px-5 pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-12">
          {/* The gutter the mascot lives in. It is empty on purpose. */}
          <div aria-hidden="true" className="hidden lg:col-span-4 lg:block" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h2 className={labelClass}>{col.heading}</h2>
                <ul className="mt-4 space-y-2.5">
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
                    <li className="text-[14px] tracking-[-0.01em] text-surface/60">
                      {col.note}
                    </li>
                  ) : null}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Right-aligned, so the bottom-left stays clear for the mark to pass
          through on its way off the edge. */}
      <div className="relative z-10 mt-14 border-t border-white/15 px-5 py-4 lg:mt-24">
        <p className={`${labelClass} text-right`}>© 2026 The Merch HQ</p>
      </div>

      {/* Below the small-screen layout the mark has nothing to its right to sit
          beside, so it is given a band of its own rather than a column. */}
      <div aria-hidden="true" className="h-[200px] lg:hidden" />
    </footer>
  );
}

/**
 * What we are allowed to put on a client's storefront footer: the horizontal
 * lockup at 120px and one line. Nothing else — the page is theirs, and the
 * bleed above is ours alone.
 */
export function StorefrontFooterMark() {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <Logo variant="horizontal" tone="blue" width={120} alt="" />
      <p className="text-[14px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
        Storefront by The Merch HQ
      </p>
    </div>
  );
}
