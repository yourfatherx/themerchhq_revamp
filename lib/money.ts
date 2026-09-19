/**
 * All money in this system is an integer number of paise. No floats, anywhere
 * (NFR-7).
 *
 * `Paise` is branded so a raw `number` cannot be passed where money is
 * expected: a rupee figure that wanders in by accident would be off by a factor
 * of a hundred, and that is exactly the bug that is impossible to spot in a
 * total. Construct with `paise()` or `rupees()`, and format only at the view
 * boundary.
 */

declare const PAISE: unique symbol;
export type Paise = number & { readonly [PAISE]: true };

/** From a whole number of paise. */
export function paise(n: number): Paise {
  if (!Number.isInteger(n)) {
    throw new RangeError(`Money must be whole paise, received ${n}`);
  }
  return n as Paise;
}

/** From rupees. Accepts at most two decimal places, e.g. `rupees(899)`. */
export function rupees(n: number): Paise {
  const asPaise = Math.round(n * 100);
  if (Math.abs(n * 100 - asPaise) > 1e-9) {
    throw new RangeError(`Rupee amounts carry at most two decimals, got ${n}`);
  }
  return asPaise as Paise;
}

export function addPaise(...amounts: Paise[]): Paise {
  return amounts.reduce((a, b) => a + b, 0) as Paise;
}

export function subtractPaise(a: Paise, b: Paise): Paise {
  return (a - b) as Paise;
}

/** Multiply by a whole quantity. Quantities are never fractional here. */
export function timesQty(amount: Paise, qty: number): Paise {
  if (!Number.isInteger(qty) || qty < 0) {
    throw new RangeError(`Quantity must be a non-negative integer, got ${qty}`);
  }
  return (amount * qty) as Paise;
}

/**
 * Apply a tax rate given in basis points (1200 = 12%), rounding half-up to the
 * nearest paise. Basis points rather than a float rate so the rate itself is
 * exact and auditable.
 */
export function taxOn(amount: Paise, rateBasisPoints: number): Paise {
  if (!Number.isInteger(rateBasisPoints) || rateBasisPoints < 0) {
    throw new RangeError(`Tax rate must be whole basis points, got ${rateBasisPoints}`);
  }
  return Math.round((amount * rateBasisPoints) / 10_000) as Paise;
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const INR_PRECISE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format for display. Whole rupees drop the decimals — prices in this business
 * are whole rupees, and "₹899.00" reads like a software invoice rather than a
 * price. Anything with paise keeps both places so a refund is never rounded on
 * screen.
 */
export function formatINR(amount: Paise): string {
  const r = amount / 100;
  return amount % 100 === 0 ? INR.format(r) : INR_PRECISE.format(r);
}
