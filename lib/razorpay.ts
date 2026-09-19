import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay webhook verification (PAY-7).
 *
 * The order is created on a verified webhook, never on a browser redirect
 * (PAY-5). A redirect is attacker-controlled: anyone can open the success URL
 * and claim to have paid. The webhook is the only statement about payment we
 * trust, and only once its signature verifies.
 */

export class WebhookRejected extends Error {
  constructor(
    readonly reason:
      | "missing_signature"
      | "bad_signature"
      | "malformed_body"
      | "not_configured",
    message: string,
  ) {
    super(message);
    this.name = "WebhookRejected";
  }
}

/**
 * Verify `X-Razorpay-Signature` — HMAC-SHA256 of the **raw** body.
 *
 * The raw bytes matter: `JSON.parse` then `JSON.stringify` reorders keys and
 * drops whitespace, and the signature would no longer match. Route handlers
 * must pass `await request.text()`, never a re-serialised object.
 *
 * Compared in constant time, so the comparison cannot be used as an oracle to
 * recover a valid signature byte by byte.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string | undefined,
): void {
  if (!secret) {
    throw new WebhookRejected(
      "not_configured",
      "RAZORPAY_WEBHOOK_SECRET is not set — refusing to accept an unverifiable webhook.",
    );
  }
  if (!signature) {
    throw new WebhookRejected(
      "missing_signature",
      "Request carried no X-Razorpay-Signature header.",
    );
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest();

  let given: Buffer;
  try {
    given = Buffer.from(signature, "hex");
  } catch {
    throw new WebhookRejected("bad_signature", "Signature was not valid hex.");
  }

  // timingSafeEqual throws on a length mismatch, which would itself leak the
  // expected length — so check length first and fail the same way either way.
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    throw new WebhookRejected("bad_signature", "Signature did not verify.");
  }
}

/** Sign a payload the way Razorpay does. Used by tests and local replay. */
export function signWebhook(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

export type PaymentEvent = {
  event: string;
  paymentId: string;
  /** Our campaign + order reference, passed to the gateway as notes. */
  orderRef: string;
  amountPaise: number;
  currency: string;
};

/**
 * Pull the fields we act on out of a verified payload.
 *
 * Deliberately strict: anything unexpected is rejected rather than coerced. A
 * webhook that does not parse is a webhook we do not understand, and acting on
 * a guess would mean confirming an order for an amount nobody paid.
 */
export function parsePaymentEvent(rawBody: string): PaymentEvent {
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new WebhookRejected("malformed_body", "Body was not valid JSON.");
  }

  const b = body as Record<string, unknown>;
  const entity = (
    (b.payload as Record<string, unknown> | undefined)?.payment as
      | Record<string, unknown>
      | undefined
  )?.entity as Record<string, unknown> | undefined;

  if (typeof b.event !== "string" || !entity) {
    throw new WebhookRejected(
      "malformed_body",
      "Body did not carry payload.payment.entity.",
    );
  }

  const notes = (entity.notes ?? {}) as Record<string, unknown>;

  if (
    typeof entity.id !== "string" ||
    typeof entity.amount !== "number" ||
    typeof entity.currency !== "string" ||
    typeof notes.orderRef !== "string"
  ) {
    throw new WebhookRejected(
      "malformed_body",
      "Payment entity was missing id, amount, currency or notes.orderRef.",
    );
  }

  return {
    event: b.event,
    paymentId: entity.id,
    orderRef: notes.orderRef,
    amountPaise: entity.amount,
    currency: entity.currency,
  };
}

/** Events that mean money moved. Anything else is logged and ignored. */
export const CAPTURE_EVENTS = new Set(["payment.captured"]);
export const FAILURE_EVENTS = new Set(["payment.failed"]);
