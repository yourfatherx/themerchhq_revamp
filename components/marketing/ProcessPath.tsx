import Image from "next/image";
import { cn } from "@/lib/cn";
import { Chip, Eyebrow } from "./Bits";

/**
 * Four steps, numbered, as photographic plates.
 *
 * The numbering is earned: this content genuinely is a sequence, and step three
 * cannot happen before step two. The tilt, the dashed connector and the pinned
 * dots that used to carry it were not — they decorated a list that was already
 * ordered, and a rotated card is harder to read than a straight one for no gain
 * a reader receives.
 *
 * What the sequence actually turns on is who does the work, so that is what the
 * accent marks: the steps that are the organiser's are the ones tinted, and the
 * two we handle are not. It is the argument the section exists to make, and the
 * heading above states it outright.
 *
 * The plates sit straight on the page rather than inside a panel, because this
 * page's ground is already white — a white card on white would be a border
 * pretending to be structure.
 */

const STEPS = [
  {
    n: "01",
    title: "Tell us what you want",
    body: "Headcount, occasion, budget, and the date it has to exist by. One form, no call needed.",
    who: "You",
    image: "/studio/brief.jpg",
  },
  {
    n: "02",
    title: "We build the storefront",
    body: "Products, prices, size charts and your branding, on your own subdomain.",
    who: "Us",
    image: "/studio/storefront-build.jpg",
  },
  {
    n: "03",
    title: "Share one link",
    body: "Your batch orders and pays on it. You watch the size breakdown fill up.",
    who: "You",
    image: "/studio/share-link.jpg",
  },
  {
    n: "04",
    title: "We print and hand over",
    body: "Production starts at close. Delivered to one person with a collection list.",
    who: "Us",
    image: "/studio/print-press.jpg",
  },
] as const;

export function ProcessPath() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
      <span aria-hidden="true" className="block h-0.5 w-10 bg-accent" />
      <Eyebrow className="mt-4">How it works</Eyebrow>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <h2 className="t-h1 max-w-[16ch] text-ink">
          Four steps, and only one is yours.
        </h2>
        <p className="t-body max-w-[38ch] text-ink-muted lg:justify-self-end lg:pb-2 lg:text-right">
          You tell us what you want and share one link. We do the rest — the
          design, the storefront, the money, the printing and the handover.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2">
        {STEPS.map((s) => {
          const yours = s.who === "You";
          return (
            <li
              key={s.n}
              className="relative min-h-[240px] overflow-hidden rounded-lg bg-ink"
            >
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              {/* Dark enough that the plate carries white type whatever the
                  frame underneath happens to be doing. */}
              <span aria-hidden="true" className="absolute inset-0 bg-ink/78" />

              {/* Whole and vertically centred rather than cropped by the
                  corner — a numeral clipped by the plate edge reads as an
                  accident. It clears the copy column, which starts at 42%. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 left-5 -translate-y-1/2 text-[112px] leading-[0.8] font-bold tracking-[-0.05em] select-none",
                  yours ? "text-accent/70" : "text-white/25",
                )}
              >
                {s.n}
              </span>

              <div className="relative flex h-full flex-col justify-end p-6 pl-[42%]">
                <Chip tone={yours ? "accent" : "dark"} className="w-fit">
                  {s.who}
                </Chip>
                <h3 className="t-h4 mt-4 text-surface">{s.title}</h3>
                <p className="t-body-sm mt-2 text-white/75">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
