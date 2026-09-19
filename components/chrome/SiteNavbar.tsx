import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * Our own site. Horizontal lockup at 30px, no divider, one primary CTA.
 *
 * No client logo appears here without written permission, and never in a way
 * that implies endorsement.
 */

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-surface/95 backdrop-blur-[12px]">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-8"
      >
        <Link href="/" aria-label="The Merch HQ — home" className="flex items-center">
          <Logo variant="horizontal" tone="blue" width={161} alt="" priority />
        </Link>

        <ul className="ml-auto flex flex-wrap items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-4 py-[10px] text-[15px] font-medium text-ink no-underline transition-colors duration-150 ease-brand hover:bg-surface-hover hover:text-accent-deep hover:no-underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-[10px] text-[15px] font-medium text-ink-muted no-underline transition-colors duration-150 ease-brand hover:text-accent-deep hover:no-underline"
            >
              Organiser login
            </Link>
          </li>
        </ul>

        <ButtonLink
          href="/quote"
          size="sm"
        >
          Request a quote
        </ButtonLink>
      </nav>
    </header>
  );
}
