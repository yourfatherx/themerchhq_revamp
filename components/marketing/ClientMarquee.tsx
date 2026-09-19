import { cn } from "@/lib/cn";

/**
 * The "Made for" strip.
 *
 * The reference's logo marquee with `+` separators, but carrying the kinds of
 * buyer rather than their marks: client logos appear only with written
 * permission, never implying endorsement and never reproduced in our blue.
 * Real logos replace these slots one at a time, as permission is given.
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

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <p className="t-body-sm text-ink-muted">Made for</p>
      </div>

      <div className="mhq-marquee mt-6 flex overflow-hidden">
        <Row />
        <Row aria-hidden />
      </div>

      <div className="mx-auto mt-8 max-w-[1280px] px-5 sm:px-8">
        <p className="t-caption max-w-[70ch]">
          Client logos appear only with written permission, never in our blue.
        </p>
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
