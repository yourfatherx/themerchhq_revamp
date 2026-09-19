import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";

/**
 * A client storefront. 76px tall.
 *
 * The client's logo sits here at full size and ours is absent from the header
 * entirely — on their storefront, the client leads (STO-8, and the brand book's
 * co-branding rule). Our mark appears once, in the footer.
 *
 * The countdown lives in the navbar because it is the single most
 * decision-relevant fact on the page.
 *
 * Every accent here resolves from `--color-accent`, which the storefront root
 * overrides from `tenant.accent_colour`. The cart count is an accent pill,
 * never a red dot: nothing is wrong, there are simply two things in the bag.
 */
export function StorefrontNavbar({
  tenantName,
  campaignTitle,
  logoSrc,
  /** Pre-formatted server-side, e.g. "2 days left" — no client clock (STO-3). */
  timeLeftLabel,
  cartCount = 0,
  links = DEFAULT_LINKS,
}: {
  tenantName: string;
  campaignTitle: string;
  logoSrc?: string;
  timeLeftLabel?: string;
  cartCount?: number;
  links?: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-surface/95 backdrop-blur-[12px]">
      <nav
        aria-label="Storefront"
        className="mx-auto flex min-h-[76px] max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8"
      >
        <Link href="/" className="flex items-center gap-3 no-underline hover:no-underline">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={tenantName}
              width={44}
              height={44}
              className="size-11 rounded-md object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-md bg-accent text-[15px] font-semibold text-surface"
            >
              {initials(tenantName)}
            </span>
          )}
          <span>
            <span className="block text-[15px] font-semibold text-ink">
              {tenantName}
            </span>
            <span className="t-caption block">{campaignTitle}</span>
          </span>
        </Link>

        <ul className="ml-auto flex flex-wrap items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-4 py-[10px] text-[15px] font-medium text-ink no-underline transition-colors duration-150 ease-brand hover:bg-surface-hover hover:text-accent-deep hover:no-underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {timeLeftLabel ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-tint px-4 py-2 text-[14px] font-medium text-accent-deep">
            <Icon name="clock" size={16} />
            <span className="figure">{timeLeftLabel}</span>
          </span>
        ) : null}

        <Link
          href="/cart"
          aria-label={`Your order — ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-ink no-underline",
            "transition-colors duration-150 ease-brand hover:bg-surface-hover hover:no-underline",
          )}
        >
          <Icon name="kit" size={24} />
          {cartCount > 0 ? (
            <span className="figure grid min-w-6 place-items-center rounded-full bg-accent px-2 py-[2px] text-[13px] text-surface">
              {cartCount}
            </span>
          ) : null}
        </Link>
      </nav>
    </header>
  );
}

const DEFAULT_LINKS = [
  { href: "/", label: "The drop" },
  { href: "/sizing", label: "Sizing" },
  { href: "/order", label: "My order" },
] as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
