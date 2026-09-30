# Reference captures

Measurements and screenshots of third-party sites we study for layout and
interaction patterns. Produced by `scripts/reference-teardown.mjs`.

**Reference only.** The photography, copy and markup captured here belong to
their owners. Nothing in this folder ships: we take layout, rhythm and
behaviour, and every value is replaced by our own tokens, content and
photography.

| Folder | Site | Captured | Write-up |
| --- | --- | --- | --- |
| `sharp-trip-942210/` | Menorca — Framer e-commerce template | 2026-09-30 | Reference Site Teardown — Clone Blueprint (Claude Doc) |

Per page: `data.json` (census, motion samples, layer outline, hover deltas),
`*-full.jpg` and `*-scroll-NN.jpg` screenshots at 1440 / 810 / 390 px,
`desktop-load-*.jpg` first-paint frames and `hover/` crops. `summary.md`
aggregates every page. `probes/` holds hand-run follow-ups (hover timings with
the newsletter modal closed, the mobile menu, the product page, nav on scroll).

Videos (`*.webm`) and HTML dumps are git-ignored; re-run the script to get them:

    node scripts/reference-teardown.mjs https://sharp-trip-942210.framer.app/
