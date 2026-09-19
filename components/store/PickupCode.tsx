/**
 * The one number a buyer has to keep (PAY-10).
 *
 * Inter 500 tabular, letter-spaced, on a blue plate. Format `MHQ-XXXX`: four
 * characters after the prefix, collision-checked, never sequential.
 *
 * A volunteer at a collection desk types it, reads it aloud and matches it
 * against a printed list — so the generator avoids the character pairs people
 * mishear. That generation rule lives server-side; this component only
 * displays, and never reformats or re-cases what it is given.
 */
export function PickupCode({ code }: { code: string }) {
  return (
    <div className="rounded-lg bg-accent-deep px-6 py-7 text-center">
      <p className="text-[13px] font-medium text-white/70">Show this at collection</p>
      <p
        className="figure mt-3 text-[34px] leading-none text-surface"
        style={{ letterSpacing: "0.08em" }}
      >
        {code}
      </p>
      <p className="t-body-sm mt-4 text-white/70">
        Also sent on WhatsApp and email
      </p>
    </div>
  );
}
