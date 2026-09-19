import { cn } from "@/lib/cn";

/** A 2.5px ring with a transparent top edge, spinning at 700ms linear.
 *  Inherits `currentColor`, so it reads on any ground it is placed on. */
export function Spinner({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("block shrink-0 animate-spin rounded-full", className)}
      style={{
        width: size,
        height: size,
        border: "2.5px solid currentColor",
        borderTopColor: "transparent",
        animationDuration: "700ms",
        animationTimingFunction: "linear",
      }}
    />
  );
}
