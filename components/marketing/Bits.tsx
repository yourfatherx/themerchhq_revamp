import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The small repeating parts of the layout reference.
 *
 * The reference builds almost everything from three pieces: a bulleted label
 * above a heading, a bordered pill, and a filled circular button carrying an
 * arrow. They recur in every section, which is what makes the page read as one
 * system rather than a stack of unrelated blocks.
 *
 * Where the reference uses orange, these use the brand blue. That is the one
 * substitution made throughout: the layout is borrowed, the identity is not.
 */

/** The reference's "• THE BENEFIT". Sentence case, because ALL-CAPS at this
 *  size costs more legibility than the reference's version admits. */
export function Eyebrow({
  children,
  onDark,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[13px] font-medium",
        onDark ? "text-white/60" : "text-ink-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          onDark ? "bg-accent" : "bg-accent",
        )}
      />
      {children}
    </p>
  );
}

export function Chip({
  children,
  tone = "outline",
  className,
}: {
  children: React.ReactNode;
  tone?: "outline" | "solid" | "accent" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium whitespace-nowrap",
        tone === "outline" && "border border-hairline bg-surface text-ink",
        tone === "solid" && "bg-canvas text-ink",
        tone === "accent" && "bg-accent text-surface",
        tone === "dark" && "bg-ink text-surface",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The reference's circular arrow. It is a real control everywhere it appears,
 *  so it is a link or a button, never a decorative glyph beside a label. */
export function RoundLink({
  href,
  label,
  tone = "accent",
  className,
}: {
  href: string;
  label: string;
  tone?: "accent" | "ink" | "surface";
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-full transition-colors",
        "focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        tone === "accent" && "bg-accent text-surface hover:bg-brand-deep",
        tone === "ink" && "bg-ink text-surface hover:bg-ink-hover",
        tone === "surface" &&
          "border border-hairline bg-surface text-ink hover:bg-surface-hover",
        className,
      )}
    >
      <Arrow />
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-[18px]", className)}
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The rounded slab every section sits inside. The page ground shows around it,
 *  which is what gives the reference its card-on-canvas rhythm. */
export function Slab({
  children,
  tone = "surface",
  className,
}: {
  children: React.ReactNode;
  tone?: "surface" | "ink";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 sm:p-10",
        tone === "surface" ? "bg-surface" : "bg-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
