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
    image: "/products/heavyweight-hoodie.webp",
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
    image: "/products/heavy-cotton-tee.webp",
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
    image: "/products/crew-sweatshirt.webp",
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
    image: "/products/campus-cap.webp",
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
    image: "/products/canvas-tote.webp",
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
    image: "/products/steel-bottle.webp",
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
    image: "/products/sticker-sheet.webp",
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
    image: "/products/enamel-pin.webp",
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

  // Every item below is photographed. `image` stays optional on the type all
  // the same: a new product is added before it is shot, and the plate rendering
  // its stock colour is the honest interim, not a stand-in photograph.
  //
  // The range is only extended into things we can decorate in-house on a blank.
  // The layout reference sells licensed outerwear, consumer electronics, wine
  // and confectionery; we say "made, not sourced" on /about and print in
  // Tiruppur, so reselling a branded speaker would contradict the page two
  // clicks away. Product types are taken, that catalogue's actual goods are not.
  //
  // Every tier here follows the curve the first eight already set — roughly
  // 0.91, 0.83 and 0.77 of the 50-unit price — so a reader comparing two rows
  // sees one pricing policy rather than eighteen independent guesses.

  {
    slug: "oversized-tee",
    image: "/products/oversized-tee.webp",
    colours: ["Black", "Oatmeal", "Olive", "White", "Navy"],
    leadDays: 9,
    name: "Oversized drop-shoulder tee",
    spec: "240 GSM combed cotton · unisex · S–2XL",
    decoration: "Screen print, up to 4 colours",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(649) },
      { units: 100, unitPrice: rupees(589) },
      { units: 250, unitPrice: rupees(529) },
      { units: 500, unitPrice: rupees(499) },
    ],
  },
  {
    slug: "long-sleeve-tee",
    image: "/products/long-sleeve-tee.webp",
    colours: ["Black", "White", "Navy", "Olive"],
    leadDays: 9,
    name: "Long-sleeve tee",
    spec: "220 GSM combed cotton · unisex · XS–2XL",
    decoration: "Screen print, up to 4 colours",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(599) },
      { units: 100, unitPrice: rupees(549) },
      { units: 250, unitPrice: rupees(499) },
      { units: 500, unitPrice: rupees(459) },
    ],
  },
  {
    slug: "cotton-polo",
    image: "/products/cotton-polo.webp",
    colours: ["Navy", "White", "Black", "Bottle green"],
    leadDays: 11,
    name: "Cotton polo",
    spec: "220 GSM pique · unisex · S–2XL",
    decoration: "Left-chest embroidery",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(749) },
      { units: 100, unitPrice: rupees(689) },
      { units: 250, unitPrice: rupees(619) },
      { units: 500, unitPrice: rupees(579) },
    ],
  },
  {
    slug: "zip-hoodie",
    image: "/products/zip-hoodie.webp",
    colours: ["Black", "Navy", "Charcoal", "Oatmeal"],
    leadDays: 12,
    name: "Zip-through hoodie",
    spec: "320 GSM brushed fleece · unisex · S–2XL",
    decoration: "Screen print or embroidery",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(1249) },
      { units: 100, unitPrice: rupees(1139) },
      { units: 250, unitPrice: rupees(1029) },
      { units: 500, unitPrice: rupees(959) },
    ],
  },
  {
    slug: "varsity-jacket",
    image: "/products/varsity-jacket.webp",
    colours: ["Navy", "Black", "Maroon"],
    leadDays: 14,
    name: "Varsity jacket",
    spec: "Melton body · ribbed collar, cuffs and hem · S–2XL",
    decoration: "Chenille patch or embroidery",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(2199) },
      { units: 100, unitPrice: rupees(1999) },
      { units: 250, unitPrice: rupees(1799) },
      { units: 500, unitPrice: rupees(1699) },
    ],
  },
  {
    slug: "crew-socks",
    image: "/products/crew-socks.webp",
    colours: ["Black", "White", "Charcoal"],
    leadDays: 14,
    name: "Ribbed crew socks",
    spec: "Combed cotton blend · one pair · free size",
    decoration: "Knitted in, up to 3 colours",
    category: "Apparel",
    tiers: [
      { units: 50, unitPrice: rupees(249) },
      { units: 100, unitPrice: rupees(229) },
      { units: 250, unitPrice: rupees(199) },
      { units: 500, unitPrice: rupees(179) },
    ],
  },

  {
    slug: "bucket-hat",
    image: "/products/bucket-hat.webp",
    colours: ["Black", "Navy", "Natural", "Olive"],
    leadDays: 12,
    name: "Bucket hat",
    spec: "Washed cotton twill · two sizes",
    decoration: "Front or side embroidery",
    category: "Headwear",
    tiers: [
      { units: 50, unitPrice: rupees(599) },
      { units: 100, unitPrice: rupees(549) },
      { units: 250, unitPrice: rupees(499) },
      { units: 500, unitPrice: rupees(469) },
    ],
  },
  {
    slug: "ribbed-beanie",
    image: "/products/ribbed-beanie.webp",
    colours: ["Black", "Charcoal", "Navy", "Maroon"],
    leadDays: 12,
    name: "Ribbed beanie",
    spec: "Acrylic knit · cuffed · free size",
    decoration: "Woven label or embroidery",
    category: "Headwear",
    tiers: [
      { units: 50, unitPrice: rupees(499) },
      { units: 100, unitPrice: rupees(459) },
      { units: 250, unitPrice: rupees(419) },
      { units: 500, unitPrice: rupees(389) },
    ],
  },

  {
    slug: "drawstring-bag",
    image: "/products/drawstring-bag.webp",
    colours: ["Black", "Navy", "Red", "White"],
    leadDays: 9,
    name: "Drawstring bag",
    spec: "210D polyester · 36 × 44 cm",
    decoration: "Single-colour screen print, 200 mm",
    category: "Bags",
    tiers: [
      { units: 50, unitPrice: rupees(279) },
      { units: 100, unitPrice: rupees(249) },
      { units: 250, unitPrice: rupees(229) },
      { units: 500, unitPrice: rupees(199) },
    ],
  },
  {
    slug: "laptop-sleeve",
    image: "/products/laptop-sleeve.webp",
    colours: ["Charcoal", "Navy", "Oatmeal"],
    leadDays: 12,
    name: "Laptop sleeve",
    spec: "Padded felt · fits 13–14 inch",
    decoration: "Embroidery or screen print",
    category: "Bags",
    tiers: [
      { units: 50, unitPrice: rupees(699) },
      { units: 100, unitPrice: rupees(639) },
      { units: 250, unitPrice: rupees(579) },
      { units: 500, unitPrice: rupees(539) },
    ],
  },
  {
    slug: "weekender-duffel",
    image: "/products/weekender-duffel.webp",
    colours: ["Black", "Navy", "Olive"],
    leadDays: 14,
    name: "Weekender duffel",
    spec: "600D polyester · 45 L · detachable strap",
    decoration: "Embroidery, 120 mm",
    category: "Bags",
    tiers: [
      { units: 50, unitPrice: rupees(1499) },
      { units: 100, unitPrice: rupees(1369) },
      { units: 250, unitPrice: rupees(1239) },
      { units: 500, unitPrice: rupees(1159) },
    ],
  },
  {
    slug: "daypack",
    image: "/products/daypack.webp",
    colours: ["Black", "Charcoal", "Navy"],
    leadDays: 14,
    name: "Daypack",
    spec: "600D polyester · 22 L · padded back panel",
    decoration: "Embroidery, 100 mm",
    category: "Bags",
    tiers: [
      { units: 50, unitPrice: rupees(1699) },
      { units: 100, unitPrice: rupees(1549) },
      { units: 250, unitPrice: rupees(1399) },
      { units: 500, unitPrice: rupees(1299) },
    ],
  },

  {
    slug: "ceramic-mug",
    image: "/products/ceramic-mug.webp",
    colours: ["White", "Black", "Navy"],
    leadDays: 10,
    name: "Ceramic mug",
    spec: "330 ml · glazed stoneware · dishwasher safe",
    decoration: "Full-colour wrap print",
    category: "Drinkware",
    tiers: [
      { units: 50, unitPrice: rupees(399) },
      { units: 100, unitPrice: rupees(369) },
      { units: 250, unitPrice: rupees(329) },
      { units: 500, unitPrice: rupees(309) },
    ],
  },
  {
    slug: "vacuum-tumbler",
    image: "/products/vacuum-tumbler.webp",
    colours: ["White", "Black", "Navy"],
    leadDays: 12,
    name: "Vacuum tumbler",
    spec: "350 ml · double-walled · sliding lid",
    decoration: "Vertical wrap, 60 mm · wordmark only",
    category: "Drinkware",
    tiers: [
      { units: 50, unitPrice: rupees(749) },
      { units: 100, unitPrice: rupees(689) },
      { units: 250, unitPrice: rupees(629) },
      { units: 500, unitPrice: rupees(589) },
    ],
  },

  {
    slug: "a5-notebook",
    image: "/products/a5-notebook.webp",
    colours: ["Black", "Navy", "Natural"],
    leadDays: 10,
    name: "A5 notebook",
    spec: "80 pages · 100 GSM ruled · softcover",
    decoration: "Full-colour cover print",
    category: "Paper",
    tiers: [
      { units: 50, unitPrice: rupees(349) },
      { units: 100, unitPrice: rupees(319) },
      { units: 250, unitPrice: rupees(289) },
      { units: 500, unitPrice: rupees(269) },
    ],
  },
  {
    slug: "lanyard-set",
    image: "/products/lanyard-set.webp",
    colours: ["Navy", "Black", "Red"],
    leadDays: 12,
    name: "Lanyard and ID holder",
    spec: "20 mm woven polyester · safety break · clear holder",
    decoration: "Woven, up to 3 colours",
    category: "Paper",
    tiers: [
      { units: 50, unitPrice: rupees(189) },
      { units: 100, unitPrice: rupees(169) },
      { units: 250, unitPrice: rupees(149) },
      { units: 500, unitPrice: rupees(139) },
    ],
  },
  {
    slug: "a2-poster",
    image: "/products/a2-poster.webp",
    colours: [],
    leadDays: 7,
    name: "A2 poster",
    spec: "420 × 594 mm · 170 GSM silk",
    decoration: "Full colour, one side",
    category: "Paper",
    tiers: [
      { units: 50, unitPrice: rupees(229) },
      { units: 100, unitPrice: rupees(209) },
      { units: 250, unitPrice: rupees(189) },
      { units: 500, unitPrice: rupees(169) },
    ],
  },
  {
    slug: "postcard-pack",
    image: "/products/postcard-pack.webp",
    colours: [],
    leadDays: 7,
    name: "Postcard pack",
    spec: "A6 · 300 GSM uncoated · pack of ten",
    decoration: "Full colour, both sides",
    category: "Paper",
    tiers: [
      { units: 50, unitPrice: rupees(199) },
      { units: 100, unitPrice: rupees(179) },
      { units: 250, unitPrice: rupees(159) },
      { units: 500, unitPrice: rupees(149) },
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
