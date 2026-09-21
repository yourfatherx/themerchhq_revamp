import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Arrow, Chip, Eyebrow, Slab } from "./Bits";

/**
 * The operating numbers, as the reference's dark list block.
 *
 * The reference's screenshot shows one row filled in the accent, carrying chips
 * and an image, while its four siblings are plain. That is not a highlighted
 * row — it is a hover state caught mid-frame. Every row behaves the same way,
 * and reading it as a permanent highlight produced a list with one loud row
 * bolted to four quiet ones and no reason for the asymmetry.
 *
 * So: a row at rest is a phrase and a muted arrow. Pointed at, it fills with
 * the accent, opens to show what that number is made of, turns its arrow into a
 * filled control, and a photograph swings in over its right side on a tilt.
 *
 * Three things that make it behave rather than merely animate:
 *
 * `focus-visible` mirrors every hover rule, so the row opens for a keyboard as
 * well as a cursor — a reveal that only answers the mouse hides content from
 * anyone tabbing.
 *
 * The chips open with the `grid-rows-[0fr]` to `[1fr]` technique rather than a
 * guessed `max-height`, so the row grows to exactly its own content and the
 * easing does not stall on a wrong number. Growth runs downward, so the row
 * under the cursor keeps its top edge and the pointer never falls out of it.
 *
 * The photograph is positioned out of flow, which is why the arrow does not
 * shift when it arrives, and `motion-reduce` drops the movement to a plain fade
 * for anyone who asked for less of it.
 *
 * White on New Car is 6.49:1, so a filled row clears the floor.
 */

type Row = {
  label: string;
  href: string;
  facts: string[];
  image: string;
};

const ROWS: Row[] = [
  {
    label: "Five days from quote to a live storefront",
    href: "/quote",
    facts: ["Artwork approved", "Subdomain live", "Link sent"],
    image: "/studio/storefront-build.jpg",
  },
  {
    label: "Campaigns run from 40 to 2,000 units",
    href: "/catalogue",
    facts: ["40 minimum", "2,000 ceiling", "One price per tier"],
    image: "/studio/dispatch-boxes.jpg",
  },
  {
    label: "One per cent of orders reprinted for a size error",
    href: "/how-it-works",
    facts: ["Size picked on the page", "Table final at close"],
    image: "/studio/share-link.jpg",
  },
  {
    label: "No spreadsheets left for you to maintain",
    href: "/how-it-works",
    facts: ["CSV export", "GST invoice"],
    image: "/studio/packing-bench.jpg",
  },
];

export function ProofRow() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
      <Slab tone="ink" className="lg:p-14">
        <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:gap-10">
          <Eyebrow onDark className="lg:pt-3">
            Measured
          </Eyebrow>
          <h2 className="t-h1 max-w-[24ch] text-surface">
            Every number here is one we are held to on a real campaign.
          </h2>
        </div>

        <ul className="mt-14">
          {ROWS.map((r, i) => (
            <li
              key={r.href + r.label}
              className="relative border-b border-white/12 last:border-b-0 hover:z-10 focus-within:z-10"
            >
              <Link
                href={r.href}
                className="group relative flex items-center justify-between gap-6 rounded-lg px-6 py-7 transition-colors duration-300 outline-none hover:bg-accent focus-visible:bg-accent motion-reduce:transition-none"
              >
                <span className="min-w-0">
                  <span className="t-h4 block text-white/80 transition-colors duration-300 group-hover:text-surface group-focus-visible:text-surface motion-reduce:transition-none">
                    {r.label}
                  </span>

                  {/* 0fr → 1fr opens to the content's own height. */}
                  <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none">
                    <span className="overflow-hidden">
                      <span className="flex flex-wrap gap-2 pt-4">
                        {r.facts.map((f) => (
                          <Chip key={f} tone="dark">
                            {f}
                          </Chip>
                        ))}
                      </span>
                    </span>
                  </span>
                </span>

                {/* Out of flow, so the control below never shifts when it lands.
                    The tilt alternates down the list: a single repeated angle
                    reads as a template applied four times, where a pair that
                    leans against each other reads as prints set down by hand.
                    Both directions are written out in full because Tailwind
                    scans for whole class names and never sees an interpolated
                    one. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-1/2 right-24 hidden h-[210px] w-[250px] -translate-y-1/2 scale-90 overflow-hidden rounded-lg opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:transition-[opacity] lg:block",
                    i % 2 === 0
                      ? "group-hover:-rotate-6 group-focus-visible:-rotate-6"
                      : "group-hover:rotate-6 group-focus-visible:rotate-6",
                  )}
                >
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                </span>

                <span className="relative grid size-12 shrink-0 place-items-center rounded-full text-white/40 transition-colors duration-300 group-hover:bg-surface group-hover:text-ink group-focus-visible:bg-surface group-focus-visible:text-ink motion-reduce:transition-none">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Slab>
    </section>
  );
}
