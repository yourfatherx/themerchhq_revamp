import type { Metadata } from "next";
import { RollingText } from "@/components/marketing/RollingText";
import { ProductPlate } from "@/components/store/ProductPlate";
import { Alert } from "@/components/ui/Alert";
import { getCatalogue, TIER_UNITS, categories } from "@/content/catalogue";
import { formatINR } from "@/lib/money";

export const metadata: Metadata = {
  title: "Catalogue — The Merch HQ",
  description:
    "Every blank we stock, with indicative per-unit pricing at 50, 100, 250 and 500 units.",
};

export default async function CataloguePage() {
  const items = await getCatalogue();
  const cats = categories(items);

  return (
    <main className="bg-surface pb-16">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 px-4 pt-10 pb-6 sm:px-5 lg:pt-14">
        <div>
          <h1 className="text-[clamp(32px,2.2vw+24px,56px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink uppercase">
            What we make,{" "}
            <em className="font-normal tracking-[-0.03em] normal-case">and what it costs.</em>
          </h1>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.45] tracking-[-0.01em] text-ink-muted">
            Indicative per-unit prices at four volumes, before GST. The quote you
            get back is a fixed number at your actual headcount.
          </p>
        </div>
      </header>

      {/* Sticks under the top of the viewport once the site header has slid
          away on the way down, so a category is always one tap off. */}
      <nav
        aria-label="Categories"
        className="sticky top-0 z-10 flex gap-6 overflow-x-auto border-y border-hairline bg-surface/95 px-4 py-3 backdrop-blur-[12px] sm:px-5"
      >
        {cats.map((c) => (
          <a
            key={c}
            href={`#${c.toLowerCase()}`}
            className="group shrink-0 text-[12px] font-medium tracking-[0.02em] text-ink uppercase no-underline hover:text-ink hover:no-underline"
          >
            <RollingText text={c} />
          </a>
        ))}
      </nav>

      <div className="space-y-14 px-4 pt-8 sm:px-5">
        {cats.map((cat) => (
          <section key={cat} id={cat.toLowerCase()} className="scroll-mt-16">
            <h2 className="text-[24px] leading-[1.15] font-medium tracking-[-0.04em] text-ink">
              {cat}
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-4">
              {items
                .filter((i) => i.category === cat)
                .map((item) => (
                  <article key={item.slug} id={item.slug} className="scroll-mt-16">
                    <ProductPlate
                      square
                      alt={item.name}
                      src={item.image}
                      colour={item.colours[0]}
                    >
                      <span className="absolute top-3 left-3 rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium tracking-[-0.01em] text-ink">
                        {item.leadDays} working days
                      </span>
                    </ProductPlate>

                    <h3 className="mt-2.5 text-[14px] font-medium tracking-[-0.02em] text-ink">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
                      {item.spec}
                    </p>
                    <p className="text-[13px] leading-[1.4] tracking-[-0.01em] text-ink-muted">
                      {item.decoration}
                    </p>

                    <table className="mt-3 w-full border-collapse text-left">
                      <caption className="sr-only">
                        Indicative per-unit price for {item.name}
                      </caption>
                      <thead>
                        <tr>
                          {TIER_UNITS.map((u) => (
                            <th
                              key={u}
                              scope="col"
                              className="border-b border-hairline pb-1.5 text-[12px] font-medium text-ink-muted"
                            >
                              {u}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {item.tiers.map((t) => (
                            <td
                              key={t.units}
                              className="figure pt-2 text-[13px] text-ink"
                            >
                              {formatINR(t.unitPrice)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-1.5 text-[12px] text-ink-muted">Units ordered · per unit</p>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 max-w-[70ch] px-4 sm:px-5">
        <Alert tone="info" title="These are indicative, not a quote">
          Final pricing depends on colours, print size and placement count, and
          on the delivery date. GST is added separately on the invoice. Send us
          the headcount and we&apos;ll come back with a fixed number.
        </Alert>
      </div>
    </main>
  );
}
