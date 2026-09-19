import type { Metadata } from "next";
import { ClientMarquee } from "@/components/marketing/ClientMarquee";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { HeroMedia } from "@/components/marketing/HeroMedia";
import { OfferBento } from "@/components/marketing/OfferBento";
import { ProductGrid } from "@/components/marketing/ProductGrid";
import { ProgramRow } from "@/components/marketing/ProgramRow";
import { ProofRow } from "@/components/marketing/ProofRow";
import { QuoteCards } from "@/components/marketing/QuoteCards";

export const metadata: Metadata = {
  title: "The Merch HQ — Merch, handled.",
  description:
    "250 hoodies. One link. No spreadsheet. We design and make the merch, then give your club or company its own storefront so your people order and pay for it themselves.",
};

/**
 * The marketing home (MKT-1).
 *
 * Rebuilt to the layout reference the client supplied: the page is a stack of
 * rounded slabs on the canvas rather than full-bleed bands, each slab holding a
 * bento of unequal cells, with one dark slab breaking the run and the wordmark
 * closing both the hero and the foot.
 *
 * Ordered the way the reference orders its own: the claim over full-bleed
 * media, then what you get, then how a run works, then the one artefact that
 * decides the print, then the numbers, then the product, then other people,
 * then the ask.
 */
export default function Home() {
  return (
    <main className="bg-canvas pb-6">
      <HeroMedia
        video={{
          webm: "/video/hero.webm",
          mp4: "/video/hero.mp4",
          poster: "/video/hero-poster.jpg",
        }}
      />
      <ClientMarquee />
      <OfferBento />
      <ProgramRow />
      <FeatureSplit />
      <ProofRow />
      <ProductGrid />
      {/* No quotes until a real campaign has run — see QuoteCards. */}
      <QuoteCards />
      <CtaBlock />
    </main>
  );
}
