import { Alert } from "@/components/ui/Alert";

/**
 * A published route that admits it is not written yet.
 *
 * The footer has linked to /privacy, /terms and /gst since it was built and
 * all three 404'd. A 404 from your own footer is worse than a short page, so
 * these exist — but a stub carrying invented legalese would be worse than
 * either. Nobody can review terms they think are already written, and a reader
 * cannot tell draft policy from real policy once it is laid out like policy.
 *
 * So each page states the position it can state truthfully, says plainly that
 * the full text is not published, and names someone to ask. Anything a page
 * asserts here is already asserted elsewhere on the site.
 *
 * Every one of these sets `robots: { index: false }` in its own metadata.
 * Unreviewed legal text should not be the first result for a search that pairs
 * this company with the word "terms".
 */
export function LegalStub({
  title,
  accent,
  standing,
  covers,
}: {
  title: string;
  /** The lower-case italic half of the headline. */
  accent: string;
  /** What we can say truthfully today, in one or two sentences. */
  standing: string;
  /** What the full text will set out, once written. */
  covers: readonly string[];
}) {
  return (
    <main className="bg-surface pb-16">
      <header className="px-4 pt-10 pb-8 sm:px-5 lg:pt-14">
        <h1 className="max-w-[20ch] text-[clamp(32px,2.2vw+24px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
          {title}{" "}
          <em className="font-normal tracking-[-0.03em] normal-case">
            {accent}
          </em>
        </h1>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
          {standing}
        </p>
      </header>

      <section className="border-t border-hairline px-4 pt-10 sm:px-5">
        <div className="max-w-[70ch]">
          <Alert tone="info" title="This page is a placeholder, not a policy">
            The full text has not been written or reviewed yet. Nothing here is
            a term you can rely on. If you need the answer before we publish it,
            ask us directly and we will put it in writing for your run.
          </Alert>
        </div>

        <div className="mt-10 max-w-[70ch]">
          <h2 className="text-[18px] leading-[1.25] font-medium tracking-[-0.03em] text-ink">
            What it will cover
          </h2>
          <ul className="mt-4 space-y-2">
            {covers.map((c) => (
              <li
                key={c}
                className="border-b border-hairline pb-2 text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted"
              >
                {c}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
            Ask us at{" "}
            <a href="mailto:hello@themerchhq.in">hello@themerchhq.in</a> or{" "}
            <a href="tel:+918047182200" className="figure">
              +91 80 4718 2200
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
