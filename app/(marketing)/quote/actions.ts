"use server";

/**
 * MKT-3 — a quote request.
 *
 * Acceptance is "submission creates a `Tenant` record with status `lead` and
 * notifies ops". The `Tenant` table and the notification transport both land in
 * Phase 3 with the data spine, so this action currently validates and returns a
 * reference without persisting. The shape of `QuoteRequest` is the contract
 * that Phase 3 writes to the database, so wiring it up is one function body,
 * not a redesign.
 *
 * It does NOT pretend to have saved anything: `persisted` is false, and the
 * server logs the payload so nothing submitted in the interim is silently lost.
 */

export type QuoteRequest = {
  entityName: string;
  entityType: string;
  contactName: string;
  phone: string;
  email: string;
  occasion: string;
  headcount: number;
  budget: string;
  requiredBy: string;
  items: string;
  wantsStorefront: boolean;
};

export type QuoteResult =
  | { ok: true; reference: string; contactEmail: string; persisted: boolean }
  | { ok: false; error: string };

const REQUIRED: Array<keyof QuoteRequest> = [
  "entityName",
  "entityType",
  "contactName",
  "phone",
  "email",
  "occasion",
  "budget",
  "requiredBy",
];

export async function submitQuote(formData: FormData): Promise<QuoteResult> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  for (const key of REQUIRED) {
    if (!raw[key]?.trim()) {
      // Names the field to fix rather than the rule that was broken.
      return { ok: false, error: `Add your ${label(key)} and send it again.` };
    }
  }

  const headcount = Number(raw.headcount);
  if (!Number.isInteger(headcount) || headcount < 1) {
    return { ok: false, error: "Give a headcount of at least 1." };
  }

  const request: QuoteRequest = {
    entityName: raw.entityName.trim(),
    entityType: raw.entityType,
    contactName: raw.contactName.trim(),
    phone: raw.phone.trim(),
    email: raw.email.trim(),
    occasion: raw.occasion.trim(),
    headcount,
    budget: raw.budget,
    requiredBy: raw.requiredBy,
    items: (raw.items ?? "").trim(),
    wantsStorefront: raw.wantsStorefront === "on",
  };

  // TODO(Phase 3): create Tenant{status:'lead'} and notify ops (MKT-3).
  console.info("[quote] request received, not yet persisted", request);

  return {
    ok: true,
    reference: reference(request.entityName),
    contactEmail: request.email,
    persisted: false,
  };
}

function label(key: keyof QuoteRequest): string {
  const labels: Record<string, string> = {
    entityName: "club, department or company name",
    entityType: "group type",
    contactName: "name",
    phone: "phone number",
    email: "email",
    occasion: "occasion",
    budget: "budget range",
    requiredBy: "required-by date",
  };
  return labels[key] ?? key;
}

/** A human-readable handle for the reply thread. Not the order pickup code. */
function reference(entityName: string): string {
  const slug = entityName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `Q-${slug}-${n}`;
}
