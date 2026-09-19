import { describe, expect, it } from "vitest";
import {
  addPaise,
  formatINR,
  paise,
  rupees,
  subtractPaise,
  taxOn,
  timesQty,
} from "@/lib/money";

describe("money is integer paise, never floats (NFR-7)", () => {
  it("rejects fractional paise", () => {
    expect(() => paise(10.5)).toThrow(RangeError);
  });

  it("converts rupees to paise exactly", () => {
    expect(rupees(899)).toBe(89_900);
    expect(rupees(1099.5)).toBe(109_950);
    expect(rupees(0.01)).toBe(1);
  });

  it("rejects rupee amounts with sub-paise precision", () => {
    expect(() => rupees(1.005)).toThrow(RangeError);
  });

  it("survives the classic float trap", () => {
    // 0.1 + 0.2 !== 0.3 in floating point. In paise it is exact.
    expect(addPaise(rupees(0.1), rupees(0.2))).toBe(rupees(0.3));
  });

  it("adds a realistic order without drift", () => {
    const hoodie = rupees(899);
    const cap = rupees(549);
    const total = addPaise(timesQty(hoodie, 2), cap);
    expect(total).toBe(234_700);
    expect(formatINR(total)).toBe("₹2,347");
  });

  it("subtracts a tier discount", () => {
    expect(subtractPaise(rupees(2347), rupees(400))).toBe(rupees(1947));
  });

  it("rejects fractional quantities", () => {
    expect(() => timesQty(rupees(899), 1.5)).toThrow(RangeError);
    expect(() => timesQty(rupees(899), -1)).toThrow(RangeError);
  });
});

describe("GST is computed in basis points and rounded to whole paise", () => {
  it("applies 12% exactly", () => {
    expect(taxOn(rupees(1947), 1200)).toBe(rupees(233.64));
  });

  it("rounds half-up to the nearest paise, never leaving a fraction", () => {
    const t = taxOn(paise(101), 1200); // 12.12 paise
    expect(Number.isInteger(t)).toBe(true);
    expect(t).toBe(12);
  });

  it("rejects a non-integer rate", () => {
    expect(() => taxOn(rupees(100), 12.5)).toThrow(RangeError);
  });
});

describe("formatting happens only at the view boundary", () => {
  it("drops decimals on whole rupees", () => {
    expect(formatINR(rupees(899))).toBe("₹899");
    expect(formatINR(rupees(1798))).toBe("₹1,798");
  });

  it("keeps both places when paise are present, so a refund is never rounded", () => {
    expect(formatINR(rupees(233.64))).toBe("₹233.64");
  });

  it("groups in the Indian system — lakhs, not thousands", () => {
    // 2,50,000 rather than 250,000.
    expect(formatINR(rupees(250_000))).toBe("₹2,50,000");
  });
});
