import { cn } from "@/lib/cn";

/**
 * The "Made for" strip.
 *
 * The reference's logo marquee with `+` separators, but carrying the kinds of
 * buyer rather than their marks. Real logos replace these slots one at a time,
 * as permission is given — and the rule governing that has not gone anywhere
 * just because it is no longer printed under the strip: client logos appear
 * only with written permission, never implying endorsement, and never
 * reproduced in our blue. Read this before adding a mark to SLOTS.
 *
 * The section's name is carried by a visually hidden heading rather than a
 * label above the track. The strip reads as what it is without being announced,
 * but removing the heading too would leave the section unnamed for anyone
 * navigating by landmark.
 *
 * The strip scrolls only when the viewer has not asked for reduced motion; the
 * content is duplicated so the loop has no visible seam, and the duplicate is
 * hidden from assistive technology.
 */

const SLOTS = [
  "Student club",
  "Fest team",
  "Department",
  "HR / People Ops",
  "Alumni cell",
] as const;

export function ClientMarquee() {
  return (
    <section
      aria-labelledby="made-for"
      className="border-b border-hairline bg-surface py-10"
    >
      <h2 id="made-for" className="sr-only">
        Made for
      </h2>

      <div className="mhq-marquee flex overflow-hidden">
        <Row />
        <Row aria-hidden />
      </div>
    </section>
  );
}

function Row({ "aria-hidden": hidden }: { "aria-hidden"?: boolean }) {
  return (
    <ul
      aria-hidden={hidden}
      className={cn(
        "mhq-marquee-track flex shrink-0 items-center gap-10 pr-10",
      )}
    >
      {SLOTS.map((s) => (
        <li key={s} className="flex items-center gap-10 whitespace-nowrap">
          {/* Grey, not blue. A real client logo will arrive in the client's
              own colour; anything beside it has to stay out of the way. */}
          <span className="t-h4 text-ink-muted">{s}</span>
          <span aria-hidden="true" className="text-[22px] text-hairline-strong">
            +
          </span>
        </li>
      ))}
    </ul>
  );
}
