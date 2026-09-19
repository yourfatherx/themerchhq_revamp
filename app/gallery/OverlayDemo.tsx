"use client";

import { useState } from "react";
import { Icon } from "@/components/brand/Icon";
import { Button } from "@/components/ui/Button";
import { Checkbox, Radio, Toggle } from "@/components/ui/Choice";
import { Drawer, Modal } from "@/components/ui/Modal";
import { Toast, ToastRegion, Tooltip } from "@/components/ui/Toast";

export function OverlayDemo() {
  const [agreed, setAgreed] = useState(false);
  const [policy, setPolicy] = useState("extend");
  const [remind, setRemind] = useState(true);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [toasts, setToasts] = useState<number[]>([]);

  return (
    <div className="space-y-14">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="t-h4 text-ink">Checkbox</h3>
          <p className="t-caption mt-1">
            22px at radius sm · the whole label row is the hit area
          </p>
          <div className="mt-4">
            <Checkbox
              label="I've checked the size chart"
              note="Size changes close 24 hours after payment."
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <Checkbox label="Some sizes picked" indeterminate readOnly />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Needs a decision" invalid readOnly />
          </div>
        </div>

        <div>
          <h3 className="t-h4 text-ink">Radio</h3>
          <p className="t-caption mt-1">If the campaign misses MOQ</p>
          <div className="mt-4" role="radiogroup" aria-label="MOQ failure policy">
            <Radio
              name="moq"
              label="Extend the close date"
              note="Keep the storefront open for another week."
              checked={policy === "extend"}
              onChange={() => setPolicy("extend")}
            />
            <Radio
              name="moq"
              label="Refund everyone"
              note="Every order is refunded in full, automatically."
              checked={policy === "refund"}
              onChange={() => setPolicy("refund")}
            />
          </div>
        </div>

        <div>
          <h3 className="t-h4 text-ink">Toggle</h3>
          <p className="t-caption mt-1">Track 48×26 · knob 22</p>
          <div className="mt-4">
            <Toggle
              label="Remind me on WhatsApp before the storefront closes"
              checked={remind}
              onChange={(e) => setRemind(e.target.checked)}
            />
            <Toggle label="Disabled — set by your HR admin" disabled />
          </div>
          <p className="t-body-sm mt-3 text-ink-muted">
            The off track is Slate, not Lavender — a 1.70:1 track reads as
            disabled rather than off.
          </p>
        </div>
      </div>

      <div>
        <h3 className="t-h4 text-ink">Try the real thing</h3>
        <p className="t-caption mt-1">
          Modal and drawer are native &lt;dialog&gt; — focus trap, Escape and top layer included
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button variant="secondary" onClick={() => setModal(true)}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={() => setDrawer(true)}>
            Open cart drawer
          </Button>
          <Button
            variant="secondary"
            onClick={() => setToasts((t) => [...t, Date.now()])}
          >
            Fire toast
          </Button>
          <Tooltip label="Minimum order quantity. Under it, the campaign either extends or refunds — never prints at a loss.">
            <span className="inline-flex items-center gap-1 text-[15px] text-accent underline decoration-dotted underline-offset-4">
              What&apos;s MOQ?
              <Icon name="dot" size={16} />
            </span>
          </Tooltip>
        </div>
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
          Toasts are always ink, never semantic — a red toast competes with the
          inline alert that caused it. The icon carries the state, and white on
          ink is 18.62:1.
        </p>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Close the storefront?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Keep it open
            </Button>
            <Button variant="destructive" onClick={() => setModal(false)}>
              Close &amp; send to production
            </Button>
          </>
        }
      >
        50 people have ordered and you&apos;re past the 40-unit minimum. Closing
        now locks the sizing spread and sends it to production — nobody can add
        to this campaign afterwards.
      </Modal>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Your order · 2"
        footer={
          <Button fullWidth size="lg" trailingIcon={<Icon name="arrow" size={20} />}>
            Checkout
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="flex justify-between gap-4">
            <div>
              <p className="t-body font-medium text-ink">Heavyweight hoodie</p>
              <p className="t-body-sm text-ink-muted">Navy · L · 2 × ₹899</p>
            </div>
            <p className="figure text-ink">₹1,798</p>
          </div>
          <div className="flex justify-between gap-4">
            <div>
              <p className="t-body font-medium text-ink">Campus cap</p>
              <p className="t-body-sm text-ink-muted">Bone · 1 × ₹549</p>
            </div>
            <p className="figure text-ink">₹549</p>
          </div>
          <div className="flex justify-between gap-4 border-t border-hairline pt-5">
            <p className="t-body font-medium text-ink">Subtotal</p>
            <p className="figure text-ink">₹2,347</p>
          </div>
        </div>
      </Drawer>

      <ToastRegion>
        {toasts.map((id) => (
          <Toast
            key={id}
            action={{ label: "Undo", onClick: () => {} }}
            onDismiss={() => setToasts((t) => t.filter((x) => x !== id))}
          >
            Size changed to L
          </Toast>
        ))}
      </ToastRegion>
    </div>
  );
}
