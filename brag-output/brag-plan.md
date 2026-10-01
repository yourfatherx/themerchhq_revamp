# Brag Plan: The Merch HQ

## What is this app?

The Merch HQ designs and produces merch for Indian colleges, clubs and companies,
then gives every client its own branded storefront on a subdomain so their people
order and pay for it themselves — removing the organiser's half of a merch run
(the Google Form, the spreadsheet, the UPI ID, the WhatsApp group) entirely.

## The angle

The product's own argument is the video. Every merch run on a campus has one
person holding a spreadsheet and collecting money that isn't theirs. This product
deletes that person's job. So the video shows the *machinery doing it* — a
storefront going live, orders becoming a print-ready size table, a receipt that
doesn't route through anyone's personal account.

No adjectives, no "streamline your workflow". The site's own voice rule is
**"Plainspoken, not clever"**, and the video obeys it: exact numbers, real
artefacts, present tense. The brag is that the product is boringly specific.

## Hook (first 2-3 seconds)

The site's own h1, delivered as three hard lines on near-white:

**250 hoodies. / One link. / No spreadsheet.**

Each line lands on a beat. The third line is the whole pitch, and it earns the
next eighteen seconds because it names the thing the viewer hates (the
spreadsheet) rather than the thing we sell.

## Key moments (the middle)

- **The storefront card assembling** — `music-club.themerchhq.in`, "Hostel Night
  2026", From ₹899, the size chips S/M/L/XL popping in with L selected in the
  brand blue, and "Closes in 9d 04h" landing last.
- **The size table filling row by row** — S 12, M 41, L 68, XL 39, 2XL 11, each
  with its accent bar growing to width, then **Total 171** arriving with weight.
  This is the centrepiece: orders arriving *become* the print order.
- **The receipt** — Hoodie ×1 ₹899.00, GST at 12% ₹108.00, Paid ₹1,007.00, under
  the line "Paid to The Merch HQ by UPI, not to an individual's account."

## Outro / punchline

Ink ground, white wordmark, and the site's own tagline: **Merch, handled.**
Then the address. Nothing else — the restraint is the point.

## User flow worth showing

The three beats of a real run, which is exactly what the middle scenes are:

1. **Entry** — the organiser gets a storefront on their own subdomain, live and
   counting down to close.
2. **Key action** — their batch orders on it; the size breakdown fills up on its
   own, per-order, with no one collecting corrections.
3. **Result** — each buyer gets a receipt, and the finished table is what goes to
   print.

These are not diagrams of the product. Scenes 2–4 recreate the **actual
components the product renders** — `StorefrontSpecimen`, `SizeTableSpecimen` and
`ReceiptSpecimen` from `components/marketing/Specimens.tsx` — so what's on screen
is the product, not an illustration of it.

## Tone

- **Preset:** `app-store`
- **Creative direction:** a product film that behaves like the product —
  plainspoken, exact numbers, no adjectives.
- **Interpretation:** clean slide/wipe transitions at 0.35–0.45s, feature-card
  structure (label + one supporting line), title case, medium weight. Confidence
  comes from holding a real artefact on screen long enough to read it, not from
  motion. Nothing flashes.

## Format: landscape — 1920x1080
## Duration: 21.5s target

## Visual identity (from the project)

- Background: `#f9fafb` (canvas) — scenes 1–4
- Dark ground: `#13111f` (ink, "Chinese Black") — scene 5
- Accent: `#1b52d7` (brand, "New Car", Pantone 2728 C — 6.49:1 on white)
- Accent deep: `#021c8b` (Resolution Blue)
- Surface / card: `#ffffff`; plate ground `#efeff2`
- Text: `#13111f` primary, `#5a5c6e` muted (Ink Gray)
- Hairline: `rgb(0 0 0 / 0.1)`
- Display + body font: **Instrument Sans** (one family, `--font-grotesk`), 700 for
  display with tight tracking, 400/500 for text
- Strongest visual element: the size table's accent bars — a bar chart made of
  the run's own order data, and the one place the accent carries real area

## Share copy (draft)

250 hoodies. One link. No spreadsheet. The Merch HQ gives your club its own
storefront, collects the money, and hands you a print-ready size table.

## Audio direction

- **Role:** warm, confident bed with sparse motion-matched accents
- **Music:** `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3`
- **Music treatment:** start at 0.0s, steady through, gentle fade under the outro
  from ~20.0s. Never rises over the readable moments.
- **Music cue guidance:** preset read from
  `assets/music/cues/happy-beats-business-moves-vol-11-...music-cues.json`.
  Tempo **114.84 BPM**, beat grid ~0.526s.
  Strong cues to target: **1.60s** (hook line 2), **3.70s** (cut to storefront),
  **5.80 / 6.34s** (size chips), **8.96s** (cut to the table), **12.65s** (Total
  171 lands), **17.91s** (cut to outro).
  Beat-grid windows for sequential reveals: hook lines and any sequential TEXT
  snap to **every other beat (~1.05s)** to clear the readability floor; non-text
  accents (size chips, bar growth) may use the full grid (~0.53s).
- **Audio-reactive treatment:** subtle — the accent bars may gain a touch of
  presence on strong beats. No waveform bars, no pulsing backgrounds.
- **SFX posture:** sparse, motion-matched, professional restraint. Roughly six
  cues in the whole video.
- **Audio-coupled moments:** size chips arriving one by one; each table row
  landing; the Total 171 impact; the receipt total; one clean cut into the outro.
- **Restraint rule:** no whoosh on every transition, no riser into the outro, no
  sound on plain text fades. If a sound isn't matching a visible movement, it
  doesn't go in.

## Storyboard

### Scene 1 — The claim — 4.2s
Near-white `#f9fafb`. Three display lines stack centre-left, large, Instrument
Sans 700: **"250 hoodies."** at ~0.5s, **"One link."** at 1.60s, **"No
spreadsheet."** at 2.65s. Each slams in fast (0.25s) then holds. All three remain
on screen together until the cut. A thin `#1b52d7` rule draws under the stack at
3.2s.
Sequential/interaction: yes — three lines arrive one at a time on every-other-beat
(1.05s apart), each holding ≥0.8s fully settled; the full stack holds ~1.0s.
Audio intent: establish confidence immediately; the bed is already running.
Audio-coupled idea: a soft, dry tick on each line's arrival — three only.
Music: warm, steady, already at tempo.
Transition mood: clean slide → Scene 2

### Scene 2 — Their own storefront — 4.7s
The real storefront card on a `#efeff2` plate: the subdomain line
`music-club.themerchhq.in`, then **"Hostel Night 2026"** with **From ₹899**, then
four size chips **S M L XL** with **L** filled in `#1b52d7`, then a hairline rule
and **"Closes in 9d 04h"**. Card enters on a soft rise.
Feature label, upper right: **"Their own storefront."** / supporting line: *"Live
in five working days, on your subdomain."*
Sequential/interaction: yes — card rises in, then the four size chips pop in one
by one on the beat grid (~0.53s apart, non-text accents), then the closing timer
lands last at ~8.4s.
Audio intent: things assembling, precisely and without drama.
Audio-coupled idea: a light interface tick per size chip; a softer one on the
timer.
Music: steady; strong cues at 5.80 and 6.34 carry the chip arrivals.
Transition mood: smooth wipe → Scene 3

### Scene 3 — The table that goes to print — 5.3s
**The centrepiece.** The real size table on white. Five rows arrive top to bottom,
each as size label + growing accent bar + quantity: **S 12**, **M 41**, **L 68**,
**XL 39**, **2XL 11**. Bars grow to width over 0.35s each. Then a hairline, then
**Total 171** arrives with weight at 12.65s and holds.
Feature label: **"Every order carries its own size."** / supporting line: *"At
close it's a table, not a thread of corrections."*
Sequential/interaction: yes — five rows ~0.6s apart (label+number is a 2-token
read and the bar carries the eye), completed table then holds ~1.4s so the whole
shape is readable as one object.
Audio intent: accumulation — each row should feel like an order landing.
Audio-coupled idea: a quiet per-row tick rising slightly in pitch; a single soft
impact on Total 171.
Music: building; 12.65s strong cue is the Total.
Transition mood: smooth wipe → Scene 4

### Scene 4 — Where the money goes — 3.7s
The receipt, narrow and centred on `#f9fafb` — a receipt is a small object and
reads wrong blown up. Lines: **Hoodie × 1 ₹899.00**, **GST at 12% ₹108.00**,
hairline, **Paid ₹1,007.00** in medium weight. Beneath, in muted grey: *"Paid to
The Merch HQ by UPI, not to an individual's account."*
Feature label: **"You never touch the money."**
Sequential/interaction: yes — the two line items fade up together, then the Paid
total lands on its own at ~16.6s.
Audio intent: settled, final, clean — the point at which risk leaves the
organiser.
Audio-coupled idea: one soft confirm on the Paid total. Nothing on the line items.
Music: steady, beginning to open out toward 17.91.
Transition mood: clean cut on the 17.91s strong cue → Scene 5

### Scene 5 — Merch, handled. — 3.6s
Ground flips to ink `#13111f`. The horizontal wordmark in white
(`public/brand/logo-horizontal-white.png`) settles centre. Beneath it, **"Merch,
handled."** then, after a beat, the address **themerchhq.in** in muted white.
Hold in stillness to the end.
Sequential/interaction: yes — wordmark, then tagline at ~19.3s, then address at
~20.3s; all three hold together to the end.
Audio intent: land and stop. No riser, no swell.
Audio-coupled idea: one dry, low hit as the ground flips to ink. Nothing after.
Music: gentle fade from ~20.0s to silence at 21.5s.
Transition mood: — (end)

**Music mood for this video:** upbeat, confident, corporate-warm — restrained.
**Audio summary:** a steady 115 BPM bed carries the whole run; six sparse,
motion-matched accents mark only things that visibly move (three hook lines, the
size chips, each table row, the Total, the Paid confirm, one ground flip), and
the bed fades out under a still outro rather than swelling into it.

## Note for the user (not in the video's favour or against it)

Every figure on screen — ₹899, ₹1,007, the 171-unit spread — is the site's own
published specimen data for a fictional campaign ("Hostel Night 2026",
`music-club.themerchhq.in`). No real customer, order or personal data appears,
and nothing from `.env`, the database, or the seed fixtures is referenced.

Worth a decision before posting: these are **placeholder prices**. On a webpage
they read as illustrative; in a shareable video they read closer to a quote. If
that's a problem, the receipt scene can drop the rupee figures and keep the
structure.
