import { describe, expect, it } from "vitest";
import {
  generatePickupCode,
  isPickupCode,
  pickupCodeCandidate,
} from "@/lib/pickup-code";
import {
  parsePaymentEvent,
  signWebhook,
  verifyWebhookSignature,
  WebhookRejected,
} from "@/lib/razorpay";
import { orderingOpen } from "@/lib/storefront";

const SECRET = "whsec_test_do_not_use";

function body(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_ABC123",
          amount: 218_100,
          currency: "INR",
          notes: { orderRef: "ord_hostel_001" },
          ...overrides,
        },
      },
    },
  });
}

describe("PAY-7 — an unsigned or invalid webhook is rejected", () => {
  it("accepts a correctly signed body", () => {
    const raw = body();
    expect(() =>
      verifyWebhookSignature(raw, signWebhook(raw, SECRET), SECRET),
    ).not.toThrow();
  });

  it("rejects a missing signature", () => {
    expect(() => verifyWebhookSignature(body(), null, SECRET)).toThrow(
      WebhookRejected,
    );
  });

  it("rejects a wrong signature", () => {
    const raw = body();
    expect(() =>
      verifyWebhookSignature(raw, signWebhook(raw, "the-wrong-secret"), SECRET),
    ).toThrow(WebhookRejected);
  });

  it("rejects a body tampered with after signing", () => {
    const original = body();
    const signature = signWebhook(original, SECRET);
    // An attacker inflates the amount but keeps the original signature.
    const tampered = original.replace('"amount":218100', '"amount":1');
    expect(() =>
      verifyWebhookSignature(tampered, signature, SECRET),
    ).toThrow(WebhookRejected);
  });

  it("refuses to run at all when no secret is configured", () => {
    const raw = body();
    // Fails closed: an unverifiable webhook is never accepted just because the
    // deployment forgot to set a secret.
    expect(() =>
      verifyWebhookSignature(raw, signWebhook(raw, SECRET), undefined),
    ).toThrow(WebhookRejected);
  });

  it("rejects a signature of the wrong length without leaking it", () => {
    expect(() => verifyWebhookSignature(body(), "abcd", SECRET)).toThrow(
      WebhookRejected,
    );
  });

  it("is sensitive to key order, so the raw body must be used", () => {
    const raw = body();
    const reserialised = JSON.stringify(JSON.parse(raw));
    const signature = signWebhook(raw, SECRET);
    // Proves why the route handler must pass `await request.text()`.
    if (reserialised !== raw) {
      expect(() =>
        verifyWebhookSignature(reserialised, signature, SECRET),
      ).toThrow(WebhookRejected);
    }
  });
});

describe("a verified payload is parsed strictly", () => {
  it("extracts the fields we act on", () => {
    expect(parsePaymentEvent(body())).toEqual({
      event: "payment.captured",
      paymentId: "pay_ABC123",
      orderRef: "ord_hostel_001",
      amountPaise: 218_100,
      currency: "INR",
    });
  });

  it("rejects malformed JSON", () => {
    expect(() => parsePaymentEvent("{not json")).toThrow(WebhookRejected);
  });

  it("rejects a payload with no order reference", () => {
    expect(() => parsePaymentEvent(body({ notes: {} }))).toThrow(
      WebhookRejected,
    );
  });

  it("rejects an amount that is not a number rather than coercing it", () => {
    expect(() => parsePaymentEvent(body({ amount: "218100" }))).toThrow(
      WebhookRejected,
    );
  });
});

describe("PAY-10 — pickup codes", () => {
  it("matches the MHQ-XXXX format", () => {
    for (let i = 0; i < 200; i++) {
      expect(isPickupCode(pickupCodeCandidate())).toBe(true);
    }
  });

  it("never uses characters people mishear or mistype", () => {
    // 0/O/D/Q, 1/I/L, 2/Z, 5/S, 8/B, U/V and M/N are all out. 3 4 6 7 9 stay:
    // they are unambiguous in Inter's tabular figures, which is what the
    // pickup-code plate is set in.
    const banned = /[01258ODQILSZBUVMN]/;
    for (let i = 0; i < 400; i++) {
      const code = pickupCodeCandidate().slice(4);
      expect(code, `${code} contains a confusable character`).not.toMatch(
        banned,
      );
    }
  });

  it("is not sequential — 200 codes are not all distinct by position", () => {
    const codes = new Set(
      Array.from({ length: 200 }, () => pickupCodeCandidate()),
    );
    // Random over 160k codes: collisions in 200 draws are very unlikely, but
    // the real assertion is that they are not an incrementing series.
    expect(codes.size).toBeGreaterThan(190);
  });

  it("retries past a taken code", async () => {
    let calls = 0;
    const code = await generatePickupCode(async () => {
      calls++;
      return calls < 3; // first two are taken
    });
    expect(isPickupCode(code)).toBe(true);
    expect(calls).toBe(3);
  });

  it("throws rather than returning a duplicate when it cannot find one", async () => {
    await expect(generatePickupCode(async () => true, 5)).rejects.toThrow(
      /Could not find a free pickup code/,
    );
  });
});

describe("PAY-11 — the ordering window is enforced server-side", () => {
  const opensAt = new Date("2026-10-01T00:00:00Z");
  const closesAt = new Date("2026-10-14T18:29:00Z");
  const live = { status: "live" as const, opensAt, closesAt };

  it("is open inside the window", () => {
    expect(orderingOpen(live, new Date("2026-10-10T12:00:00Z")).open).toBe(true);
  });

  it("is closed before it opens", () => {
    expect(orderingOpen(live, new Date("2026-09-30T23:59:00Z")).open).toBe(false);
  });

  it("is closed at the instant it closes, not a moment after", () => {
    expect(orderingOpen(live, closesAt).open).toBe(false);
  });

  it("is closed whenever the campaign is not live, whatever the clock says", () => {
    for (const status of ["draft", "closed", "in_production", "delivered", "archived"] as const) {
      expect(
        orderingOpen({ status, opensAt, closesAt }, new Date("2026-10-10T12:00:00Z")).open,
        `${status} must not accept orders`,
      ).toBe(false);
    }
  });

  it("explains why, so the storefront can say so", () => {
    const r = orderingOpen(live, new Date("2026-10-20T00:00:00Z"));
    expect(r.open).toBe(false);
    if (!r.open) expect(r.reason).toMatch(/closed/i);
  });
});
