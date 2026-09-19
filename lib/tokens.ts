/** The palette, mirrored from app/globals.css so it can be asserted in tests
 *  and rendered in the token specimen. globals.css remains the shipping source
 *  of truth; tests/tokens.test.ts fails if these two drift apart. */

export const PALETTE = {
  brand: "#1B52D7", // New Car
  brandDeep: "#021C8B", // Resolution Blue
  brandPressed: "#021979",
  ink: "#13111F", // Chinese Black
  inkMuted: "#5A5C6E", // Ink Gray
  rule: "#767888", // Slate Gray
  tint: "#C0C7D3", // Lavender Gray
  surface: "#FFFFFF",
  canvas: "#F9FAFB", // the page ground; cards sit on it in pure white
  plate: "#EFEFF2", // product plate, and the ground every flat-lay is shot on
  surfaceSunken: "#F4F4F6",
  surfaceHover: "#F0F0F2",
  fieldWarm: "#FFC23C", // Marigold — fenced, never a web surface
  success: "#0E7A57",
  warning: "#B45309",
  danger: "#C0233C",
} as const;

export type PaletteKey = keyof typeof PALETTE;

/** Pairings the system permits, with the ratio the design asserts. */
export const PAIRINGS = [
  {
    fg: PALETTE.ink,
    bg: PALETTE.surface,
    stated: 18.62,
    label: "Chinese Black on white",
    use: "Body text everywhere. The default.",
  },
  {
    fg: PALETTE.brandDeep,
    bg: PALETTE.surface,
    stated: 13.62,
    label: "Resolution Blue on white",
    use: "Headlines and body",
  },
  {
    fg: PALETTE.brand,
    bg: PALETTE.surface,
    stated: 6.49,
    label: "New Car on white",
    use: "Links, labels, icons",
  },
  {
    fg: PALETTE.inkMuted,
    bg: PALETTE.surface,
    stated: 6.58,
    label: "Ink Gray on white",
    use: "Captions and anything under 24px",
  },
  {
    fg: PALETTE.inkMuted,
    bg: PALETTE.surfaceSunken,
    stated: 5.99,
    label: "Ink Gray on sunken",
    use: "Captions inside a tinted band",
  },
  {
    fg: PALETTE.surface,
    bg: PALETTE.brand,
    stated: 6.49,
    label: "White on New Car",
    use: "All text sizes",
  },
  {
    fg: PALETTE.surface,
    bg: PALETTE.brandDeep,
    stated: 13.62,
    label: "White on Resolution Blue",
    use: "All text sizes",
  },
  {
    fg: PALETTE.brandDeep,
    bg: PALETTE.tint,
    stated: 8.01,
    label: "Resolution Blue on Lavender",
    use: "The only type permitted on a Lavender plate",
  },
  {
    fg: PALETTE.ink,
    bg: PALETTE.surfaceSunken,
    stated: 16.95,
    label: "Chinese Black on sunken",
    use: "Body inside a tinted band",
  },
  {
    fg: PALETTE.ink,
    bg: PALETTE.surfaceHover,
    stated: 16.36,
    label: "Chinese Black on hover",
    use: "Body inside a hovered row",
  },
  {
    fg: PALETTE.ink,
    bg: PALETTE.canvas,
    stated: 17.82,
    label: "Chinese Black on canvas",
    use: "Body text on the page ground. The new default.",
  },
  {
    fg: PALETTE.inkMuted,
    bg: PALETTE.canvas,
    stated: 6.3,
    label: "Ink Gray on canvas",
    use: "Captions and anything under 24px on the page ground",
  },
  {
    fg: PALETTE.brand,
    bg: PALETTE.canvas,
    stated: 6.21,
    label: "New Car on canvas",
    use: "Links and small accents on the page ground",
  },
  {
    fg: PALETTE.inkMuted,
    bg: PALETTE.plate,
    stated: 5.73,
    label: "Ink Gray on plate",
    use: "The facts set into a product plate's bottom corners",
  },
  {
    fg: PALETTE.surface,
    bg: PALETTE.ink,
    stated: 18.62,
    label: "White on Chinese Black",
    use: "The primary button, the closing band, and type over hero media",
  },
] as const;

/** Pairings that are measured and deliberately NOT shipped. Recorded so they
 *  are never reintroduced by someone re-deriving the palette. */
export const WITHHELD = [
  {
    fg: PALETTE.brand,
    bg: PALETTE.tint,
    stated: 3.82,
    label: "New Car on Lavender",
    why:
      "Clears the 3.0 large-text floor, so it is technically legal above 36px " +
      "and the book permits it. No component uses it: a pairing that only " +
      "works above 36px breaks the first time someone reuses the component at " +
      "28px. On a Lavender plate the type is Resolution Blue at 8.01:1.",
  },
  {
    fg: "#86868B",
    bg: PALETTE.plate,
    stated: 3.16,
    label: "The layout reference's own plate-corner grey",
    why:
      "The reference sets the facts inside a product plate at 11px in #86868B, " +
      "which measures 3.16:1 and fails the floor at any size. We take the " +
      "placement and the role and refuse the value: those facts are Ink Gray " +
      "at 5.73:1 and 12px. Recorded because it is the one place copying the " +
      "reference exactly would have shipped a contrast failure.",
  },
  {
    fg: PALETTE.warning,
    bg: PALETTE.surfaceHover,
    stated: 4.41,
    label: "Warning text on a hovered row",
    why:
      "0.09 short of the 4.5 floor. Warning inside any hoverable row is a " +
      "solid badge — white on #B45309 at 5.02:1 — which is background-" +
      "independent. Amber text never sits on --surface-hover.",
  },
] as const;

/** Operational colours, quarantined to order states and order comms.
 *  Never in marketing, on merch, in a deck, or as a highlight. */
export const OPERATIONAL = [
  { fg: PALETTE.success, stated: 5.33, label: "Success", use: "Placed, paid, shipped, delivered" },
  { fg: PALETTE.warning, stated: 5.02, label: "Warning", use: "Sizes low, window closing" },
  { fg: PALETTE.danger, stated: 5.92, label: "Danger", use: "Payment failed, cancelled" },
] as const;
