import type { Metadata } from "next";
import { Icon } from "@/components/brand/Icon";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/brand/primitives";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { SiteFooter, StorefrontFooterMark } from "@/components/chrome/SiteFooter";
import { SiteNavbar } from "@/components/chrome/SiteNavbar";
import { StorefrontNavbar } from "@/components/chrome/StorefrontNavbar";
import { CommerceDemo } from "./CommerceDemo";
import { DataDemo } from "./DataDemo";
import { OverlayDemo } from "./OverlayDemo";
import { FormsDemo } from "./FormsDemo";

export const metadata: Metadata = {
  title: "Components — The Merch HQ",
  robots: { index: false, follow: false },
};

function Group({
  id,
  n,
  title,
  lede,
  onDark = false,
  children,
}: {
  id: string;
  n: string;
  title: string;
  lede?: string;
  onDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
      <Pill tone={onDark ? "inverse" : "outline"}>{n}</Pill>
      <h2 className={cn("t-h2 mt-6", onDark ? "text-surface" : "text-ink")}>
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "t-body-lg mt-4 max-w-[68ch]",
            onDark ? "text-white/70" : "text-ink-muted",
          )}
        >
          {lede}
        </p>
      ) : null}
      <div className="mt-10 space-y-12">{children}</div>
    </section>
  );
}

function Spec({
  name,
  meta,
  note,
  children,
}: {
  name: string;
  meta: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="t-h4 text-ink">{name}</h3>
      <p className="t-caption mt-1">{meta}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">{children}</div>
      {note ? (
        <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">{note}</p>
      ) : null}
    </div>
  );
}

/** States are shown, not described — so each row renders the real control and
 *  the caption names which state it is sitting in. */
function States({ labels }: { labels: string }) {
  return <p className="t-caption mt-3 basis-full">{labels}</p>;
}

const arrow = <Icon name="arrow" size={20} />;

export default function GalleryPage() {
  return (
    <main>
      <header className="border-b border-hairline px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Logo variant="horizontal" tone="blue" width={200} priority />
          <h1 className="t-h1 mt-8 max-w-[20ch] text-ink">
            Components, in every state they reach
          </h1>
          <p className="t-body-lg mt-4 max-w-[68ch] text-ink-muted">
            Default, hover, focus-visible, active, disabled and loading — shown,
            not described. Interactive boundaries are Slate Gray; decorative
            rules are Lavender. Focus is 2px white offset plus 2px accent and is
            never removed. Every component reads its accent from{" "}
            <code className="font-mono text-[15px]">--color-accent</code>.
          </p>
        </div>
      </header>

      <Group
        id="actions"
        n="01 · Actions"
        title="Buttons"
        lede="Radius md · height 36 / 48 / 56 · label Inter 600 · 150ms. Never below 36px. On the storefront the order CTA is always lg and always full-width."
      >
        <Spec name="Primary" meta="accent fill · white label">
          <Button trailingIcon={arrow}>Order my hoodie</Button>
          <Button disabled>Storefront closed</Button>
          <Button loading>Placing order…</Button>
          <States labels="default · disabled · loading — hover, focus and active are live, use a pointer and Tab" />
        </Spec>

        <Spec name="Secondary" meta="white fill · Slate Gray hairline · ink label">
          <Button variant="secondary">See the size chart</Button>
          <Button variant="secondary" disabled>
            See the size chart
          </Button>
          <Button variant="secondary" loading>
            Loading chart…
          </Button>
        </Spec>

        <Spec
          name="Ghost"
          meta="no fill · accent label"
          note="Ghost has no resting boundary — it needs a solid button beside it to read as a control."
        >
          <Button variant="ghost">Change my size</Button>
          <Button variant="ghost" disabled>
            Window closed
          </Button>
        </Spec>

        <Spec
          name="Destructive"
          meta="Danger fill · red focus ring"
          note="Hover and pressed are Danger at 90% and 80% lightness. The focus ring turns red so it never promises a safe action. Ops-only — a buyer never sees one."
        >
          <Button variant="destructive">Refund all orders</Button>
          <Button variant="destructive" disabled>
            Refund all orders
          </Button>
        </Spec>

        <Spec
          name="Sizes"
          meta="sm 36 · md 48 (default) · lg 56"
          note="On the storefront — mobile-first by definition — the order CTA is always lg and always full-width."
        >
          <Button size="sm">Add to cart</Button>
          <Button size="md">Add to cart</Button>
          <Button size="lg">Add to cart</Button>
        </Spec>

        <Spec
          name="Icon button"
          meta="44×44 hit target · radius md · authored 24px glyph · always carries a label"
        >
          <IconButton icon="kit" label="View the kit" />
          <IconButton icon="kit" label="View the kit" disabled />
          <IconButton icon="arrow" label="Next step" shape="circular" />
          <IconButton icon="arrow" label="Next step" shape="circularOutline" />
        </Spec>
      </Group>

      <div className="bg-brand-deep">
        <Group
          id="inverse"
          n="01b · On a blue ground"
          onDark
          title="Inverse buttons"
          lede="On Resolution Blue, primary flips to a white fill with a blue label — 13.62:1 both ways. Secondary becomes a Lavender hairline. New Car is never used as a button on a blue panel: it measures 1.37:1 against Resolution Blue."
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button onDark trailingIcon={arrow}>
              Request a quote
            </Button>
            <Button onDark variant="secondary">
              See the catalogue
            </Button>
            <Button onDark variant="ghost">
              Talk to us
            </Button>
            <Button onDark disabled>
              Disabled
            </Button>
          </div>
        </Group>
      </div>

      <div className="border-y border-hairline bg-surface-sunken">
        <Group
          id="forms"
          n="02 · Forms & selection"
          title="Forms and selection"
          lede="A buyer never creates an account, so checkout is the only form they ever meet — and it has to survive a thumb on a mid-range Android. Every control is at least 44px tall, and every error says what to do rather than what went wrong."
        >
          <FormsDemo />
        </Group>
      </div>

      <Group
        id="campaign"
        n="03 · Campaign & commerce"
        title="Everything is made to order"
        lede="There is no inventory in this product — a campaign opens, collects orders against a minimum, closes, and prints. Every component here follows from that."
      >
        <CommerceDemo />
      </Group>

      <Group
        id="data"
        n="04 · Data, navigation & feedback"
        title="The dashboard is the demo"
        lede="The table below is what an organiser opens instead of a spreadsheet, and it has to be right the first time they look at it."
      >
        <DataDemo />
      </Group>

      <div className="border-y border-hairline bg-surface-sunken">
        <Group
          id="overlays"
          n="05 · Selection, overlays & feedback"
          title="Try the real thing"
          lede="Modal and drawer are native dialog elements, so focus trapping, Escape and the top layer come from the platform rather than from code that has to be kept right."
        >
          <OverlayDemo />
        </Group>
      </div>

      <Group
        id="chrome"
        n="06 · Navbar & footer"
        title="Two chromes, because there are two brands in play"
        lede="On a client storefront the client leads and our mark appears once, in the footer. On our own site we lead, and no client logo appears without written permission."
      >
        <div>
          <h3 className="t-h4 text-ink">Navbar · our own site</h3>
          <p className="t-caption mt-1">
            Horizontal lockup at 30px · no divider · one primary CTA
          </p>
          <div className="mt-5 overflow-hidden rounded-lg border border-hairline">
            <SiteNavbar />
          </div>
        </div>

        <div>
          <h3 className="t-h4 text-ink">Navbar · client storefront</h3>
          <p className="t-caption mt-1">
            76px · client logo at full size, ours absent · cart count is an accent pill, never a red dot
          </p>
          <div className="mt-5 overflow-hidden rounded-lg border border-hairline">
            <StorefrontNavbar
              tenantName="Music Club"
              campaignTitle="Hostel Night 2026"
              timeLeftLabel="2 days left"
              cartCount={2}
            />
          </div>
          <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
            The countdown lives in the navbar because it is the single most
            decision-relevant fact on the page. The client&rsquo;s accent
            replaces New Car throughout &mdash; here they happen to share it.
          </p>
        </div>

        <div>
          <h3 className="t-h4 text-ink">Footer</h3>
          <p className="t-caption mt-1">
            Resolution Blue panel · white lockup · links in Lavender at 8.01:1
          </p>
          <div className="mt-5 overflow-hidden rounded-lg">
            <SiteFooter />
          </div>
          <div className="mt-6 rounded-lg border border-hairline">
            <StorefrontFooterMark />
          </div>
          <p className="t-body-sm mt-4 max-w-[76ch] text-ink-muted">
            On a client storefront the footer is theirs, and our mark appears
            once as the horizontal lockup at 120px with the line
            &ldquo;Storefront by The Merch HQ&rdquo;.
          </p>
        </div>
      </Group>
    </main>
  );
}
