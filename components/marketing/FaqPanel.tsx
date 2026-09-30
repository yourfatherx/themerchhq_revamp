/**
 * The questions, as full-width rows on white.
 *
 * Built on `details`/`summary`, so it opens with no JavaScript, keyboard
 * behaviour and the disclosure role come for free, and a reader who lands here
 * from a search engine's "find in page" still gets the text. The first is open
 * so the pattern is legible without a click.
 *
 * Answers stay folded until asked for. Six answers on screen at once is a wall
 * of prose nobody reads.
 *
 * The chevron is local to this file rather than imported: the panel needs one
 * 14px glyph, and owning it is what let `Bits.tsx` go when the last page
 * stopped importing it. It rotates rather than swapping glyph, so there is one
 * mark for one state.
 */

export type FaqItem = { q: string; a: string };

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width={14} height={14}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqPanel({ items }: { items: readonly FaqItem[] }) {
  return (
    <section className="bg-surface px-4 py-14 sm:px-5 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h2 className="text-[clamp(32px,2.2vw+24px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
          Questions,{" "}
          <em className="font-normal tracking-[-0.03em] normal-case">answered.</em>
        </h2>
        <p className="text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
          The ones we get asked first.
        </p>
      </div>

      <div className="mt-10">
        {items.map((item, i) => (
          <details
            key={item.q}
            open={i === 0}
            className="group/row border-t border-hairline last:border-b"
          >
            {/* Two named groups, because they answer different elements. `open`
                lives on the <details>; focus lands on the <summary>, which is
                what is actually tabbed to. A single `group` on the <details>
                made the focus mirror dead code — `.group:focus-visible` waits
                for a focus the <details> never receives. */}
            <summary className="group/act flex cursor-pointer list-none items-center gap-5 py-5 marker:hidden">
              <span className="grow text-[18px] leading-[1.25] font-medium tracking-[-0.03em] text-ink sm:text-[20px]">
                {item.q}
              </span>

              {/* Mirrors on focus-visible, so the control answers a keyboard the
                  same way it answers a cursor. */}
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-hairline text-ink transition-colors duration-150 ease-brand group-hover/act:bg-ink group-hover/act:text-surface group-focus-visible/act:bg-ink group-focus-visible/act:text-surface"
              >
                <span className="block transition-transform duration-150 ease-brand group-open/row:-rotate-180 motion-reduce:transition-none">
                  <Chevron />
                </span>
              </span>
            </summary>

            <p className="max-w-[68ch] pb-6 text-[15px] leading-[1.5] tracking-[-0.01em] text-ink-muted">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
