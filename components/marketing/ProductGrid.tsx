import { ProductCard } from "@/components/store/ProductCard";
import { getCatalogue } from "@/content/catalogue";

/**
 * The catalogue, on the home page.
 *
 * This slot used to hold four tilted cards on a dashed connector path. What
 * belongs here is what we actually make — a merch company's home page should
 * show merch above the fold of the argument, not a diagram of its process. The
 * grid is the reference's: four across, a tight 12px column gutter and a
 * generous 32px row gutter, so the plates read as one continuous run.
 *
 * Prices are the 250-unit tier, which is where most campaigns land.
 */
export async function ProductGrid() {
  const items = await getCatalogue();

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="t-h1 max-w-[14ch] text-ink">What we make.</h2>
        <a href="/catalogue" className="t-body font-medium">
          Full catalogue and prices
        </a>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
        {items.map((item, i) => {
          const tier =
            item.tiers.find((t) => t.units === 250) ?? item.tiers.at(-1);

          return (
            <ProductCard
              key={item.slug}
              href={`/catalogue#${item.slug}`}
              name={item.name}
              price={tier!.unitPrice}
              colour={item.colours[0]}
              colours={item.colours}
              imageSrc={item.image}
              facts={[
                `${item.tiers[0].units} minimum`,
                `${item.leadDays} days`,
              ]}
              priority={i < 4}
            />
          );
        })}
      </div>

      <p className="t-caption mt-10 max-w-[74ch]">
        Prices are per unit at 250 units, before GST. Plates show the stock
        colour until that item has been photographed from a real run.
      </p>
    </section>
  );
}
