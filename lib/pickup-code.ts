import { randomInt } from "node:crypto";

/**
 * PAY-10 — `MHQ-XXXX`, collision-checked, never sequential.
 *
 * A volunteer at a collection desk types this, reads it aloud, and matches it
 * against a printed list. So the alphabet drops every character people mishear
 * or mistype:
 *
 *   0 O D Q   — indistinguishable in most faces, and aloud
 *   1 I L     — same
 *   5 S · 2 Z · 8 B — confused aloud, especially over a noisy hall
 *   U V · M N — confused aloud
 *
 * What remains is 20 characters that survive both a bad photocopy and a shouted
 * handover. Four of them is 160,000 codes, which is far more than a campaign
 * needs while staying short enough to say in one breath.
 *
 * Sequential codes are not used: they leak how many orders a campaign has, and
 * they make guessing another buyer's code trivial.
 */
const ALPHABET = "34679ACEFGHJKPRTWXY";

export const PICKUP_CODE_PATTERN = /^MHQ-[34679ACEFGHJKPRTWXY]{4}$/;

/** One candidate code. Uniqueness is the database's job — see `generatePickupCode`. */
export function pickupCodeCandidate(
  rand: (max: number) => number = (max) => randomInt(max),
): string {
  let out = "";
  for (let i = 0; i < 4; i++) out += ALPHABET[rand(ALPHABET.length)];
  return `MHQ-${out}`;
}

export function isPickupCode(value: string): boolean {
  return PICKUP_CODE_PATTERN.test(value);
}

/**
 * Generate a code that is not already taken.
 *
 * `Order.pickupCode` is unique in the database, so that constraint is the real
 * guarantee; this loop only avoids handing the insert a code we already know is
 * taken. If it cannot find a free one it throws rather than returning a
 * duplicate — a collision must never become two buyers with one code.
 */
export async function generatePickupCode(
  isTaken: (code: string) => Promise<boolean>,
  attempts = 12,
): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    const code = pickupCodeCandidate();
    if (!(await isTaken(code))) return code;
  }
  throw new Error(
    `Could not find a free pickup code in ${attempts} attempts — the code space may be exhausted.`,
  );
}
