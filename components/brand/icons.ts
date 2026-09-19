/* The Merch HQ — authored icon set.
   24-unit grid, solid fill, no stroke, max three shapes, radius is a full pill
   or 4 units. Generated from design/Foundations.dc.html — never a downloaded set.

   `cut` is knocked THROUGH the shape with a mask, never a white shape laid on
   top, so a glyph reads on any ground and inherits exactly one fill. */

export type IconName = keyof typeof ICONS;

export const ICONS = {
  kit: {
    base: "<rect x=\"3\" y=\"9\" width=\"18\" height=\"12\" rx=\"4\"/><rect x=\"2\" y=\"3\" width=\"20\" height=\"5\" rx=\"2.5\"/>",
    cut: "<circle cx=\"12\" cy=\"14.5\" r=\"2\"/>",
  },
  storefront: {
    base: "<path d=\"M3 11a9 9 0 0 1 18 0v2H3z\"/><rect x=\"4\" y=\"14\" width=\"16\" height=\"7\" rx=\"4\"/>",
  },
  tee: {
    base: "<rect x=\"7\" y=\"4\" width=\"10\" height=\"17\" rx=\"4\"/><rect x=\"2\" y=\"5\" width=\"4.5\" height=\"9\" rx=\"2.25\"/><rect x=\"17.5\" y=\"5\" width=\"4.5\" height=\"9\" rx=\"2.25\"/>",
  },
  clock: {
    base: "<circle cx=\"12\" cy=\"12\" r=\"9\"/>",
    cut: "<rect x=\"10.8\" y=\"5.8\" width=\"2.4\" height=\"7.9\" rx=\"1.2\"/><rect x=\"11.4\" y=\"11.3\" width=\"5.8\" height=\"2.4\" rx=\"1.2\"/>",
  },
  truck: {
    base: "<rect x=\"2\" y=\"7\" width=\"13\" height=\"9\" rx=\"4\"/><rect x=\"15\" y=\"10\" width=\"7\" height=\"6\" rx=\"3\"/><circle cx=\"7\" cy=\"18.5\" r=\"2.5\"/>",
  },
  tick: {
    base: "<circle cx=\"12\" cy=\"12\" r=\"10\"/>",
    cut: "<rect x=\"10.2\" y=\"12.5\" width=\"8.4\" height=\"2.6\" rx=\"1.3\" transform=\"rotate(-45 10.2 12.5)\"/><rect x=\"6.6\" y=\"11.4\" width=\"5.4\" height=\"2.6\" rx=\"1.3\" transform=\"rotate(45 6.6 11.4)\"/>",
  },
  cross: {
    base: "<circle cx=\"12\" cy=\"12\" r=\"10\"/>",
    cut: "<rect x=\"7.4\" y=\"10.7\" width=\"9.2\" height=\"2.6\" rx=\"1.3\" transform=\"rotate(45 7.4 10.7)\"/><rect x=\"5.6\" y=\"16.2\" width=\"9.2\" height=\"2.6\" rx=\"1.3\" transform=\"rotate(-45 5.6 16.2)\"/>",
  },
  sizes: {
    base: "<rect x=\"3\" y=\"4\" width=\"10\" height=\"4\" rx=\"2\"/><rect x=\"3\" y=\"10\" width=\"15\" height=\"4\" rx=\"2\"/><rect x=\"3\" y=\"16\" width=\"18\" height=\"4\" rx=\"2\"/>",
  },
  batch: {
    base: "<circle cx=\"8\" cy=\"8\" r=\"4\"/><circle cx=\"17\" cy=\"9.5\" r=\"3\"/><path d=\"M2 21a6.5 6.5 0 0 1 13 0z\"/>",
  },
  link: {
    base: "<rect x=\"2\" y=\"9.6\" width=\"9\" height=\"4.8\" rx=\"2.4\"/><rect x=\"13\" y=\"9.6\" width=\"9\" height=\"4.8\" rx=\"2.4\"/><rect x=\"8\" y=\"10.6\" width=\"8\" height=\"2.8\" rx=\"1.4\"/>",
  },
  dashboard: {
    base: "<rect x=\"3\" y=\"3\" width=\"8\" height=\"8\" rx=\"4\"/><rect x=\"13\" y=\"3\" width=\"8\" height=\"18\" rx=\"4\"/><rect x=\"3\" y=\"13\" width=\"8\" height=\"8\" rx=\"4\"/>",
  },
  payment: {
    base: "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"4\"/>",
    cut: "<rect x=\"2\" y=\"9\" width=\"20\" height=\"3\"/><rect x=\"5\" y=\"14\" width=\"6\" height=\"2.4\" rx=\"1.2\"/>",
  },
  arrow: {
    base: "<rect x=\"3\" y=\"10.8\" width=\"15\" height=\"2.4\" rx=\"1.2\"/><rect x=\"12.4\" y=\"6.2\" width=\"2.4\" height=\"7.4\" rx=\"1.2\" transform=\"rotate(-45 12.4 6.2)\"/><rect x=\"14.1\" y=\"16.1\" width=\"2.4\" height=\"7.4\" rx=\"1.2\" transform=\"rotate(-135 14.1 16.1)\"/>",
  },
  dot: {
    base: "<circle cx=\"12\" cy=\"12\" r=\"5\"/>",
  },
  quote: {
    base: "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"4\"/>",
    cut: "<rect x=\"7.5\" y=\"7\" width=\"9\" height=\"2.4\" rx=\"1.2\"/><rect x=\"7.5\" y=\"12\" width=\"6\" height=\"2.4\" rx=\"1.2\"/>",
  },
  shield: {
    base: "<path d=\"M12 2l8 3v7c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V5z\"/>",
    cut: "<rect x=\"10.2\" y=\"12.2\" width=\"7.6\" height=\"2.4\" rx=\"1.2\" transform=\"rotate(-45 10.2 12.2)\"/><rect x=\"7.2\" y=\"11.4\" width=\"4.8\" height=\"2.4\" rx=\"1.2\" transform=\"rotate(45 7.2 11.4)\"/>",
  },
  minus: {
    base: "<rect x=\"4\" y=\"10.8\" width=\"16\" height=\"2.4\" rx=\"1.2\"/>",
  },
  plus: {
    base: "<rect x=\"4\" y=\"10.8\" width=\"16\" height=\"2.4\" rx=\"1.2\"/><rect x=\"10.8\" y=\"4\" width=\"2.4\" height=\"16\" rx=\"1.2\"/>",
  },
  chevron: {
    base: "<rect x=\"5.6\" y=\"9.4\" width=\"2.6\" height=\"9.2\" rx=\"1.3\" transform=\"rotate(-45 5.6 9.4)\"/><rect x=\"18.4\" y=\"11.2\" width=\"2.6\" height=\"9.2\" rx=\"1.3\" transform=\"rotate(-135 18.4 11.2)\"/>",
  },
  search: {
    base: "<circle cx=\"10.5\" cy=\"10.5\" r=\"7.5\"/><rect x=\"15\" y=\"16.5\" width=\"2.8\" height=\"7\" rx=\"1.4\" transform=\"rotate(-45 15 16.5)\"/>",
    cut: "<circle cx=\"10.5\" cy=\"10.5\" r=\"4\"/>",
  },
  trash: {
    base: "<rect x=\"5\" y=\"6\" width=\"14\" height=\"15\" rx=\"4\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"3\" rx=\"1.5\"/>",
    cut: "<rect x=\"10.8\" y=\"10\" width=\"2.4\" height=\"7\" rx=\"1.2\"/>",
  },
  user: {
    base: "<circle cx=\"12\" cy=\"7.5\" r=\"4.5\"/><path d=\"M3 22a9 9 0 0 1 18 0z\"/>",
  },
  filter: {
    base: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"3\" rx=\"1.5\"/><rect x=\"6\" y=\"11\" width=\"12\" height=\"3\" rx=\"1.5\"/><rect x=\"9\" y=\"17\" width=\"6\" height=\"3\" rx=\"1.5\"/>",
  },
} as const satisfies Record<string, { base: string; cut?: string }>;
