import { cn } from "@/lib/cn";

/**
 * Sunken base, 12% accent sweep, 1.4s linear.
 *
 * A skeleton matches the real element's geometry exactly, and a text skeleton
 * uses the line-height of the type it replaces, so nothing shifts on load.
 *
 * Nothing shimmers past 10 seconds — after that the empty state or an error
 * alert takes over. That is the caller's job; this component only draws.
 */
export function Skeleton({
  className,
  rounded = "md",
}: {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}) {
  const radius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  return (
    <span
      aria-hidden="true"
      className={cn("block bg-surface-sunken mhq-shimmer", radius, className)}
    />
  );
}

/** Text lines at the line-height of the type they stand in for. */
export function SkeletonText({
  lines = 3,
  size = "body",
}: {
  lines?: number;
  size?: "body" | "body-sm" | "h3";
}) {
  const geometry = {
    body: { h: 16, gap: "gap-[9px]" }, // 16px × 1.55
    "body-sm": { h: 14, gap: "gap-[7px]" }, // 14px × 1.50
    h3: { h: 27, gap: "gap-[5px]" }, // 27px × 1.18
  }[size];

  return (
    <span className={cn("flex flex-col", geometry.gap)}>
      {Array.from({ length: lines }, (_, i) => (
        // The bar is the glyph height; the gap carries the leading, so the
        // block occupies exactly the space the real text will.
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "mhq-shimmer block rounded-sm bg-surface-sunken",
            i === lines - 1 ? "w-3/5" : "w-full",
          )}
          style={{ height: geometry.h }}
        />
      ))}
    </span>
  );
}
