"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Choice";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea, TextInput } from "@/components/ui/TextInput";
import { submitQuote, type QuoteResult } from "./actions";

/**
 * MKT-3. Captures entity name and type, contact name, phone and email,
 * occasion, headcount, items of interest, budget range, required-by date, and
 * whether a storefront is wanted.
 *
 * One page, no multi-step wizard: an organiser filling this in is usually doing
 * it between two other things, and a wizard loses them at step two.
 */
export function QuoteForm() {
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setResult(await submitQuote(formData));
    setPending(false);
  }

  if (result?.ok) {
    return (
      <Alert tone="success" title="Got it — we'll come back within one working day" icon="tick">
        Your reference is <span className="figure">{result.reference}</span>. We
        reply with a per-unit price, a delivery date and a storefront link on{" "}
        <span className="figure">{result.contactEmail}</span>. If the date is
        tight, say so in the reply and we&apos;ll tell you straight away whether
        it holds.
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-8">
      {result && !result.ok ? (
        <Alert tone="danger" title="That didn't send" icon="cross">
          {result.error}
        </Alert>
      ) : null}

      <fieldset className="space-y-6">
        <legend className="t-h4 text-ink">Who you are</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Club, department or company">
            {({ id }) => (
              <TextInput id={id} name="entityName" required placeholder="Music Club" />
            )}
          </Field>

          <Field label="What kind of group">
            {({ id }) => (
              <Select id={id} name="entityType" required defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                <option value="club">Student club or society</option>
                <option value="fest">Fest or event team</option>
                <option value="department">College department</option>
                <option value="corporate">Company — HR or People Ops</option>
                <option value="alumni">Alumni cell</option>
                <option value="other">Something else</option>
              </Select>
            )}
          </Field>

          <Field label="Your name">
            {({ id }) => <TextInput id={id} name="contactName" required />}
          </Field>

          <Field
            label="Phone"
            helper="We use WhatsApp for anything urgent."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                name="phone"
                type="tel"
                inputMode="tel"
                required
                aria-describedby={describedBy}
                placeholder="+91"
              />
            )}
          </Field>

          <div className="sm:col-span-2">
            <Field label="Email">
              {({ id }) => (
                <TextInput id={id} name="email" type="email" required />
              )}
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="t-h4 text-ink">What you need</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="What's the occasion">
            {({ id }) => (
              <TextInput
                id={id}
                name="occasion"
                required
                placeholder="Hostel Night, onboarding kits, fest merch"
              />
            )}
          </Field>

          <Field
            label="Roughly how many people"
            helper="An estimate is fine — the price tiers key off the final number."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                name="headcount"
                type="number"
                inputMode="numeric"
                min={1}
                required
                aria-describedby={describedBy}
                placeholder="250"
              />
            )}
          </Field>

          <Field label="Budget per person">
            {({ id }) => (
              <Select id={id} name="budget" required defaultValue="">
                <option value="" disabled>
                  Choose a range
                </option>
                <option value="under-300">Under ₹300</option>
                <option value="300-600">₹300 – ₹600</option>
                <option value="600-1000">₹600 – ₹1,000</option>
                <option value="1000-1500">₹1,000 – ₹1,500</option>
                <option value="over-1500">Over ₹1,500</option>
                <option value="unsure">Not sure yet</option>
              </Select>
            )}
          </Field>

          <Field
            label="Needed by"
            helper="The date it has to be in people's hands."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                name="requiredBy"
                type="date"
                required
                aria-describedby={describedBy}
              />
            )}
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="What you're thinking of"
              helper="Hoodies, tees, caps, totes, bottles, stickers, a full kit — or describe it."
            >
              {({ id, describedBy }) => (
                <Textarea
                  id={id}
                  name="items"
                  rows={3}
                  aria-describedby={describedBy}
                  placeholder="320 GSM hoodies with a sleeve print, plus a sticker sheet."
                />
              )}
            </Field>
          </div>
        </div>

        <Checkbox
          name="wantsStorefront"
          defaultChecked
          label="Set up a storefront so people order and pay themselves"
          note="The alternative is a single invoice to you, and you collect. Most groups want the storefront."
        />
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          loading={pending}
        >
          {pending ? "Sending…" : "Send this to The Merch HQ"}
        </Button>
        <p className="t-body-sm text-ink-muted">
          One working day, and a real person replies.
        </p>
      </div>
    </form>
  );
}
