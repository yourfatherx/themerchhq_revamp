import type { Metadata } from "next";
import { HeroMedia } from "@/components/marketing/HeroMedia";
import { PhotoBand } from "@/components/marketing/PhotoBand";
import { ProductGridBand } from "@/components/marketing/ProductGridBand";
import { getCatalogue } from "@/content/catalogue";

export const metadata: Metadata = {
  title: "The Merch HQ — Merch, handled.",
  description:
    "250 hoodies. One link. No spreadsheet. We design and make the merch, then give your club or company its own storefront so your people order and pay for it themselves.",
};

/**
 * The marketing home (MKT-1).
 *
 * A storefront's rhythm rather than a brochure's: the claim over full-bleed
 * media, then product on white, then a photograph one viewport tall, then more
 * product, then photographs that each open onto one page of the site. There is
 * almost no copy between them — the product and the pictures carry it, and
 * every band ends in a way onward.
 *
 * Wearables lead because they are most of what gets ordered; everything else
 * follows the first pair of photographs.
 */
export default async function Home() {
  const items = await getCatalogue();
  const wearables = items.filter((i) => i.category === "Apparel" || i.category === "Headwear");
  const everythingElse = items.filter((i) => !wearables.includes(i));

  return (
    <main className="bg-surface">
      <HeroMedia
        video={{
          webm: "/video/hero.webm",
          mp4: "/video/hero.mp4",
          poster: "/video/hero-poster.jpg",
        }}
      />

      <ProductGridBand title="What we make to wear" items={wearables.slice(0, 4)} preloadFirst />

      <div className="grid lg:grid-cols-2">
        <PhotoBand
          half
          src="/studio/storefront-build.jpg"
          alt="Hands at a laptop and drawing tablet, with colour swatch sheets and marker sketches beside them"
          title="Designed with you"
          body="Send a logo, a sketch or a sentence. Either way, you approve a sample before the run."
          href="/how-it-works"
          cta="How a run works"
        />
        <PhotoBand
          half
          tone="brand"
          src="/studio/share-link.jpg"
          alt="A person in a white shirt tapping on a phone"
          title="One link for the group"
          body="One link goes to the group, and your people order and pay for it themselves."
          href="/how-it-works"
          cta="See the storefront"
        />
      </div>

      <ProductGridBand title="Everything else we make" items={everythingElse.slice(0, 4)} />

      <PhotoBand
        tone="ink"
        src="/studio/packing-bench.jpg"
        alt="An order being boxed and tied at the packing bench"
        title="What a run produces"
        body="The storefront, the size table and the receipt, as the product renders them."
        href="/work"
        cta="See the work"
      />
      <PhotoBand
        src="/studio/print-press.jpg"
        alt="A screen printing carousel on the shop floor"
        title="Produced in Tiruppur"
        href="/about"
        cta="About us"
      />
      <PhotoBand
        tone="brand"
        src="/studio/brief.jpg"
        alt="An open notebook and pen in front of a laptop on a wooden table"
        title="Start with a headcount"
        body="Tell us what you want and roughly how many. We come back with a per-unit price and a delivery date."
        href="/quote"
        cta="Request a quote"
      />
    </main>
  );
}
