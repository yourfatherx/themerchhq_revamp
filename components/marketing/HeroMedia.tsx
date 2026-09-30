import Link from "next/link";

/**
 * Full-bleed media, 96% of the viewport tall, with the claim centred over it.
 *
 * This is a deliberate, approved exception to the brand rule that type never
 * sits on a photograph — it applies here and nowhere else in the system. Every
 * other band puts its words on a solid card (see `PhotoBand`).
 *
 * The exception is made safe by construction rather than by measuring one clip:
 * the scrim is never lighter than 62% ink anywhere in the frame, which holds
 * white type at 5.22:1 even over a pure-white frame — clear of 4.5:1 for every
 * size, including the 12px navigation that sits over the top of the hero. It
 * darkens toward the foot, where the page meets the white grid below.
 *
 * The headline is set in capitals with one phrase in italic lower case: the
 * single change of voice the layout asks for, made inside our one family
 * instead of with a second typeface.
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
    <section className="relative isolate flex h-[96svh] min-h-[600px] flex-col items-center justify-center overflow-hidden bg-ink px-4 pt-[100px] text-center sm:px-5">
      {video ? (
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
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
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/[0.62] via-ink/[0.62] to-ink/80"
      />

      <h1 className="max-w-[18ch] text-[clamp(36px,3.9vw+22px,76px)] leading-[1.02] font-semibold tracking-[-0.045em] text-surface uppercase">
        250 hoodies.{" "}
        <em className="font-normal tracking-[-0.03em] normal-case">one link.</em>{" "}
        No spreadsheet.
      </h1>

      <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.45] tracking-[-0.01em] text-surface sm:text-[18px]">
        We design and make the merch, then give your club or company its own
        storefront so your people order and pay for it themselves.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
        <GlassPill href="/quote">Request a quote</GlassPill>
        <GlassPill href="/catalogue">See the catalogue</GlassPill>
      </div>
    </section>
  );
}

/** Outline pill for use over the hero only: white outline and type at rest,
 *  filled white with ink type when pointed at or focused. */
function GlassPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center rounded-full border border-white/85 px-6 text-[15px] font-medium tracking-[-0.01em] text-surface no-underline transition-colors duration-150 ease-brand hover:bg-surface hover:text-ink hover:no-underline focus-visible:bg-surface focus-visible:text-ink"
    >
      {children}
    </Link>
  );
}
