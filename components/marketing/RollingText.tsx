import { cn } from "@/lib/cn";

/**
 * A label whose letters roll up and are replaced from below when its parent
 * `group` is hovered or keyboard-focused.
 *
 * Each letter is two stacked copies in a one-line window; the pair slides up by
 * exactly one line. The stagger is capped so the last letter starts by 90ms and
 * every letter runs 200ms — the whole roll finishes inside the 300ms motion
 * ceiling, however long the label.
 *
 * The visual letters are hidden from assistive technology and the real label is
 * given once, whole, so a screen reader never spells the word out. Reduced
 * motion is handled by the global rule in globals.css: the transition collapses
 * and the swap is instant, which leaves the label looking unchanged.
 */
export function RollingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const letters = [...text];
  const step = letters.length > 1 ? Math.min(12, 90 / (letters.length - 1)) : 0;

  return (
    <span className={cn("relative inline-flex leading-[1.2]", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {letters.map((ch, i) => {
          // A space has no glyph to roll: a fixed gap, sized to match the
          // opened-up word spacing of the surrounding text.
          if (ch === " ") return <span key={i} className="inline-block w-[0.4em]" />;
          const glyph = ch;
          const delay = { transitionDelay: `${Math.round(i * step)}ms` };
          const move =
            "block h-[1.2em] leading-[1.2] transition-transform duration-200 ease-brand group-hover:-translate-y-full group-focus-visible:-translate-y-full";
          return (
            <span key={i} className="relative inline-block h-[1.2em] overflow-hidden">
              <span className={move} style={delay}>
                {glyph}
              </span>
              <span className={cn(move, "absolute inset-x-0 top-full")} style={delay}>
                {glyph}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
