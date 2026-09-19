import type { Metadata } from "next";
import { Icon } from "@/components/brand/Icon";
import { ICONS, type IconName } from "@/components/brand/icons";
import { Logo } from "@/components/brand/Logo";
import { Dot, Pill, Primitive } from "@/components/brand/primitives";
import { ratio } from "@/lib/contrast";
import { OPERATIONAL, PAIRINGS, PALETTE, WITHHELD } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Tokens — The Merch HQ",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  { name: "New Car", hex: PALETTE.brand, token: "--color-brand", use: "Hero blue. Accent, CTAs, links, icons." },
  { name: "Resolution Blue", hex: PALETTE.brandDeep, token: "--color-brand-deep", use: "Depth, panels, type, footers." },
  { name: "Chinese Black", hex: PALETTE.ink, token: "--color-ink", use: "Body text and dark grounds. The default ink." },
  { name: "Ink Gray", hex: PALETTE.inkMuted, token: "--color-ink-muted", use: "Anything set under 24px that isn't full ink." },
  { name: "Slate Gray", hex: PALETTE.rule, token: "--color-rule", use: "Rules, keylines, input borders. Never text." },
  { name: "Lavender Gray", hex: PALETTE.tint, token: "--color-tint", use: "Tint plates, flat-lay grounds, garment colour." },
  { name: "Sunken", hex: PALETTE.surfaceSunken, token: "--color-surface-sunken", use: "Section bands, table zebra." },
  { name: "Hover", hex: PALETTE.surfaceHover, token: "--color-surface-hover", use: "Row and card hover." },
];

const TYPE = [
  { cls: "t-display", name: "Display", spec: "Archivo 800 · 76/0.98 · −4%" },
  { cls: "t-h1", name: "H1", spec: "Archivo 800 · 52/1.04 · −3.5%" },
  { cls: "t-h2", name: "H2", spec: "Archivo 700 · 38/1.10 · −3%" },
  { cls: "t-h3", name: "H3", spec: "Archivo 700 · 27/1.18 · −2.5%" },
  { cls: "t-h4", name: "H4", spec: "Archivo 700 · 20/1.28 · −2%" },
  { cls: "t-body-lg", name: "Body large", spec: "Inter 400 · 18/1.60" },
  { cls: "t-body", name: "Body", spec: "Inter 400 · 16/1.55" },
  { cls: "t-body-sm", name: "Body small", spec: "Inter 400 · 14/1.50" },
  { cls: "t-label", name: "Label", spec: "Inter 600 · 13/1.20 · +10% · upper" },
  { cls: "t-caption", name: "Caption", spec: "Inter 500 · 13/1.40 · Ink Gray" },
];

function Section({
  n,
  title,
  lede,
  children,
}: {
  n: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
      <Pill>{n}</Pill>
      <h2 className="t-h2 mt-6 text-ink">{title}</h2>
      {lede ? (
        <p className="t-body-lg mt-4 max-w-[68ch] text-ink-muted">{lede}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function TokensPage() {
  return (
    <main>
      <header className="border-b border-hairline px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Logo variant="horizontal" tone="blue" width={200} priority />
          <h1 className="t-h1 mt-8 max-w-[22ch] text-ink">
            Every ratio here is measured, not estimated
          </h1>
          <p className="t-body-lg mt-4 max-w-[68ch] text-ink-muted">
            This page renders the shipped tokens and computes each contrast ratio
            at render time. It is the specimen that proves{" "}
            <code className="font-mono text-[15px]">app/globals.css</code> and
            the design system agree. Not indexed, not linked from the site.
          </p>
        </div>
      </header>

      <Section
        n="01 · Colour"
        title="Two blues, and white does the heavy lifting"
        lede="White is the ground at 60%. New Car carries the emphasis at 30% — one panel, one headline block. Resolution Blue is the closer at 10%. Measured per surface, never per campaign."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SWATCHES.map((s) => (
            <div key={s.token} className="rounded-lg border border-hairline">
              <div
                className="h-24 rounded-t-lg"
                style={{ background: s.hex }}
              />
              <div className="p-5">
                <h3 className="t-h4 text-ink">{s.name}</h3>
                <p className="figure mt-1 text-[14px] text-ink-muted">
                  {s.hex} · {ratio(s.hex, PALETTE.surface).toFixed(2)}:1 on white
                </p>
                <p className="t-body-sm mt-3 text-ink-muted">{s.use}</p>
                <code className="mt-3 block font-mono text-[13px] text-brand">
                  {s.token}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n="02 · Pairings"
        title="Approved, measured at render time"
        lede="Each row computes its own ratio in the browser. If a value here disagrees with the design system, the page is the thing telling the truth."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-hairline">
              <th className="t-label py-3 text-ink-muted">Sample</th>
              <th className="t-label py-3 text-ink-muted">Pairing</th>
              <th className="t-label py-3 text-ink-muted">Measured</th>
              <th className="t-label py-3 text-ink-muted">Permitted for</th>
            </tr>
          </thead>
          <tbody>
            {PAIRINGS.map((p) => {
              const m = ratio(p.fg, p.bg);
              return (
                <tr key={p.label} className="border-b border-hairline">
                  <td className="py-4 pr-6">
                    <span
                      className="inline-block rounded-sm px-4 py-2 whitespace-nowrap"
                      style={{ background: p.bg, color: p.fg }}
                    >
                      250 kits
                    </span>
                  </td>
                  <td className="t-body-sm py-4 pr-6 text-ink">{p.label}</td>
                  <td className="figure py-4 pr-6 text-[15px] text-ink">
                    {m.toFixed(2)}:1
                    <span className="t-caption ml-2">
                      {Math.abs(m - p.stated) < 0.06 ? "✓" : "drift"}
                    </span>
                  </td>
                  <td className="t-body-sm py-4 text-ink-muted">{p.use}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>

        <h3 className="t-h3 mt-14 text-ink">Withheld, on purpose</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {WITHHELD.map((w) => (
            <div
              key={w.label}
              className="rounded-lg border border-hairline bg-surface-sunken p-6"
            >
              <p className="figure text-[15px] text-ink">
                {ratio(w.fg, w.bg).toFixed(2)}:1 — {w.label}
              </p>
              <p className="t-body-sm mt-3 text-ink-muted">{w.why}</p>
            </div>
          ))}
        </div>

        <h3 className="t-h3 mt-14 text-ink">Operational, quarantined</h3>
        <p className="t-body mt-3 max-w-[68ch] text-ink-muted">
          Storefront order states, confirmation messages and shipment notices.
          That is the entire permitted surface. A red headline here is a bug, not
          a decision.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {OPERATIONAL.map((o) => (
            <span
              key={o.label}
              className="figure rounded-full px-4 py-2 text-[14px] text-surface"
              style={{ background: o.fg }}
            >
              {o.label} · {ratio(o.fg, PALETTE.surface).toFixed(2)}:1 · {o.use}
            </span>
          ))}
        </div>
      </Section>

      <Section
        n="03 · Typography"
        title="Archivo shouts. Inter explains."
        lede="Archivo at 700 and 800 only, tracking tightening as size grows. Inter at 400 for body, 500 for every figure, 600 for labels. The wordmark is artwork, never Archivo."
      >
        <div className="divide-y divide-tint">
          {TYPE.map((t) => (
            <div
              key={t.cls}
              className="grid items-baseline gap-4 py-6 md:grid-cols-[1fr_220px]"
            >
              <p className={`${t.cls} text-ink`}>Merch, handled.</p>
              <p className="t-caption">
                {t.name} · {t.spec}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-lg bg-surface-sunken p-8">
          <p className="t-label text-ink-muted">Figures are non-negotiable</p>
          <p className="figure mt-3 text-[28px] text-ink">
            ₹1,180 · 250 kits · 18 Nov · MHQ-4821
          </p>
          <p className="t-body-sm mt-3 text-ink-muted">
            Every number a client acts on is Inter 500 with tabular-nums, so a
            size table does not reflow as the numbers change.
          </p>
        </div>
      </Section>

      <Section
        n="04 · Space, radius, elevation"
        title="Rounded off the mark, shadowed in blue"
        lede="Elevation is blue-tinted — rgba(2,28,139,·), never neutral gray. Flat fills are the rule, so elevation is the one permitted softness and it stops at e3."
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="t-label text-ink-muted">Radii</p>
            <div className="mt-5 flex flex-wrap items-end gap-5">
              {[
                ["rounded-sm", "sm · 6", "Badges, swatches"],
                ["rounded-md", "md · 12", "Buttons, inputs"],
                ["rounded-lg", "lg · 20", "Cards, images"],
                ["rounded-xl", "xl · 28", "Hero plates, bands"],
                ["rounded-full", "pill · 999", "The face"],
              ].map(([cls, label, use]) => (
                <div key={label}>
                  <div className={`size-24 bg-accent-tint ${cls}`} />
                  <p className="t-caption mt-2">{label}</p>
                  <p className="t-caption">{use}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label text-ink-muted">Elevation</p>
            <div className="mt-5 space-y-5">
              {[
                [
                  "border border-hairline",
                  "Resting — a hairline and the canvas/surface step. No shadow.",
                ],
                [
                  "border border-hairline-strong",
                  "Hovered — the same hairline, darkened. Still no shadow.",
                ],
                [
                  "shadow-e3",
                  "e3 — modal, drawer and toast. The only shadow in the system.",
                ],
              ].map(([cls, label]) => (
                <div
                  key={label}
                  className={`t-body-sm rounded-lg bg-surface p-5 text-ink ${cls}`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        n="05 · Graphic language"
        title="Four primitives, taken off the mark"
        lede="Dome, pill, dot, cut. Nothing in the system may be finer than the dot. Negative space removes material; it is never a white shape laid on top."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["dome", "Dome", "The gorilla's back. Crops, panel tops, sticker shapes, photo masks."],
              ["pill", "Pill", "The face. Labels, status chips, price tags, garment care patches."],
              ["dot", "Dot", "The eyes. The smallest permitted detail anywhere."],
              ["cut", "Cut", "The leg gaps. Negative space removes material."],
            ] as const
          ).map(([name, label, use]) => (
            <div key={name} className="rounded-lg border border-hairline p-6">
              <Primitive name={name} size={104} className="text-brand" />
              <h3 className="t-h4 mt-5 text-ink">{label}</h3>
              <p className="t-body-sm mt-2 text-ink-muted">{use}</p>
            </div>
          ))}
        </div>

        <h3 className="t-h3 mt-14 text-ink">
          Iconography — solid fills, three shapes, one word beside it
        </h3>
        <p className="t-body mt-3 max-w-[68ch] text-ink-muted">
          A 24-unit grid. Solid New Car fill, no outline, no stroke, no second
          tint. Detail is knocked through with a mask, never a white shape laid
          on top. Never a downloaded set, never an emoji, never in an operational
          colour.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {(Object.keys(ICONS) as IconName[]).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 rounded-md border border-hairline px-3 py-2"
            >
              <Icon name={name} size={24} className="text-brand" />
              <span className="t-body-sm text-ink">{name}</span>
            </span>
          ))}
        </div>
      </Section>

      <Section
        n="06 · Identity"
        title="Five approved grounds, and no photograph among them"
        lede="On imagery the logo sits on a solid blue or white block — never straight on the picture, and never in a softened or blurred panel."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {(
            [
              ["White", PALETTE.surface, "blue", "Primary ground. Blue artwork."],
              ["New Car", PALETTE.brand, "white", "White artwork only."],
              ["Resolution Blue", PALETTE.brandDeep, "white", "White artwork only."],
              ["Chinese Black", PALETTE.ink, "white", "White artwork only."],
              ["Lavender Gray", PALETTE.tint, "deep", "Resolution Blue artwork only."],
            ] as const
          ).map(([name, bg, tone, note]) => (
            <div key={name} className="rounded-lg border border-hairline">
              <div
                className="flex h-32 items-center justify-center rounded-t-lg"
                style={{ background: bg }}
              >
                <Logo variant="mark" tone={tone} width={64} alt="" />
              </div>
              <div className="p-4">
                <p className="t-body-sm font-medium text-ink">{name}</p>
                <p className="t-caption mt-1">{note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-end gap-10 rounded-lg bg-surface-sunken p-8">
          <div>
            <Logo variant="stacked" tone="blue" width={140} alt="" />
            <p className="t-caption mt-3">Stacked · min 96px</p>
          </div>
          <div>
            <Logo variant="horizontal" tone="blue" width={200} alt="" />
            <p className="t-caption mt-3">Horizontal · min 140px</p>
          </div>
          <div>
            <Logo variant="mark" tone="blue" width={56} alt="" />
            <p className="t-caption mt-3">Mark · min 32px</p>
          </div>
          <div>
            <Logo variant="wordmark" tone="blue" width={180} alt="" />
            <p className="t-caption mt-3">Wordmark · min 120px</p>
          </div>
        </div>
      </Section>

      <Section
        n="07 · Motion"
        title="Quick, not rushed"
        lede="One curve, two durations, a hard ceiling of 300ms. Nothing in this system animates to be noticed. Reduced motion is respected globally."
      >
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-surface transition-colors duration-150 ease-brand hover:bg-accent-deep active:bg-brand-pressed"
          >
            <span className="t-body font-medium">Order my hoodie</span>
            <Icon name="arrow" size={20} />
          </button>
          <span className="inline-flex items-center gap-3 rounded-lg border border-hairline px-5 py-3">
            <Dot size={10} className="text-brand" />
            <span className="t-body-sm text-ink">
              150ms micro · 250ms overlay · cubic-bezier(.2, 0, 0, 1)
            </span>
          </span>
        </div>
      </Section>

      <footer className="mt-10 bg-brand-deep px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Logo variant="horizontal" tone="white" width={160} alt="" />
          <p className="t-body-sm mt-5 text-white/70">
            Light theme only · white leads · v1.0 · September 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
