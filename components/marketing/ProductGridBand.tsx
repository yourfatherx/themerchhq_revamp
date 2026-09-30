import Link from "next/link";
import type { CatalogueItem } from "@/content/catalogue";
import { MerchCard } from "./MerchCard";

/**
 * Four plates across on white, edge to edge inside a 20px gutter, with one
 * quiet link beneath. No heading on the page — the plates are the heading —
 * but one for anyone navigating by landmark.
 *
 * Gutters are 8px between columns and 20px between rows, so a row reads as one
 * continuous run of product and two rows still read as two.
 */
export function ProductGridBand({
  title,
  items,
  more = { href: "/catalogue", label: "View the catalogue" },
  preloadFirst,
}: {
  /** Names the section for assistive technology; not shown. */
  title: string;
  items: readonly CatalogueItem[];
  more?: { href: string; label: string } | null;
  preloadFirst?: boolean;
}) {
  return (
    <section className="bg-surface px-4 pt-5 pb-10 sm:px-5">
      <h2 className="sr-only">{title}</h2>
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 lg:grid-cols-4">
        {items.map((item, i) => (
          <MerchCard
            key={item.slug}
            item={item}
            href={`/catalogue#${item.slug}`}
            preload={preloadFirst && i < 4}
          />
        ))}
      </div>
      {more ? (
        <p className="mt-10 text-center">
          <Link
            href={more.href}
            className="text-[14px] font-medium tracking-[-0.02em] text-ink no-underline transition-opacity duration-150 ease-brand hover:text-ink hover:no-underline hover:opacity-65"
          >
            {more.label}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
