import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/brand/Icon";
import { PhotoBand } from "@/components/marketing/PhotoBand";
import { ProductPlate } from "@/components/store/ProductPlate";
import { categories, getCatalogue } from "@/content/catalogue";

export const metadata: Metadata = {
  title: "About — The Merch HQ",
  description:
    "We design and produce merch for colleges, clubs and companies, and give every client a storefront so their people order it themselves.",
};

/**
 * MKT-5, on the editorial layout.
 *
 * The page's own numbers are restatements, not new claims: 2021 is in
 * `OfferBento`, the unit range and the reprint rate are in `ProofRow`. Nothing
 * here is asserted for the first time.
 *
 * The range is derived from `content/catalogue.ts` rather than typed beside it,
 * and lead time is shown as the span across a category rather than its
 * minimum — Paper runs a sticker sheet in 7 days and an enamel pin in 14, and
 * quoting the 7 would be a date we could not hold to on half the category.
 *
 * Two things the reference does that this page deliberately does not:
 *
 *  - Its pulled-out line is a quotation attributed to a named director. There
 *    is no such quote here to use, and writing one would be the fabrication
 *    this site refuses everywhere else. The line set large below is the page's
 *    own sentence, unattributed, because the company is the one saying it.
 *  - Its team is a row of portraits with names. We have neither photographs nor
 *    a published roster, so the row carries placeholders and names nobody — see
 *    the note on `TEAM` below.
 */

const INCLUDED = [
  "Your own subdomain",
  "We collect the money",
  "Per-order size selection",
  "Printed in-house",
  "GST invoice for every buyer",
  "Collection list at handover",
] as const;

const STATS = [
  ["2021", "Printing campaigns since"],
  ["40–2,000", "Units in a campaign"],
  ["1%", "Orders reprinted for a size error"],
] as const;

/**
 * PLACEHOLDERS. Every file here is generated and nobody in them is real, which
 * is why they sit under `/studio/placeholder/` and why not one of them carries
 * a name or a job title.
 *
 * They are framed so no face is identifiable — turned away, in profile, or
 * cropped below the shoulders. That is on purpose rather than a limitation of
 * the generator: an invented face under a real company's "our team" is a claim
 * about who works here, and this site will not invent a client, a case study or
 * a testimonial either. Swap in real photographs before this ships, and the
 * names and roles with them.
 */
const TEAM = [
  { src: "/studio/placeholder/team-1.webp", alt: "Someone sorting fabric at a studio bench" },
  { src: "/studio/placeholder/team-2.webp", alt: "Someone working at a screen printing press" },
  { src: "/studio/placeholder/team-3.webp", alt: "Someone carrying a stack of folded blanks" },
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

const JUMP = [
  { href: "#what-we-do", label: "What we do." },
  { href: "#the-range", label: "The range." },
  { href: "#the-team", label: "The team." },
] as const;

export default async function AboutPage() {
  const items = await getCatalogue();

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
      colour: inCategory[0]?.colours[0],
    };
  });

  return (
    <main className="bg-surface">
      {/* The reference opens on a heading set far larger than anything else on
          the page, with the prose held to a narrow measure beside it. */}
      <header className="px-4 pt-12 pb-10 sm:px-5 lg:pt-20">
        <h1 className="max-w-[16ch] text-[clamp(44px,5vw+20px,96px)] leading-[0.95] font-semibold tracking-[-0.05em] text-ink uppercase">
          About{" "}
          <em className="font-normal tracking-[-0.035em] normal-case">us.</em>
        </h1>

        {/* The page's old headline. The reference's display line is "ABOUT US."
            and nothing else, which is a worse sentence than the one this page
            already had — so it keeps both: the label large, and the claim
            directly under it where it still opens the page. */}
        <p className="mt-6 max-w-[24ch] text-[clamp(22px,1.4vw+16px,30px)] leading-[1.15] font-medium tracking-[-0.035em] text-ink">
          Someone has to run the merch.{" "}
          <em className="font-normal tracking-[-0.03em]">
            It shouldn&apos;t be you.
          </em>
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <nav aria-label="On this page" className="lg:col-span-3">
            <ul className="space-y-1.5">
              {JUMP.map((j) => (
                <li key={j.href}>
                  <a
                    href={j.href}
                    className="text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted no-underline transition-opacity duration-150 ease-brand hover:text-ink-muted hover:no-underline hover:opacity-60"
                  >
                    {j.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-6 lg:col-span-9 lg:grid-cols-2 lg:gap-10">
            <p className="text-[15px] leading-[1.55] tracking-[-0.01em] text-ink-muted">
              We design and produce merch for colleges, clubs and companies in
              Bengaluru, then give every client a storefront on their own
              subdomain so their people order and pay for it themselves. The
              organiser shares one link. That is the whole job.
            </p>
            <p className="text-[15px] leading-[1.55] tracking-[-0.01em] text-ink-muted">
              Every merch run on a campus works the same way. One person — a
              club secretary, a fest head, someone in HR — ends up holding a
              Google Form, a spreadsheet, a UPI ID and a WhatsApp group. They
              collect money they are not equipped to collect, for an event that
              is not theirs, and they carry the risk personally if the numbers
              are wrong. That half is what we take.
            </p>
          </div>
        </div>
      </header>

      {/* Full-bleed, as the reference sets its one wide photograph. */}
      <div className="relative aspect-[16/7] w-full bg-plate">
        <Image
          src="/studio/placeholder/studio-desk.webp"
          alt="Three people working at a studio table, seen from directly above"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* The page's own sentence, set large. Not a quotation: see the note at
          the top of this file. */}
      <section
        id="what-we-do"
        className="scroll-mt-28 px-4 py-16 sm:px-5 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <p
              aria-hidden="true"
              className="text-[40px] leading-none font-semibold text-ink"
            >
              &ldquo;
            </p>
            <p className="mt-2 max-w-[22ch] text-[clamp(26px,1.8vw+18px,38px)] leading-[1.15] font-normal tracking-[-0.03em] text-ink italic">
              None of these are aspirations. They are the rules we lose money on
              when we break them.
            </p>
            <p className="mt-6 text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
              Which is the only kind worth publishing.
            </p>
          </div>

          <div className="relative aspect-[4/3] lg:col-span-6">
            <Image
              src="/studio/placeholder/press-wall.webp"
              alt="Someone pinning sheets of paper to a studio wall"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-hairline px-4 py-12 sm:px-5 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <h2 className="max-w-[20ch] text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink lg:col-span-6">
            We remove the organiser&apos;s half of a merch run.
          </h2>

          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:col-span-6 lg:content-start">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Icon name="tick" size={20} className="shrink-0 text-accent" />
                <span className="text-[15px] leading-[1.45] tracking-[-0.01em] text-ink">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="grid lg:grid-cols-2">
        <PhotoBand
          half
          src="/studio/garment-rack.jpg"
          alt="A row of identical garments hanging on a rail"
          title="Made, not sourced"
          body="We print in-house on 320 GSM blanks, so the thing that arrives is the thing you approved — not a substitute the supplier had in stock that week."
        />
        <PhotoBand
          half
          src="/studio/print-press.jpg"
          alt="A screen printing carousel on the shop floor"
          title="Bengaluru and Tiruppur"
          body="The studio and the storefronts are in Bengaluru; production is in Tiruppur. One team from artwork to dispatch."
        />
      </div>

      <section
        id="the-range"
        className="scroll-mt-28 border-t border-hairline px-4 py-12 sm:px-5 lg:py-16"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h2 className="max-w-[20ch] text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink">
            Five categories, all made to order.
          </h2>
          <p className="max-w-[52ch] text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
            Nothing is held in stock, so nothing is ever sold out — a size is
            either offered on a campaign or it isn&apos;t.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-5">
          {range.map((r) => (
            <li key={r.category}>
              <ProductPlate square alt="" src={r.image} colour={r.colour} />
              <div className="mt-2.5 flex items-baseline justify-between gap-3">
                <h3 className="text-[14px] font-medium tracking-[-0.02em] text-ink">
                  {r.category}
                </h3>
                <span className="figure shrink-0 text-[13px] tracking-[-0.01em] text-ink-muted">
                  {r.lead}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
                {r.names}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Portraits staggered down the left, the heading and the numbers held to
          the right, as the reference lays its team out. */}
      <section
        id="the-team"
        className="scroll-mt-28 border-t border-hairline px-4 py-16 sm:px-5 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ul className="grid grid-cols-2 gap-4 lg:col-span-5 lg:gap-5">
            {TEAM.map((p, i) => (
              <li
                key={p.src}
                className={
                  // The middle frame drops, so the column reads as a column
                  // rather than as a grid that lost a cell.
                  i === 1 ? "relative aspect-[3/4] translate-y-8" : "relative aspect-[3/4]"
                }
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="bg-plate object-cover"
                />
              </li>
            ))}
          </ul>

          <div className="lg:col-span-7">
            <h2 className="text-[clamp(32px,2.6vw+18px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
              The{" "}
              <em className="font-normal tracking-[-0.035em] normal-case">
                team.
              </em>
            </h2>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-[1.55] tracking-[-0.01em] text-ink-muted">
              The studio and the storefronts are in Bengaluru; production is in
              Tiruppur. One team from artwork to dispatch, which is why the
              person who quotes a run is the person who can tell you where it is
              on the floor.
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-hairline pt-8 sm:grid-cols-3">
              {STATS.map(([figure, caption]) => (
                <div
                  key={caption}
                  className="flex items-baseline justify-between gap-4 sm:block"
                >
                  <dt className="figure text-[clamp(32px,2vw+22px,52px)] leading-[1.05] font-medium tracking-[-0.04em] whitespace-nowrap text-ink">
                    {figure}
                  </dt>
                  <dd className="max-w-[18ch] text-right text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted sm:mt-3 sm:text-left">
                    {caption}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline px-4 py-12 sm:px-5 lg:py-16">
        <h2 className="max-w-[20ch] text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink">
          Four things we hold to.
        </h2>
        <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
          None of these are aspirations. They are the rules we lose money on
          when we break them, which is the only kind worth publishing.
        </p>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => {
            // One card in New Car, as the bands do it: colour marks a thing, it
            // does not decorate four of them.
            const filled = i === 0;
            return (
              <li
                key={p.title}
                className={filled ? "bg-brand p-6 text-surface" : "bg-canvas p-6 text-ink"}
              >
                <span
                  className={
                    filled
                      ? "grid size-10 place-items-center rounded-full bg-surface text-brand"
                      : "grid size-10 place-items-center rounded-full bg-brand text-surface"
                  }
                >
                  <Icon name={p.icon} size={20} />
                </span>
                <h3 className="mt-5 text-[18px] leading-[1.25] font-medium tracking-[-0.03em]">
                  {p.title}
                </h3>
                {/* Muted with opacity-90, the same way PhotoBand mutes body
                    copy on a coloured ground, rather than a second opacity
                    invented here. On New Car that measures 5.57:1. */}
                <p
                  className={
                    filled
                      ? "mt-2 text-[14px] leading-[1.45] tracking-[-0.01em] opacity-90"
                      : "mt-2 text-[14px] leading-[1.45] tracking-[-0.01em] text-ink-muted"
                  }
                >
                  {p.body}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <PhotoBand
        emphasis
        src="/studio/folded-stack.jpg"
        alt="Blank tees in four colourways, fanned out on a white ground"
        title="Tell us the date and the headcount"
        body="We come back with a quote, a per-unit price and a delivery date you can hold us to. No call required."
        href="/quote"
        cta="Request a quote"
      />
    </main>
  );
}
