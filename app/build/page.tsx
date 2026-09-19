import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/brand/primitives";

/**
 * A build index, not the marketing home.
 *
 * The real `themerchhq.in` home page is Phase 2 and gets built from
 * `design/Screens.dc.html`. This placeholder exists so that opening the dev
 * server lands somewhere honest rather than on framework boilerplate.
 */

const SURFACES = [
  {
    href: "/tokens",
    title: "Tokens",
    body: "The palette, type scale, radii, elevation, primitives and icon set — with every contrast ratio computed at render time.",
    icon: "sizes",
  },
  {
    href: "/gallery",
    title: "Components",
    body: "Buttons, forms, selection, tables, navigation and feedback, each in the states it actually reaches.",
    icon: "dashboard",
  },
] as const;

export default function BuildIndex() {
  return (
    <main className="mx-auto w-full max-w-[880px] px-5 py-16 sm:px-8 sm:py-24">
      <Logo variant="horizontal" tone="blue" width={200} priority />

      <div className="mt-10">
        <Pill>Build index</Pill>
      </div>

      <h1 className="t-h1 mt-6 max-w-[18ch] text-ink">
        The design system, running
      </h1>
      <p className="t-body-lg mt-4 max-w-[64ch] text-ink-muted">
        Phase 0 and part of Phase 1 are in place. The marketing home, the
        campaign storefront, checkout and the organiser dashboard are later
        phases — this page is scaffolding and will be replaced by the real home
        page.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {SURFACES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-lg border border-hairline p-6 no-underline transition-all duration-150 ease-brand hover:border-accent hover:bg-surface-hover hover:no-underline"
          >
            <span className="grid size-12 place-items-center rounded-md bg-accent-tint text-accent">
              <Icon name={s.icon} size={24} />
            </span>
            <h2 className="t-h4 mt-5 flex items-center gap-2 text-ink">
              {s.title}
              <Icon
                name="arrow"
                size={20}
                className="text-accent transition-transform duration-150 ease-brand group-hover:translate-x-1"
              />
            </h2>
            <p className="t-body-sm mt-2 text-ink-muted">{s.body}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
