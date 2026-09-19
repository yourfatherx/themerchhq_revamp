import type { Metadata } from "next";
import { ProductPlate } from "@/components/store/ProductPlate";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
    <main className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
      <h1 className="t-h1 max-w-[20ch] text-ink">
        What we make, and what it costs.
      </h1>
      <p className="t-body-lg mt-4 max-w-[64ch] text-ink-muted">
        Indicative per-unit prices at four volumes, before GST. The quote you get
        back is a fixed number at your actual headcount.
      </p>

      <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <a
            key={c}
            href={`#${c.toLowerCase()}`}
            className="rounded-full border border-hairline px-4 py-2 text-[14px] font-medium text-ink no-underline hover:bg-surface-hover hover:no-underline"
          >
            {c}
          </a>
        ))}
      </nav>

      <div className="mt-14 space-y-16">
        {cats.map((cat) => (
          <section key={cat} id={cat.toLowerCase()}>
            <h2 className="t-h3 text-ink">{cat}</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
              {items
                .filter((i) => i.category === cat)
                .map((item) => (
                  <article key={item.slug} id={item.slug}>
                    <ProductPlate
                      alt={item.name}
                      src={item.image}
                      colour={item.colours[0]}
                    />

                    <h3 className="t-h4 mt-4 text-ink">{item.name}</h3>
                    <p className="t-body-sm mt-2 text-ink-muted">{item.spec}</p>
                    <p className="t-body-sm mt-1 text-ink-muted">
                      {item.decoration}
                    </p>

                    <table className="mt-5 w-full border-collapse text-left">
                      <caption className="sr-only">
                        Indicative per-unit price for {item.name}
                      </caption>
                      <thead>
                        <tr>
                          {TIER_UNITS.map((u) => (
                            <th
                              key={u}
                              scope="col"
                              className="border-b border-hairline pb-2 text-[13px] font-medium text-ink-muted"
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
                              className="figure pt-3 text-[15px] text-ink"
                            >
                              {formatINR(t.unitPrice)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <p className="t-caption mt-2">Units ordered · per unit</p>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 max-w-[70ch]">
        <Alert tone="info" title="These are indicative, not a quote">
          Final pricing depends on colours, print size and placement count, and
          on the delivery date. GST is added separately on the invoice. Send us
          the headcount and we&apos;ll come back with a fixed number.
        </Alert>
      </div>

      <div className="mt-10">
        <ButtonLink
          href="/quote"
          size="lg"
        >
          Request a quote
        </ButtonLink>
      </div>
    </main>
  );
}
