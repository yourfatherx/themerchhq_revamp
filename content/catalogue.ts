import { rupees, type Paise } from "@/lib/money";

/**
 * The public catalogue (MKT-2).
 *
 * MKT-2's acceptance is "price tiers rendered from a config file, editable
 * without a deploy". A module in the repo does NOT satisfy that — changing it
 * needs a rebuild. In Phase 3 this data moves to the database and is edited
 * from the ops console, read through `use cache` and invalidated with
 * `revalidateTag` on save.
 *
 * `getCatalogue()` is the seam. Swapping its body for a DB read is the whole
 * migration; nothing that consumes it changes.
 */

export type CatalogueItem = {
  slug: string;
  name: string;
  /** The blank, in the words a buyer would use. */
  spec: string;
  /** Print or decoration method offered on this item. */
  decoration: string;
  /** Indicative per-unit price at 50 / 100 / 250 / 500 units (MKT-2). */
  tiers: { units: 50 | 100 | 250 | 500; unitPrice: Paise }[];
  category: "Apparel" | "Headwear" | "Bags" | "Drinkware" | "Paper";
  /** Stock colours, in supplier vocabulary. Resolved to hex by ProductPlate. */
  colours: string[];
  /** Working days from artwork approval to delivery for this item alone. */
  leadDays: number;
  /**
   * Flat-lay under `public/products/`. Absent until that item has been
   * photographed; the plate renders its colour instead, never a stand-in.
   */
  image?: string;
};

const CATALOGUE: CatalogueItem[] = [
  {
    slug: "heavyweight-hoodie",
    image: "/products/heavyweight-hoodie.png",
    colours: ["Navy", "Black", "Oatmeal", "Maroon", "Olive"],
    leadDays: 11,
    name: "Heavyweight hoodie",
    spec: "320 GSM brushed fleece · unisex · S–2XL",
    decoration: "Screen print or embroidery",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(1099) },
      { units: 100, unitPrice: rupees(999) },
      { units: 250, unitPrice: rupees(899) },
      { units: 500, unitPrice: rupees(849) },
    ],
  },
  {
    slug: "heavy-cotton-tee",
    image: "/products/heavy-cotton-tee.png",
    colours: ["Black", "White", "Navy", "Natural", "Maroon", "Olive"],
    leadDays: 9,
    name: "Heavy cotton tee",
    spec: "240 GSM combed cotton · unisex · XS–3XL",
    decoration: "Screen print, up to 4 colours",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(549) },
      { units: 100, unitPrice: rupees(499) },
      { units: 250, unitPrice: rupees(449) },
      { units: 500, unitPrice: rupees(419) },
    ],
  },
  {
    slug: "crew-sweatshirt",
    image: "/products/crew-sweatshirt.png",
    colours: ["Oatmeal", "Navy", "Black", "Charcoal"],
    leadDays: 11,
    name: "Crew sweatshirt",
    spec: "280 GSM fleece · unisex · S–2XL",
    decoration: "Screen print or embroidery",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(899) },
      { units: 100, unitPrice: rupees(829) },
      { units: 250, unitPrice: rupees(749) },
      { units: 500, unitPrice: rupees(699) },
    ],
  },
  {
    slug: "campus-cap",
    image: "/products/campus-cap.png",
    colours: ["Navy", "Black", "Natural"],
    leadDays: 12,
    name: "Campus cap",
    spec: "6-panel brushed cotton · adjustable",
    decoration: "Front-panel embroidery, 55 mm",
    category: "Headwear",
    tiers: [
      { units: 50, unitPrice: rupees(649) },
      { units: 100, unitPrice: rupees(599) },
      { units: 250, unitPrice: rupees(549) },
      { units: 500, unitPrice: rupees(509) },
    ],
  },
  {
    slug: "canvas-tote",
    image: "/products/canvas-tote.png",
    colours: ["Natural", "Black"],
    leadDays: 9,
    name: "Canvas tote",
    spec: "12 oz cotton canvas · 38 × 42 cm",
    decoration: "Single-colour screen print, 220 mm",
    category: "Bags",
    tiers: [
      { units: 50, unitPrice: rupees(399) },
      { units: 100, unitPrice: rupees(359) },
      { units: 250, unitPrice: rupees(319) },
      { units: 500, unitPrice: rupees(289) },
    ],
  },
  {
    slug: "steel-bottle",
    image: "/products/steel-bottle.png",
    colours: ["White", "Black", "Navy"],
    leadDays: 12,
    name: "Insulated steel bottle",
    spec: "750 ml · double-walled · powder-coated",
    decoration: "Vertical wrap, 60 mm · wordmark only",
    category: "Drinkware",
    tiers: [
      { units: 50, unitPrice: rupees(899) },
      { units: 100, unitPrice: rupees(829) },
      { units: 250, unitPrice: rupees(769) },
      { units: 500, unitPrice: rupees(719) },
    ],
  },
  {
    slug: "sticker-sheet",
    image: "/products/sticker-sheet.png",
    colours: [],
    leadDays: 7,
    name: "Sticker sheet",
    spec: "A5 sheet · kiss-cut · pack of six",
    decoration: "Full colour, weatherproof vinyl",
    category: "Paper",
    tiers: [
      { units: 50, unitPrice: rupees(179) },
      { units: 100, unitPrice: rupees(159) },
      { units: 250, unitPrice: rupees(149) },
      { units: 500, unitPrice: rupees(129) },
    ],
  },
  {
    slug: "enamel-pin",
    image: "/products/enamel-pin.png",
    colours: [],
    leadDays: 14,
    name: "Enamel pin set",
    spec: "Pack of three · 25 mm · butterfly clutch",
    decoration: "Soft enamel, up to 5 colours",
    category: "Paper",
    tiers: [
      { units: 50, unitPrice: rupees(379) },
      { units: 100, unitPrice: rupees(339) },
      { units: 250, unitPrice: rupees(299) },
      { units: 500, unitPrice: rupees(269) },
    ],
  },
];

export const TIER_UNITS = [50, 100, 250, 500] as const;

/** The seam. Phase 3 replaces the body with a cached database read. */
export async function getCatalogue(): Promise<CatalogueItem[]> {
  return CATALOGUE;
}

export function categories(items: CatalogueItem[]): string[] {
  return [...new Set(items.map((i) => i.category))];
}
