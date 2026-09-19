import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * The staff console (PRD §7.2), at themerchhq.in/ops.
 *
 * Deliberately plainer than the public surfaces: no hero type, no marketing
 * rhythm, denser rows. G4 targets campaign setup in under two hours of staff
 * time, so this is judged on how fast a campaign can be built, not on how it
 * photographs. It is still the same design system — the same tokens, the same
 * components — so nothing here needs its own maintenance.
 *
 * Phase 5 adds magic-link auth with a staff role in front of this.
 */

const NAV = [
  { href: "/ops", label: "Tenants" },
  { href: "/ops/campaigns", label: "Campaigns" },
  { href: "/ops/reconciliation", label: "Reconciliation" },
] as const;

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-hairline bg-surface">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
          <Link href="/ops" className="flex items-center gap-3 no-underline hover:no-underline">
            <Logo variant="mark" tone="blue" width={32} alt="" />
            <span className="t-label text-ink-muted">Ops console</span>
          </Link>

          <nav aria-label="Ops" className="flex flex-wrap items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3 py-2 text-[14px] font-medium text-ink no-underline hover:bg-surface-hover hover:text-accent-deep hover:no-underline"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <span className="t-caption ml-auto">Staff · not public</span>
        </div>
      </header>

      <div className="grow bg-surface-sunken">{children}</div>
    </div>
  );
}
