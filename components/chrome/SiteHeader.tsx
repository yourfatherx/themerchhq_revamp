"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { RollingText } from "@/components/marketing/RollingText";
import { cn } from "@/lib/cn";
import { PromoTicker } from "./PromoTicker";

/**
 * Our site's header: the promise strip and one bar, fixed to the top.
 *
 * On the home page it sits over the hero with no ground of its own and white
 * type, so the photograph runs to the top edge. Everywhere else, and anywhere
 * below the top of the home page, it is white with ink type.
 *
 * It slides away while you read down the page and comes back the moment you
 * scroll up — a store whose way to the quote form disappears for the length of
 * the page is paying for its minimalism in enquiries.
 *
 * Over the hero the logo is the white lockup with nothing behind it, and on
 * white it is the blue lockup, likewise. It used to sit on a solid New Car
 * block over the hero, per the brand book's rule for logos on imagery; that
 * block read as a sticker on the photograph and has been dropped by decision.
 * What makes it safe is the hero's own scrim, which is never lighter than 62%
 * ink anywhere in the frame — the lockup is on a dark, even ground, not on the
 * picture. It is the only place in the system the logo is used this way.
 *
 * Pages other than home get a spacer of the header's height, so their first
 * line is never tucked underneath it.
 */

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/inside-a-run", label: "Inside a run" },
  { href: "/about", label: "About" },
] as const;

/** Ticker 36 + bar 64. The spacer and the hero both read this. */
export const HEADER_HEIGHT = 100;

/** `preview` renders the header in place — not fixed, no spacer — for the
 *  component gallery. */
export function SiteHeader({ preview = false }: { preview?: boolean }) {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuFor, setMenuFor] = useState(pathname);

  // A navigation closes the menu. Adjusting state during render, rather than
  // in an effect, avoids a frame with the old page's menu still open.
  if (menuFor !== pathname) {
    setMenuFor(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      // A few pixels of dead band so a trackpad's jitter does not flicker it.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > HEADER_HEIGHT);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const clear = overHero && atTop && !menuOpen && !preview;

  return (
    <>
      <header
        className={cn(
          preview
            ? "relative"
            : "fixed inset-x-0 top-0 z-50 transition-transform duration-[250ms] ease-brand",
          hidden && !menuOpen && "-translate-y-full",
        )}
      >
        <PromoTicker />

        <nav
          aria-label="Main"
          className={cn(
            "transition-colors duration-150 ease-brand",
            clear
              ? "bg-transparent text-surface"
              : "border-b border-hairline bg-surface text-ink",
          )}
        >
          <div className="flex h-16 items-center gap-4 px-4 sm:px-5">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="-ml-2 grid size-10 place-items-center rounded-full lg:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <MenuGlyph open={menuOpen} />
            </button>

            <Link
              href="/"
              aria-label="The Merch HQ — home"
              className="flex items-center py-2.5"
            >
              <Logo
                variant="horizontal"
                tone={clear ? "white" : "blue"}
                width={176}
                alt=""
                preload
              />
            </Link>

            <ul className="ml-6 hidden items-center gap-7 lg:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className="group text-[12px] font-medium tracking-[0.02em] text-current uppercase no-underline hover:text-current hover:no-underline"
                  >
                    <RollingText text={l.label} />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-5">
              <Link
                href="/dashboard"
                className="group hidden text-[12px] font-medium tracking-[0.02em] text-current uppercase no-underline hover:text-current hover:no-underline sm:inline-flex"
              >
                <RollingText text="Organiser login" />
              </Link>
              <Link
                href="/quote"
                className={cn(
                  // Below 640px there is no room beside the logo; the menu carries it.
                  "hidden h-10 items-center rounded-full border px-5 text-[14px] font-medium whitespace-nowrap no-underline transition-colors duration-150 ease-brand hover:no-underline sm:inline-flex",
                  clear
                    ? "border-white/80 text-surface hover:bg-surface hover:text-ink"
                    : "border-ink bg-ink text-surface hover:bg-ink-hover hover:text-surface",
                )}
              >
                Request a quote
              </Link>
            </div>
          </div>

          <div
            id="site-menu"
            hidden={!menuOpen}
            className="border-t border-hairline bg-surface px-4 pt-4 pb-8 text-ink lg:hidden"
          >
            <ul className="flex flex-col">
              {[
                ...LINKS,
                { href: "/dashboard", label: "Organiser login" },
                { href: "/quote", label: "Request a quote" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-3 text-[16px] font-medium tracking-[0.02em] text-ink uppercase no-underline hover:text-accent-deep hover:no-underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {overHero || preview ? null : (
        <div aria-hidden="true" style={{ height: HEADER_HEIGHT }} />
      )}
    </>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  const bar = "absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-150 ease-brand";
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-5">
      <span className={cn(bar, "top-0", open && "translate-y-[6px] rotate-45")} />
      <span className={cn(bar, "top-[6px]", open && "opacity-0")} />
      <span className={cn(bar, "top-3", open && "-translate-y-[6px] -rotate-45")} />
    </span>
  );
}
