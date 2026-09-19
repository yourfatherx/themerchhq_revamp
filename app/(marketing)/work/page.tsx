import type { Metadata } from "next";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { Icon } from "@/components/brand/Icon";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Work — The Merch HQ",
  description:
    "Campaigns we have run, with the units, the sizes and the dates they landed.",
};

/**
 * MKT-4 — case studies, content-managed so ops can add one without a developer.
 *
 * There are none yet, and this page says so rather than filling the space with
 * invented work. The first real campaign becomes the first case study; until
 * then the honest version of this page is more persuasive than a fabricated
 * one, and it is the only version that survives a client asking to be
 * introduced to a past customer.
 *
 * Phase 3 moves case studies to the database and this page reads them from
 * there; the empty state stays as the zero-case.
 */
const CASE_STUDIES: Array<{
  slug: string;
  client: string;
  campaign: string;
  units: number;
  summary: string;
}> = [];

export default function WorkPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="t-h1 mt-7 max-w-[18ch] text-ink">
          Campaigns, with the numbers attached
        </h1>
        <p className="t-body-lg mt-4 max-w-[64ch] text-ink-muted">
          Every case study here carries the units, the size spread and the date
          it was handed over — not a mood board.
        </p>

        {CASE_STUDIES.length === 0 ? (
          <div className="mt-14 rounded-xl border border-dashed border-hairline p-10 sm:p-14">
            <span className="grid size-[72px] place-items-center rounded-lg bg-accent-tint text-accent">
              <Icon name="storefront" size={32} />
            </span>
            <h2 className="t-h2 mt-7 max-w-[24ch] text-ink">
              We are running our first campaigns now
            </h2>
            <p className="t-body-lg mt-4 max-w-[62ch] text-ink-muted">
              Rather than dress this page with work we haven&apos;t done, it
              stays empty until there is a real run to show. If you want to see
              how a campaign is put together before you commit, we will walk you
              through a live storefront and the dashboard behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink
                href="/quote"
              >
                Be the first campaign
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary">
                How it works
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((c) => (
              <article key={c.slug}>{c.campaign}</article>
            ))}
          </div>
        )}
      </section>

      <CtaBlock />
    </main>
  );
}
