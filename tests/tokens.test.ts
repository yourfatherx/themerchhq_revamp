import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ratio } from "@/lib/contrast";
import {
  OPERATIONAL,
  PAIRINGS,
  PALETTE,
  WITHHELD,
} from "@/lib/tokens";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

/** Token name in globals.css -> key in PALETTE. */
const CSS_VARS: Record<string, keyof typeof PALETTE> = {
  "--color-brand": "brand",
  "--color-brand-deep": "brandDeep",
  "--color-brand-pressed": "brandPressed",
  "--color-ink": "ink",
  "--color-ink-muted": "inkMuted",
  "--color-rule": "rule",
  "--color-tint": "tint",
  "--color-surface": "surface",
  "--color-canvas": "canvas",
  "--color-plate": "plate",
  "--color-surface-sunken": "surfaceSunken",
  "--color-surface-hover": "surfaceHover",
  "--color-field-warm": "fieldWarm",
  "--color-state-success": "success",
  "--color-state-warning": "warning",
  "--color-state-danger": "danger",
};

describe("palette does not drift from globals.css", () => {
  for (const [cssVar, key] of Object.entries(CSS_VARS)) {
    it(`${cssVar} matches PALETTE.${key}`, () => {
      const match = css.match(
        new RegExp(`${cssVar}:\\s*(#[0-9a-fA-F]{6})\\s*;`),
      );
      expect(match, `${cssVar} not found in app/globals.css`).not.toBeNull();
      expect(match![1].toLowerCase()).toBe(PALETTE[key].toLowerCase());
    });
  }
});

describe("approved pairings measure what the design system states", () => {
  for (const p of PAIRINGS) {
    it(`${p.label} is ${p.stated}:1`, () => {
      // Tolerance covers the design's own rounding to two places.
      expect(ratio(p.fg, p.bg)).toBeCloseTo(p.stated, 1);
    });
  }

  it("every approved pairing clears the 4.5:1 floor", () => {
    for (const p of PAIRINGS) {
      expect(ratio(p.fg, p.bg), p.label).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("operational colours clear the floor on white", () => {
  for (const o of OPERATIONAL) {
    it(`${o.label} is ${o.stated}:1 on white`, () => {
      expect(ratio(o.fg, PALETTE.surface)).toBeCloseTo(o.stated, 1);
      expect(ratio(o.fg, PALETTE.surface)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe("withheld pairings are withheld for a measured reason", () => {
  for (const w of WITHHELD) {
    it(`${w.label} still measures ${w.stated}:1`, () => {
      expect(ratio(w.fg, w.bg)).toBeCloseTo(w.stated, 1);
      // Each is below the 4.5 body floor — that is why it is not shipped.
      expect(ratio(w.fg, w.bg)).toBeLessThan(4.5);
    });
  }
});

describe("rules that constrain the whole system", () => {
  it("Slate Gray is below the text floor, so it rules and never carries text", () => {
    expect(ratio(PALETTE.rule, PALETTE.surface)).toBeLessThan(4.5);
  });

  it("Lavender Gray is decorative — never text, never an icon", () => {
    expect(ratio(PALETTE.tint, PALETTE.surface)).toBeLessThan(3);
  });

  it("Marigold never sets type on white", () => {
    expect(ratio(PALETTE.fieldWarm, PALETTE.surface)).toBeLessThan(3);
  });

  it("the warning badge is background-independent above the floor", () => {
    // White on #B45309 holds regardless of the row underneath it.
    expect(ratio(PALETTE.surface, PALETTE.warning)).toBeGreaterThanOrEqual(4.5);
  });

  it("there is no dark mode", () => {
    expect(css).not.toMatch(/prefers-color-scheme/);
  });
});
