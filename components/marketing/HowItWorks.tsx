import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Three things the product does, each shown rather than described.
 *
 * The composition follows the reference the client supplied: the section is one
 * rounded container standing on the page ground, a heading row across the top,
 * and inside it a row of cards of deliberately unequal width — an image-led card
 * with a panel floating over it, then two quieter data cards. The previous
 * version was three alternating text-beside-panel rows, which is the stock SaaS
 * zig-zag: every row the same width, the same frame and the same weight, so
 * nothing led.
 *
 * What is not taken from the reference: its tracked ALL-CAPS eyebrows, its `→`
 * on labels and its circular arrow buttons. Those are on this codebase's
 * removed-AI-tells list, and the structure works without them — the slot they
 * occupied is filled by a sentence-case caption.
 *
 * Everything inside is built from the same components and tokens the product
 * uses, so these are specimens rather than illustrations.
 */

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
      <div className="rounded-xl bg-surface p-6 sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2 className="t-h1 max-w-[18ch] text-ink">
            The organiser&apos;s half, removed.
          </h2>
          <p className="t-body max-w-[42ch] text-ink-muted lg:pb-2">
            Three jobs that used to live in a spreadsheet and a payment thread,
            each handled by the page itself.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <StorefrontFigure />
            <Caption
              title="Your own storefront."
              body="Your subdomain, your logo, your accent colour. Live in five working days, and closed on the date you set."
            />
          </Card>

          <Card className="lg:col-span-4">
            <p className="t-caption">Heavyweight hoodie — to print</p>
            <div className="mt-5">
              <SizesFigure />
            </div>
            <Caption
              title="Sizes arrive clean."
              body="Every order carries its own size, because the buyer picked it on the page."
            />
          </Card>

          <Card className="lg:col-span-3">
            <p className="t-caption">Order MHQ-4KPR</p>
            <div className="mt-5">
              <MoneyFigure />
            </div>
            <Caption
              title="They pay, not you."
              body="Buyers pay us directly. No personal account collecting money for an event that isn't yours."
            />
          </Card>
        </div>
      </div>
    </section>
  );
}

/** A cell of the bento. Cards sit on the container's white, so they take the
 *  page ground as their fill — the inverse of the usual white-on-grey card. */
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-lg bg-canvas p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </article>
  );
}

/** Pushed to the foot by `mt-auto` so the three claims share a baseline even
 *  though the specimens above them are different heights. */
function Caption({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-auto pt-10">
      <h3 className="t-h4 text-ink">{title}</h3>
      <p className="t-body-sm mt-2 max-w-[38ch] text-ink-muted">{body}</p>
    </div>
  );
}

/**
 * The reference's image card with a panel floating over its lower edge. Here
 * the "image" is the garment plate, so the card reads as a storefront listing
 * rather than as decoration.
 */
function StorefrontFigure() {
  return (
    // The plate needs real height for the panel to overlay *onto*. It carries
    // the actual catalogue flat-lay rather than a flat colour block: the card is
    // depicting a storefront listing, and a listing shows the garment.
    <div className="relative min-h-[380px] overflow-hidden rounded-md bg-plate p-5">
      <Image
        src="/products/heavyweight-hoodie.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover object-top"
      />

      <p className="t-caption relative">music-club.themerchhq.in</p>

      <div className="absolute inset-x-4 bottom-4 rounded-md border border-hairline bg-surface p-4">
        <p className="t-h4 text-ink">Hostel Night 2026</p>
        <p className="figure mt-1 text-[15px] text-ink-muted">
          From <span className="text-ink">₹899</span>
        </p>

        <div className="mt-4 flex gap-2">
          {["S", "M", "L", "XL"].map((s) => (
            <span
              key={s}
              className={cn(
                "figure grid size-8 place-items-center rounded-md border text-[13px]",
                s === "L"
                  ? "border-accent bg-accent text-surface"
                  : "border-hairline text-ink",
              )}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
          <span className="t-caption">Closes in</span>
          <span className="figure text-[15px] text-ink">9d 04h</span>
        </div>
      </div>
    </div>
  );
}

/** DSH-3. The design file's note on it reads: one table is the whole pitch. */
const SIZE_ROWS = [
  { size: "S", qty: 12 },
  { size: "M", qty: 41 },
  { size: "L", qty: 68 },
  { size: "XL", qty: 39 },
  { size: "2XL", qty: 11 },
] as const;

function SizesFigure() {
  const total = SIZE_ROWS.reduce((n, r) => n + r.qty, 0);
  const max = Math.max(...SIZE_ROWS.map((r) => r.qty));

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Quantity ordered by size for the Heavyweight hoodie
      </caption>
      <tbody>
        {SIZE_ROWS.map((r) => (
          <tr key={r.size} className="border-b border-hairline">
            <th
              scope="row"
              className="figure py-2.5 text-[15px] font-medium text-ink"
            >
              {r.size}
            </th>
            <td className="w-full px-4 py-2.5">
              {/* The bar is the table's own data, not a second chart — it is
                  why the shape of a run is readable at a glance, and it is the
                  one place the accent is allowed to carry real area. */}
              <span
                aria-hidden="true"
                className="block h-2 rounded-full bg-accent"
                style={{ width: `${(r.qty / max) * 100}%` }}
              />
            </td>
            <td className="figure py-2.5 text-right text-[15px] text-ink">
              {r.qty}
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row" className="py-3 text-[15px] font-semibold text-ink">
            Total
          </th>
          <td />
          <td className="figure py-3 text-right text-[15px] font-semibold text-ink">
            {total}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function MoneyFigure() {
  return (
    <>
      <dl className="space-y-3">
        {[
          ["Hoodie × 1", "₹899.00"],
          ["GST at 12%", "₹108.00"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="t-body-sm text-ink-muted">{k}</dt>
            <dd className="figure text-[15px] text-ink">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-hairline pt-3">
          <dt className="t-body font-medium text-ink">Paid</dt>
          <dd className="figure text-[17px] font-medium text-ink">₹1,007.00</dd>
        </div>
      </dl>

      <p className="t-caption mt-5 border-t border-hairline pt-4">
        Paid to The Merch HQ by UPI, not to an individual&apos;s account.
      </p>
    </>
  );
}
