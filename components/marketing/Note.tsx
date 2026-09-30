import type { ReactNode } from "react";

/**
 * A qualifying fact, set aside from the page's argument.
 *
 * These were `Alert tone="info"` — a rounded, accent-tinted card with a blue
 * icon badge and a 3px accent rule. That component is right where it still
 * lives: an ops dashboard and a storefront gate need a notice that announces
 * itself and carries a semantic hue. On a marketing page it announced nothing
 * and just looked like a different website, which is what it was: it is still
 * built on the `t-*` type scale these pages left behind.
 *
 * So this is the same idea in the layout's own vocabulary — square, untinted,
 * on the page's own canvas ground, which is how `/quote` already sets its
 * "What happens next" panel aside. No hue, because nothing here is a state:
 * the operational colours are fenced out of marketing, and a blue box for a
 * sentence that is merely important spends the accent on nothing.
 *
 * Deliberately not a live region. Nothing here appears in response to an
 * action — it is page furniture, present on first paint, so announcing it
 * would interrupt a screen reader for text it is about to read anyway.
 */
export function Note({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="bg-canvas p-6">
      <h2 className="text-[18px] leading-[1.25] font-medium tracking-[-0.03em] text-ink">
        {title}
      </h2>
      <div className="mt-2 max-w-[68ch] text-[15px] leading-[1.5] tracking-[-0.01em] text-ink-muted">
        {children}
      </div>
    </aside>
  );
}
