import Link from "next/link";
import type { CatalogueItem } from "@/content/catalogue";
import { ProductPlate } from "@/components/store/ProductPlate";
import { formatINR } from "@/lib/money";

/**
 * A catalogue item as a square plate with two lines beneath it.
 *
 * Top-left of the plate, a white tag names the category. Pointed at or focused,
 * a strip rises from the plate's bottom edge with the facts that decide an
 * order — minimum, lead time, colours — so the resting grid stays as quiet as
 * a shop window and the detail is one gesture away. The strip is also always
 * in the accessible name, so nothing is hidden from a screen reader.
 *
 * The price is the 250-unit tier, where most campaigns land, labelled as such.
 */
export function MerchCard({
  item,
  href,
  preload,
}: {
  item: CatalogueItem;
  href: string;
  preload?: boolean;
}) {
  const tier = item.tiers.find((t) => t.units === 250) ?? item.tiers.at(-1)!;
  const facts = [
    `${item.tiers[0].units} minimum`,
    `${item.leadDays} working days`,
    item.colours.length ? `${item.colours.length} colours` : "Full colour",
  ];

  return (
    <Link
      href={href}
      className="group block text-ink no-underline hover:text-ink hover:no-underline focus-visible:shadow-none"
    >
      <div className="relative overflow-hidden group-focus-visible:shadow-[var(--focus-ring)]">
        <ProductPlate
          square
          src={item.image}
          alt={item.name}
          colour={item.colours[0]}
          preload={preload}
        >
          <span className="absolute top-3 left-3 rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium tracking-[-0.01em] text-ink">
            {item.category}
          </span>

          <span className="absolute inset-x-0 bottom-0 flex translate-y-full flex-wrap justify-center gap-x-4 gap-y-1 bg-surface/95 px-3 py-3 text-[12px] font-medium tracking-[-0.01em] text-ink transition-transform duration-200 ease-brand group-hover:translate-y-0 group-focus-visible:translate-y-0">
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </span>
        </ProductPlate>
      </div>

      <p className="mt-2.5 text-[14px] font-medium tracking-[-0.02em]">{item.name}</p>
      <p className="mt-0.5 text-[13px] tabular-nums tracking-[-0.01em] text-ink-muted">
        {formatINR(tier.unitPrice)} / unit at {tier.units}
      </p>
    </Link>
  );
}
