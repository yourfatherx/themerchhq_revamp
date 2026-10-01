# Hyperframes Composition Brief: The Merch HQ

## Objective
Create a short launch-style brag video for The Merch HQ — a feature showcase that
demonstrates the product doing its job, not describing it.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21.5s (must stay within 15–25s)

## Source Material
- Project root: `D:/TMHQ_Revamp`
- Primary files read:
  - `components/marketing/HeroMedia.tsx` — the hook line
  - `components/marketing/Specimens.tsx` — **the three artefacts to recreate**
  - `app/globals.css` — the exact palette and type scale
  - `app/layout.tsx` — the typeface
  - `app/(marketing)/page.tsx` — title and positioning
- Product name: **The Merch HQ**
- Tagline / strongest claim: **"250 hoodies. One link. No spreadsheet."**
- Key UI to recreate: the three specimens in `components/marketing/Specimens.tsx` —
  `StorefrontSpecimen`, `SizeTableSpecimen`, `ReceiptSpecimen`. These are the
  components the real product renders, so recreating them shows the product
  rather than an illustration of it.
- Copy that must appear verbatim:
  - `250 hoodies. One link. No spreadsheet.`
  - `music-club.themerchhq.in`
  - `Hostel Night 2026`
  - `Closes in 9d 04h`
  - `Total 171`
  - `Paid to The Merch HQ by UPI, not to an individual's account.`
  - `Merch, handled.`

## Creative Direction
- Tone preset: `app-store`
- Creative direction: a product film that behaves like the product — plainspoken,
  exact numbers, no adjectives.
- Interpretation: clean slide/wipe transitions at 0.35–0.45s. Feature-card
  structure — a label plus one supporting line, never a paragraph. Title case,
  medium weight. Confidence comes from holding a real artefact long enough to
  read it, not from motion. Nothing flashes, nothing strobes.
- Angle: the product deletes a job. Every campus merch run has one person holding
  a Google Form, a spreadsheet, a UPI ID and a WhatsApp group, collecting money
  for an event that isn't theirs. The video shows the machinery that removes
  them: a storefront going live, orders becoming a print-ready size table, a
  receipt that never touches a personal account.
- Hook: three hard lines on near-white — "250 hoodies." / "One link." / "No
  spreadsheet." — each landing on a beat.
- Outro / punchline: ink ground, white wordmark, "Merch, handled.", then the
  address. Stillness.
- Avoid:
  - Generic SaaS language ("streamline your workflow" is banned by the project's
    own voice rules)
  - Abstract filler visuals, color washes, particle systems
  - Unrelated visual redesign — the palette and type are fixed below
  - Any adjective the source site would not use

## Visual Identity
- Background: `#f9fafb` (canvas) for scenes 1–4
- Dark ground: `#13111f` (ink) for scene 5
- Text: `#13111f` primary, `#5a5c6e` muted
- Accent: `#1b52d7` (6.49:1 on white — the contrast floor is 4.5:1 and is
  non-negotiable on this project)
- Accent deep: `#021c8b`
- Surface: `#ffffff`; plate ground: `#efeff2`; hairline: `rgb(0 0 0 / 0.1)`
- Display font: **Instrument Sans** 700, tight tracking (−0.02 to −0.03em)
- Body font: **Instrument Sans** 400/500. One family throughout — the project
  deliberately uses a single typeface.
- Numerals: tabular (`font-variant-numeric: tabular-nums`), weight 500. Every
  figure on this site uses them; the size table and receipt must.
- Visual references from the project:
  - `brag-output/composition/assets/brand/logo-horizontal-white.png` (staged from
    `public/brand/`) for the outro
  - The size table's accent bars — the one place the accent carries real area

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. **The claim** — 4.2s — three display lines arrive one at a time and hold
   together; thin accent rule underneath.
2. **Their own storefront** — 4.7s — storefront card assembles on a plate ground;
   four size chips pop in one by one with L filled in accent; "Closes in 9d 04h"
   lands last.
3. **The table that goes to print** — 5.3s — **centrepiece**: five size rows
   arrive top to bottom with accent bars growing to width; "Total 171" lands with
   weight and the completed table holds.
4. **Where the money goes** — 3.7s — narrow receipt; two line items, then the
   Paid total; the UPI line beneath in muted grey.
5. **Merch, handled.** — 3.6s — ground flips to ink; wordmark, tagline, address;
   hold in stillness.

## Audio
- Audio role: warm, confident bed with sparse motion-matched accents
- Audio arc: steady throughout; accents mark only things that visibly move; bed
  fades under a still outro rather than swelling into it
- Music: `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3`
- Music treatment: start 0.0s, steady, gentle fade from ~20.0s to silence at end.
  Never rises over a readable moment.
- Music cue guidance: bundled preset staged alongside the track at
  `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.music-cues.json`.
  Tempo **114.84 BPM**, beat grid ~0.526s.
  Candidate strong cues: **1.60, 3.70, 5.80, 6.34, 8.96, 9.50, 12.65, 17.91**.
  Suggested locks (use 1–3, your choice which):
  - 12.65s — "Total 171" lands (the payoff; strongest candidate)
  - 17.91s — cut to the outro
  - 3.70s — cut out of the hook
  Sequential **text** must snap to every other beat (~1.05s) or slower.
  Non-text accents (size chips, bar growth) may use the full grid (~0.53s).
- Audio-reactive treatment: subtle — the accent bars or the card may gain a
  little presence on strong beats. No waveform bars, no equalizers, no pulsing
  backgrounds, no strobing.
- Audio-coupled moments:
  - Scene 1, three hook lines — beat reveal, one dry tick each
  - Scene 2, four size chips — card/interface sequence, one light tick each
  - Scene 3, five table rows — sequential reveal, quiet per-row tick
  - Scene 3, "Total 171" — major payoff, one soft impact
  - Scene 4, "Paid ₹1,007.00" — one clean confirm
  - Scene 5, ground flip to ink — one dry low hit, then nothing
- SFX selection guidance: roughly six cues total across 21.5s. Interface/UI ticks
  for the chips and rows; a restrained impact for the Total; a confirm for the
  receipt. Sound must match a visible movement — if nothing moves, no sound.
- SFX analysis guidance:
  `C:/Users/aurvi/.claude/plugins/cache/brag/brag/0.4.0/skills/brag/assets/sfx/sfx-analysis.md`
  (and `.json` beside it). Prefer low high-frequency-risk files — these repeat
  five times in scene 3 and must not fatigue.
- Exact SFX choice: yours, after the animation exists.
- Audio files: copy the chosen music and any selected SFX into
  `brag-output/composition/assets/`.

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core`
(composition contract + `data-*` timing), `hyperframes-animation` (motion),
`hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes`
(seek-safe keyframes), and `hyperframes-cli` (lint/check/render). This is the
`/brag` workflow: do not enter the `hyperframes` entry-point intent interview and
do not route into its generic promo / launch-video workflow. Prefer native
Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI element from the source project — here, three.
- Keep all text readable in the final render. Reading floor: short label ~0.8s
  fully settled; a sentence ~0.3s per word.
- Keep the video within 15–25 seconds.
- Include the music and SFX layer.
- Treat the audio notes above as guidance, not a fixed cue sheet. Choose SFX
  after the visual animation exists.
- Treat cue metadata as optional timing hints; ignore any cue that hurts
  readability or the product story.
- Lock 1–3 major reveals to strong cues within ±0.15s, marked `// beat-locked`.
  Snap sequential entrances to beats within ±0.10s, marked `// beat-grid`.
- Wire at least one visual element to per-frame audio data if extraction is
  available; if not, note it and do not block the render.
- Use local assets throughout.
- Run `hyperframes check` before render — it is brag's single gate.

## Accuracy constraints specific to this project
- **The contrast floor is 4.5:1 and is enforced by this project's own tests.**
  Accent `#1b52d7` on white is 6.49:1; white on accent is the same. Muted text
  `#5a5c6e` on `#f9fafb` is ~6.5:1. Do not introduce a lighter grey for "elegance".
- **Numbers must stay exact.** S 12, M 41, L 68, XL 39, 2XL 11 sum to **171** —
  that total is derived in the real component and must not be typed wrong here.
  ₹899.00 + ₹108.00 = ₹1,007.00. GST is 12%.
- **No real data.** Everything on screen is the site's own fictional specimen
  campaign. Do not introduce names, emails, order IDs or hostnames beyond the
  verbatim list above.
