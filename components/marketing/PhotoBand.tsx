import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * A photograph one viewport tall, with a caption card that rides down it.
 *
 * The card is `position: sticky` inside a layer that spans the whole band, so
 * as the band scrolls past, the card holds 40px from the top of the viewport
 * until the band's end carries it away. No script: the browser does it.
 *
 * Type never sits on the photograph itself — the brand permits that in the home
 * hero only, behind a measured scrim — so the title and link live on a solid
 * card. Three grounds, each a pairing the palette already states: white with
 * ink, ink with white, New Car with white.
 *
 * `half` bands are laid out in pairs by the caller: side by side at desktop,
 * stacked below it.
 */

type Tone = "surface" | "ink" | "brand";

const TONES: Record<Tone, { card: string; link: string }> = {
  surface: {
    card: "bg-surface text-ink",
    link: "border-ink text-ink hover:bg-ink hover:text-surface",
  },
  ink: {
    card: "bg-ink text-surface",
    link: "border-white/80 text-surface hover:bg-surface hover:text-ink",
  },
  brand: {
    card: "bg-brand text-surface",
    link: "border-white/80 text-surface hover:bg-surface hover:text-brand-deep",
  },
};

export function PhotoBand({
  src,
  alt,
  title,
  body,
  href,
  cta,
  tone = "surface",
  half = false,
  position = "center",
}: {
  src: string;
  alt: string;
  title: string;
  body?: string;
  href: string;
  cta: string;
  tone?: Tone;
  half?: boolean;
  /** CSS object-position, to keep a subject in frame on narrow screens. */
  position?: string;
}) {
  const t = TONES[tone];

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-ink",
        "h-[85svh] min-h-[520px] lg:h-[100svh] lg:min-h-[640px]",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={half ? "(min-width: 1024px) 50vw, 100vw" : "100vw"}
        className="-z-10 object-cover"
        style={{ objectPosition: position }}
      />

      <div className="absolute inset-0 p-4 sm:p-10">
        <div className={cn("sticky top-10 max-w-[360px] p-5 sm:p-6", t.card)}>
          <h2 className="text-[24px] leading-[1.15] font-medium tracking-[-0.04em]">{title}</h2>
          {body ? (
            <p className="mt-2 text-[15px] leading-[1.45] tracking-[-0.01em] opacity-90">{body}</p>
          ) : null}
          <Link
            href={href}
            className={cn(
              "mt-5 inline-flex h-10 items-center rounded-full border px-5 text-[14px] font-medium no-underline transition-colors duration-150 ease-brand hover:no-underline",
              t.link,
            )}
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
