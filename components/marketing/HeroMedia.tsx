import { ButtonLink } from "@/components/ui/ButtonLink";
import { Chip } from "./Bits";

/**
 * Full-bleed media with the headline set over it, closed by the wordmark.
 *
 * This is a deliberate, approved exception to the brand rule that type never
 * sits on a photograph — taken so the opening matches the layout reference. It
 * applies here and nowhere else in the system.
 *
 * The exception is made safe rather than merely taken: the media carries a
 * scrim that reaches fully opaque ink at the bottom edge, so the further down
 * the block a line sits, the less the media underneath it can matter. The rule
 * exists to stop type landing on unpredictable values; the scrim bounds the
 * unpredictability rather than removing it. Measured against the current clip
 * across its whole runtime, the worst frame puts the headline at 5.0:1 — clear
 * of the 4.5:1 floor, and the headline is display-sized so its real requirement
 * is 3:1. Re-measure when the media changes.
 *
 * The wordmark is the reference's closing move: set at viewport width, cropped
 * by the section's own edge, sitting in the part of the scrim that is nearly
 * solid ink. It is decorative — the accessible name of this page is the h1
 * above it — so it is `aria-hidden` and the reader loses nothing.
 *
 * `video` and `src` share the media slot. Video is decorative and silent, so it
 * is muted, looped, `playsInline` and `aria-hidden`. Reduced motion is honoured
 * without client JavaScript: both sources carry
 * `media="(prefers-reduced-motion: no-preference)"`, so a reader who asks for
 * less motion matches no source and the element renders as its poster.
 */

export function HeroMedia({
  src,
  video,
}: {
  src?: string;
  video?: { mp4: string; webm?: string; poster: string };
}) {
  return (
    <section className="relative isolate flex min-h-[720px] flex-col overflow-hidden bg-ink">
      {video ? (
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {video.webm ? (
            <source
              src={video.webm}
              type="video/webm"
              media="(prefers-reduced-motion: no-preference)"
            />
          ) : null}
          <source
            src={video.mp4}
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
      ) : src ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/35"
      />

      <div className="relative mx-auto w-full max-w-[1280px] grow px-5 pt-32 sm:px-8">
        <Chip tone="dark" className="border border-white/15">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          Merch, handled — quote to doorstep
        </Chip>

        <h1 className="t-h1 mt-6 max-w-[16ch] text-surface">
          250 hoodies. One link. No spreadsheet.
        </h1>

        <p className="t-body-lg mt-5 max-w-[48ch] text-white/75">
          We design and make the merch, then give your club or company its own
          storefront so your people order and pay for it themselves.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/quote" size="lg" onDark>
            Request a quote
          </ButtonLink>
          <ButtonLink href="/catalogue" size="lg" onDark variant="secondary">
            See the catalogue
          </ButtonLink>
        </div>
      </div>

      {/* Cropped by the section edge on purpose — the reference lets its
          wordmark run past the bottom rather than sit tidily above it. */}
      <p
        aria-hidden="true"
        className="relative -mb-[1.5vw] w-full px-3 text-center leading-[0.78] font-bold tracking-[-0.045em] text-surface"
        style={{ fontSize: "13.2vw" }}
      >
        The Merch HQ
      </p>
    </section>
  );
}
