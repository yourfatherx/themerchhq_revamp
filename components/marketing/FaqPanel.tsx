import { Arrow, Slab } from "./Bits";

/**
 * The questions, as the reference's FAQ panel.
 *
 * The reference sets an oversized wordmark-scale "FAQ" against a small
 * parenthetical, then a stack of rows carrying the question and a circular
 * control at the right. One row is shown open with its answer beneath.
 *
 * The reference also puts a `+` at the left of each row; ours does not. Two
 * glyphs for one state is one more than the row needs, and the circular control
 * already rotates — dropping the marker leaves the question starting at the
 * panel's own left edge, which is a cleaner column than one indented to clear
 * an icon.
 *
 * That last part is the reason this is a rewrite rather than a restyle: the
 * answers used to all be visible at once in a two-column list. Six answers on
 * screen at once is a wall of prose nobody reads, and it is not what the
 * reference does — the panel's whole shape assumes the answers are folded away
 * until asked for.
 *
 * Built on `details`/`summary`, so it opens with no JavaScript, keyboard
 * behaviour and the disclosure role come for free, and a reader who lands here
 * from a search engine's "find in page" still gets the text. The first is open
 * so the pattern is legible without a click.
 */

export type FaqItem = { q: string; a: string };

export function FaqPanel({ items }: { items: readonly FaqItem[] }) {
  return (
    <Slab className="lg:p-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          className="text-accent font-bold tracking-[-0.045em] leading-[0.85]"
          style={{ fontSize: "clamp(56px, 8vw, 112px)" }}
        >
          FAQ
        </h2>
        <p className="t-body-sm text-ink-muted lg:pb-3">
          (Answers to the questions we get first)
        </p>
      </div>

      <div className="mt-10">
        {items.map((item, i) => (
          <details
            key={item.q}
            open={i === 0}
            className="group border-t border-hairline last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-center gap-5 py-6 marker:hidden">
              <span className="t-h4 grow text-ink">{item.q}</span>

              <span
                aria-hidden="true"
                className="bg-accent text-surface group-open:bg-canvas group-open:text-ink grid size-9 shrink-0 place-items-center rounded-full transition-colors"
              >
                <span className="block rotate-90 transition-transform group-open:-rotate-90 motion-reduce:transition-none">
                  <Arrow size={16} />
                </span>
              </span>
            </summary>

            {/* Flush with the question now that nothing sits to its left —
                the indent existed to clear the marker, not as its own idea. */}
            <p className="t-body-sm max-w-[68ch] pt-1 pb-7 text-ink-muted">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </Slab>
  );
}
