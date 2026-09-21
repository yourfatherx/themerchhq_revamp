import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/brand/Icon";
import { Chip, Slab } from "@/components/marketing/Bits";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { categories, getCatalogue } from "@/content/catalogue";

export const metadata: Metadata = {
  title: "About — The Merch HQ",
  description:
    "We design and produce merch for colleges, clubs and companies, and give every client a storefront so their people order it themselves.",
};

/**
 * The About page, on the supplied consulting-page layout.
 *
 * Three block shapes carry it: a split slab with a stat row, the same split
 * reversed with a ticked list, and card grids under a split header. What the
 * reference fills those shapes with — a dated milestone history and two
 * portraits of consultants — is the one thing not borrowed. We have no dated
 * history beyond 2021, and an unlabelled face on an About page is read as
 * staff. So the grids carry the range and the principles, and the photographs
 * are the studio.
 *
 * The reference's first block *is* the page header, which is why this page has
 * no separate accent-rule header the way `/work` and `/how-it-works` do.
 *
 * Every number here is already published elsewhere on the site — 2021 in
 * `OfferBento`, the unit range and the reprint rate in `ProofRow`. This page
 * restates them; it does not introduce any.
 */

const INCLUDED = [
  "Your own subdomain",
  "We collect the money",
  "Per-order size selection",
  "Printed in-house",
  "GST invoice for every buyer",
  "Collection list at handover",
] as const;

const PRINCIPLES = [
  {
    icon: "clock",
    title: "Dependable, not corporate",
    body: "A real date on the quote and a message the day it ships. No portal, no ticket number, no account manager who has to check.",
  },
  {
    icon: "quote",
    title: "Plainspoken, not clever",
    body: "Plain words, real dates, exact numbers. We loosen the register for a club and tighten it for a procurement team, but never the facts.",
  },
  {
    icon: "sizes",
    title: "Exacting, not precious",
    body: "Every size chart is measured off the actual blank, not the mill's spec sheet. A wrong number there is a reprint, and the reprint is ours.",
  },
  {
    icon: "shield",
    title: "On your side, not neutral",
    body: "If a campaign is going to miss its minimum, we say so while there is still time to do something about it.",
  },
] as const;

export default async function AboutPage() {
  const items = await getCatalogue();

  /**
   * The range, derived from the catalogue rather than typed beside it. A lead
   * time is shown as the span across the category, not its minimum: Paper runs
   * a sticker sheet in 7 days and an enamel pin in 14, and quoting the 7 would
   * be a number we could not hold to on half the category.
   */
  const range = categories(items).map((category) => {
    const inCategory = items.filter((i) => i.category === category);
    const days = inCategory.map((i) => i.leadDays);
    const low = Math.min(...days);
    const high = Math.max(...days);

    return {
      category,
      names: inCategory.map((i) => i.name).join(", "),
      lead: low === high ? `${low} days` : `${low}–${high} days`,
      image: inCategory.find((i) => i.image)?.image,
    };
  });

  return (
    <main>
      {/* Block 1 — the firm. */}
      <section className="mx-auto max-w-[1280px] px-5 pt-6 pb-3 sm:px-8">
        <Slab>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Chip>About us</Chip>
              <h1 className="t-h1 mt-5 max-w-[18ch] text-ink">
                Someone has to run the merch. It shouldn&apos;t be you.
              </h1>
              <p className="t-body mt-5 max-w-[52ch] text-ink-muted">
                We design and produce merch for colleges, clubs and companies in
                Bengaluru, then give every client a storefront on their own
                subdomain so their people order and pay for it themselves. The
                organiser shares one link. That is the whole job.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/how-it-works" size="lg">
                  See how it works
                </ButtonLink>
                <ButtonLink href="/catalogue" size="lg" variant="secondary">
                  See the catalogue
                </ButtonLink>
              </div>

              {/* Stacked below `sm`, three-up above it. At 360px a third of
                  this column is 80px, and "40–2,000" needs ~110px at this size
                  — three-up there broke the figure across two lines mid-number
                  while its siblings stayed on one. On mobile each stat is a row
                  instead, which gives the figure the full width and costs less
                  height than three stacked blocks. */}
              <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-hairline pt-8 sm:grid-cols-3">
                {[
                  ["2021", "Printing campaigns since"],
                  ["40–2,000", "Units in a campaign"],
                  ["1%", "Orders reprinted for a size error"],
                ].map(([figure, caption]) => (
                  <div
                    key={caption}
                    className="flex items-baseline justify-between gap-4 sm:block"
                  >
                    <dt className="figure t-h2 whitespace-nowrap text-ink">
                      {figure}
                    </dt>
                    <dd className="t-caption text-right sm:mt-2 sm:text-left">
                      {caption}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-lg lg:col-span-6 lg:min-h-[460px]">
              <Image
                src="/studio/garment-rack.jpg"
                alt="A row of identical garments hanging on a rail"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Slab>
      </section>

      {/* Block 2 — what we do. Reversed: the photograph leads on desktop and on
          mobile, because the argument that follows it is long. */}
      <section className="mx-auto max-w-[1280px] px-5 py-3 sm:px-8">
        <Slab>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="relative min-h-[280px] overflow-hidden rounded-lg lg:col-span-5 lg:min-h-[420px]">
              <Image
                src="/studio/print-press.jpg"
                alt="A screen printing carousel on the shop floor"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-7">
              <Chip>What we do</Chip>
              <h2 className="t-h2 mt-5 max-w-[20ch] text-ink">
                We remove the organiser&apos;s half of a merch run.
              </h2>
              <p className="t-body mt-5 max-w-[56ch] text-ink-muted">
                Every merch run on a campus works the same way. One person — a
                club secretary, a fest head, someone in HR — ends up holding a
                Google Form, a spreadsheet, a UPI ID and a WhatsApp group. They
                collect money they are not equipped to collect, for an event
                that is not theirs, and they carry the risk personally if the
                numbers are wrong. That half is what we take.
              </p>

              <ul className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Icon
                      name="tick"
                      size={20}
                      className="shrink-0 text-accent"
                    />
                    <span className="t-body-sm text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Slab>
      </section>

      {/* Block 3 — the range. Not "What we make": that is verbatim the home
          page's ProductGrid heading, and this block is the categories and their
          lead times rather than the products and their prices. */}
      <section className="mx-auto max-w-[1280px] px-5 py-3 sm:px-8">
        <Slab>
          <Chip>The range</Chip>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <h2 className="t-h2 max-w-[18ch] text-ink">
              Five categories, all made to order.
            </h2>
            <p className="t-body max-w-[52ch] text-ink-muted lg:justify-self-end lg:pb-1 lg:text-right">
              Nothing is held in stock, so nothing is ever sold out — a size is
              either offered on a campaign or it isn&apos;t. Printed in
              Bengaluru, produced in Tiruppur, against the campaign that ordered
              it.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {range.map((r) => (
              <li
                key={r.category}
                className="overflow-hidden rounded-lg bg-canvas"
              >
                {/* The plate ground, so the flat-lay sits on the same
                    #EFEFF2 it was photographed against. */}
                <div className="relative aspect-[4/3] bg-plate">
                  {r.image ? (
                    <Image
                      src={r.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 26vw, (min-width: 640px) 44vw, 90vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="t-h4 text-ink">{r.category}</h3>
                    <span className="figure t-body-sm shrink-0 text-ink-muted">
                      {r.lead}
                    </span>
                  </div>
                  <p className="t-body-sm mt-2 text-ink-muted">{r.names}</p>
                </div>
              </li>
            ))}
          </ul>
        </Slab>
      </section>

      {/* Block 4 — how we work. The one accent-filled card on the page. */}
      <section className="mx-auto max-w-[1280px] px-5 py-3 pb-6 sm:px-8">
        <Slab>
          <Chip>How we work</Chip>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <h2 className="t-h2 max-w-[18ch] text-ink">
              Four things we hold to.
            </h2>
            <p className="t-body max-w-[52ch] text-ink-muted lg:justify-self-end lg:pb-1 lg:text-right">
              None of these are aspirations. They are the rules we lose money on
              when we break them, which is the only kind worth publishing.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => {
              const filled = i === 0;
              return (
                <li
                  key={p.title}
                  className={
                    filled
                      ? "rounded-lg bg-accent p-6"
                      : "rounded-lg bg-canvas p-6"
                  }
                >
                  {/* On the filled card the badge inverts, so it does not
                      disappear into its own ground. */}
                  <span
                    className={
                      filled
                        ? "grid size-11 place-items-center rounded-lg bg-surface text-accent"
                        : "grid size-11 place-items-center rounded-lg bg-accent text-surface"
                    }
                  >
                    <Icon name={p.icon} size={24} />
                  </span>
                  <h3
                    className={
                      filled
                        ? "t-h4 mt-5 text-surface"
                        : "t-h4 mt-5 text-ink"
                    }
                  >
                    {p.title}
                  </h3>
                  {/* white/85 on New Car measures 5.15:1; white/75 would not
                      clear the floor. */}
                  <p
                    className={
                      filled
                        ? "t-body-sm mt-3 text-white/85"
                        : "t-body-sm mt-3 text-ink-muted"
                    }
                  >
                    {p.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Slab>
      </section>

      <CtaBlock />
    </main>
  );
}
