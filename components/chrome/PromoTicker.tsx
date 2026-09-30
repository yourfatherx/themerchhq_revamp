/**
 * The strip above the navigation: our standing promises, on a loop.
 *
 * New Car blue with white type (6.49:1) — the one band of solid brand colour in
 * the chrome, so the identity reads before the logo does. Every line is a claim
 * the site already makes and the product already keeps; nothing is written here
 * for the strip's sake.
 *
 * Two identical tracks slide as one so the loop has no seam; the second is
 * hidden from assistive technology. The motion comes from the shared
 * `mhq-marquee` rules, which pause it on hover and hold it still for anyone who
 * has asked for reduced motion.
 */

const PROMISES = [
  "Live storefront in five working days",
  "One link for the whole group",
  "A GST invoice for every buyer",
  "Miss the minimum and nobody loses money",
  "No spreadsheet",
] as const;

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="mhq-marquee-track flex shrink-0 items-center"
    >
      {PROMISES.map((p) => (
        <li key={p} className="flex items-center">
          <span className="px-6 whitespace-nowrap">{p}</span>
          <span aria-hidden="true" className="text-white/60">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PromoTicker() {
  return (
    <div className="mhq-marquee flex h-9 overflow-hidden bg-brand text-[12px] font-medium tracking-[-0.01em] text-surface">
      <h2 className="sr-only">What every run includes</h2>
      <Track />
      <Track hidden />
    </div>
  );
}
