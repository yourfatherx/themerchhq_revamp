"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { OtpInput } from "@/components/ui/OtpInput";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ColourSwatches, SizePicker } from "@/components/ui/SizePicker";
import { SearchInput, Select } from "@/components/ui/Select";
import { Textarea, TextInput } from "@/components/ui/TextInput";

const SIZES = [
  { label: "S" },
  { label: "M" },
  { label: "L" },
  { label: "XL" },
  { label: "2XL", retired: true },
] as const;

const COLOURS = [
  { name: "Navy", hex: "#1E2A54" },
  { name: "Bone", hex: "#EFE9DC" },
  { name: "Forest", hex: "#1F4234" },
  { name: "Marigold", hex: "#FFC23C" },
  { name: "Black", hex: "#13111F" },
] as const;

export function FormsDemo() {
  const [qty, setQty] = useState(24);
  const [size, setSize] = useState<string | null>("L");
  const [colour, setColour] = useState<string | null>("Navy");
  const [otp, setOtp] = useState("");
  const [notes, setNotes] = useState("");

  const MOQ = 40;
  const gap = MOQ - qty;

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2">
        <Field
          label="Roll number or employee ID"
          helper="Free text — we don't validate the format, we just need something to match you against the list."
        >
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              defaultValue="2022B4A70123G"
            />
          )}
        </Field>

        <Field
          label="Email"
          error="Use your company address — this storefront is open to verified employees only."
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              defaultValue="priya@gmail.com"
            />
          )}
        </Field>

        <Field
          label="Campaign"
          helper="Set by your club — ask them to change it."
        >
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              disabled
              defaultValue="Hostel Night 2026"
            />
          )}
        </Field>

        <Field label="Roll number" helper="Checking against the member list…">
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              loading
              defaultValue="2022B4A70"
            />
          )}
        </Field>

        <Field label="Collection point">
          {({ id }) => (
            <Select id={id} defaultValue="office">
              <option value="office">Collect from the department office</option>
              <option value="h7">Hostel H7 common room</option>
              <option value="courier">Courier to my address · +₹90</option>
            </Select>
          )}
        </Field>

        <Field label="Collection point" helper="Not offered on this campaign.">
          {({ id, describedBy }) => (
            <Select id={id} aria-describedby={describedBy} disabled>
              <option>Courier — not offered on this campaign</option>
            </Select>
          )}
        </Field>

        <div className="md:col-span-2">
          <Field
            label="Anything we should know"
            optional
            labelAside={
              <span className="t-caption figure">{notes.length} / 280</span>
            }
          >
            {({ id }) => (
              <Textarea
                id={id}
                maxLength={280}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sleeve name, print preference, anything else."
              />
            )}
          </Field>
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Search</h3>
        <p className="t-caption mt-1">A pill — the face primitive at full radius</p>
        <div className="mt-5 max-w-md">
          <SearchInput placeholder="Name, phone, roll number or MHQ code" />
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">OTP · phone verification</h3>
        <p className="t-caption mt-1">
          Six cells, 52×60 · paste fills all six · numeric keypad · live, try it
        </p>
        <div className="mt-5">
          <OtpInput value={otp} onChange={setOtp} autoFocus={false} />
          <p className="t-body-sm mt-3 text-ink-muted">
            Sent to <span className="figure">+91 98•••• ••31</span>.{" "}
            <span className="figure">Resend in 0:24</span> — never disabled, the
            countdown lives inside the button.
          </p>
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Quantity stepper</h3>
        <p className="t-caption mt-1">
          48px hit targets · tabular value · floor of 1, no cap · live, try it
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            label="Heavyweight hoodie, XL"
          />
          <span
            className={cnBadge(gap > 0)}
            // Warning inside a hoverable row is a solid badge, never amber text.
          >
            {gap > 0 ? `${gap} more to reach ${MOQ}` : `MOQ met · tier 2 price`}
          </span>
          <QuantityStepper
            value={1}
            onChange={() => {}}
            label="At the floor"
          />
          <QuantityStepper
            value={0}
            onChange={() => {}}
            min={0}
            disabled
            label="Disabled"
          />
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          There is no stock ceiling — everything is made to order against the
          campaign — so the stepper has a floor of 1 and no cap. The only limit a
          buyer meets is the close date.
        </p>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Size picker</h3>
        <p className="t-caption mt-1">
          Selection is a fill, not a tick · chosen: {size ?? "none"}
        </p>
        <div className="mt-5">
          <SizePicker options={SIZES} value={size} onChange={setSize} />
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          2XL isn&apos;t offered on this campaign — muted fill, Lavender edge, no
          pointer. It stays in the row so the buyer doesn&apos;t wonder whether
          they missed it.
        </p>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Colour swatches</h3>
        <p className="t-caption mt-1">Chosen: {colour ?? "none"}</p>
        <div className="mt-5">
          <ColourSwatches
            options={COLOURS}
            value={colour}
            onChange={setColour}
          />
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          Garment colour is the one place a field colour appears — Marigold is a
          real blank we stock, not an interface accent.
        </p>
      </div>
    </div>
  );
}

/** Success and warning states are solid badges so they stay legible on any row. */
function cnBadge(pending: boolean) {
  return [
    "figure inline-flex items-center rounded-full px-4 py-2 text-[14px] text-surface",
    pending ? "bg-state-warning" : "bg-state-success",
  ].join(" ");
}
