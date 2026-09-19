import { describe, expect, it } from "vitest";
import { sizeRank } from "@/lib/storefront";

describe("sizes sort in garment order, not alphabetically", () => {
  const sorted = (sizes: string[]) =>
    [...sizes].sort((a, b) => sizeRank(a) - sizeRank(b));

  it("puts a standard run in the order a buyer expects", () => {
    // Alphabetically this is 2XL, L, M, S, XL — which reads as broken.
    expect(sorted(["2XL", "L", "M", "S", "XL"])).toEqual([
      "S",
      "M",
      "L",
      "XL",
      "2XL",
    ]);
  });

  it("handles the extended run", () => {
    expect(sorted(["3XL", "XS", "2XS", "M"])).toEqual([
      "2XS",
      "XS",
      "M",
      "3XL",
    ]);
  });

  it("is case- and whitespace-insensitive", () => {
    expect(sizeRank(" xl ")).toBe(sizeRank("XL"));
  });

  it("keeps an unrecognised label rather than dropping it", () => {
    const out = sorted(["L", "Tall", "S"]);
    expect(out).toHaveLength(3);
    // Unknown sizes sort to the end, so a custom label still appears.
    expect(out[2]).toBe("Tall");
  });

  it("puts one-size after the lettered run", () => {
    expect(sorted(["ONE SIZE", "M"])).toEqual(["M", "ONE SIZE"]);
  });
});
