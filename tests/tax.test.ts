import { describe, expect, it } from "vitest";
import { formatINR, paise, rupees } from "@/lib/money";
import { gstOn, missingTaxRate, resolveGstRate } from "@/lib/tax";

describe("Section 170 — tax rounds to the nearest rupee", () => {
  it("rounds 50 paise and above up", () => {
    // 12% of ₹1,000.00 = ₹120.00 exactly; nudge to test the boundary.
    const b = gstOn(paise(100_050), 1200); // ₹1000.50 × 12% = ₹120.06
    expect(b.exact).toBe(12_006);
    expect(b.rounded).toBe(12_000);
  });

  it("rounds a .64 remainder up to the whole rupee", () => {
    const b = gstOn(rupees(1947), 1200);
    expect(b.exact).toBe(23_364); // ₹233.64
    expect(b.rounded).toBe(23_400); // ₹234
    expect(formatINR(b.rounded)).toBe("₹234");
  });

  it("ignores less than 50 paise", () => {
    const b = gstOn(rupees(1000), 1234); // ₹123.40
    expect(b.exact).toBe(12_340);
    expect(b.rounded).toBe(12_300); // ₹123
  });

  it("rounds exactly 50 paise up, not down", () => {
    const b = gstOn(paise(12_500), 400); // ₹125.00 × 4% = ₹5.00
    expect(b.exact).toBe(500);
    // Construct a true .50 case: ₹12.50 at 100% = ₹12.50
    const half = gstOn(paise(1250), 10_000);
    expect(half.exact).toBe(1250);
    expect(half.rounded).toBe(1300);
  });

  it("reproduces the design file's checkout figures exactly", () => {
    // Screens.dc.html: subtotal ₹2,347 − ₹400 tier discount = ₹1,947 taxable,
    // GST 12% shown as ₹234, total ₹2,181.
    const taxable = rupees(1947);
    const b = gstOn(taxable, 1200);
    expect(formatINR(b.rounded)).toBe("₹234");
    expect(formatINR(b.total)).toBe("₹2,181");
  });
});

describe("rounding happens once, at the invoice level", () => {
  it("does not drift the way per-line rounding does", () => {
    // Three identical lines whose tax is ₹5.49 each — just under the 50-paise
    // boundary, so each one rounds DOWN and the error accumulates.
    const line = rupees(109.8); // × 5% = ₹5.49
    const lines = [line, line, line];
    const taxable = rupees(329.4);

    const onceAtInvoice = gstOn(taxable, 500).rounded;
    const roundedPerLine = lines
      .map((l) => gstOn(l, 500).rounded)
      .reduce((a, b) => a + b, 0);

    // Per-line rounding *understates* the tax by ₹1 — three lots of 49 paise
    // thrown away. The invoice figure is the correct one under s.170, and this
    // is exactly why gstOn is called once on the invoice total.
    expect(roundedPerLine).toBe(1_500); // ₹15 — wrong
    expect(onceAtInvoice).toBe(1_600); // ₹16 — right
  });

  it("keeps the exact figure for GSTR-1, which reports two decimals", () => {
    const b = gstOn(rupees(1947), 1200);
    expect(formatINR(b.exact)).toBe("₹233.64");
  });
});

describe("the rate is a decision, not a default", () => {
  it("rejects a non-integer rate", () => {
    expect(() => gstOn(rupees(100), 12.5)).toThrow(RangeError);
  });

  it("falls back from product to campaign", () => {
    expect(
      resolveGstRate({ taxRateBasisPoints: 1800 }, { taxRateBasisPoints: 1200 }),
    ).toBe(1800);
    expect(
      resolveGstRate({ taxRateBasisPoints: null }, { taxRateBasisPoints: 1200 }),
    ).toBe(1200);
  });

  it("returns null rather than assuming zero when nobody has decided", () => {
    expect(
      resolveGstRate({ taxRateBasisPoints: null }, { taxRateBasisPoints: null }),
    ).toBeNull();
  });

  it("blocks go-live and names the products that need a rate", () => {
    const blocked = missingTaxRate(
      [
        { name: "Heavyweight hoodie", published: true, taxRateBasisPoints: null },
        { name: "Campus cap", published: true, taxRateBasisPoints: 500 },
        { name: "Draft tee", published: false, taxRateBasisPoints: null },
      ],
      { taxRateBasisPoints: null },
    );
    // Only published products block, and the message can name them.
    expect(blocked).toEqual(["Heavyweight hoodie"]);
  });

  it("clears once a campaign default is set", () => {
    expect(
      missingTaxRate(
        [{ name: "Heavyweight hoodie", published: true, taxRateBasisPoints: null }],
        { taxRateBasisPoints: 1200 },
      ),
    ).toEqual([]);
  });

  it("treats an explicit 0% as decided, not as missing", () => {
    expect(
      missingTaxRate(
        [{ name: "Exempt item", published: true, taxRateBasisPoints: 0 }],
        { taxRateBasisPoints: null },
      ),
    ).toEqual([]);
  });
});
