// Generates PLACEHOLDER studio photography for /about.
// Usage: node scripts/generate-studio-images.mjs [name ...]   (no args = all)
//
// These are stand-ins for photographs that do not exist yet, which is why they
// land in public/studio/placeholder/ rather than beside the real studio set.
// The path is the warning: anything under it is generated, nobody in it is a
// real person, and none of it should outlive the real shoot.
//
// Codex is the only provider here — it is the one that reliably returns a
// photographic frame rather than an illustration. It needs `codex login` on a
// paid ChatGPT plan; see scripts/lib/codex-image.mjs for the rest of the
// conditions, every one of which fails silently or misleadingly.

import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { join } from "node:path";
import { viaCodex } from "./lib/codex-image.mjs";

const OUT_DIR = "public/studio/placeholder";

const STYLE = `Realistic documentary photograph, natural available light, candid
and unposed. Muted neutral colour, soft contrast, fine grain. Sharp focus.
Absolutely no text, no writing, no logos, no brand marks, no signage and no
printed artwork of any kind anywhere in the frame.`;

const ITEMS = {
  /** The wide band under the opening paragraphs. */
  "studio-desk": `Wide 3:2 landscape photograph looking straight down onto a
    long light-wood work table in a small design studio. On it: a laptop, a
    drawing tablet and stylus, fanned colour swatch cards, marker pens, an open
    notebook of sketches, and folded fabric samples in navy and oatmeal. Three
    people are working at it, seen from directly above so only their shoulders,
    arms and hands are in frame — no faces. Daylight from a window at one side.`,

  /** The second, smaller photograph beside the pulled-out line. */
  "press-wall": `3:2 landscape photograph of a person seen from behind in a
    plain dark jumper, pinning sheets of blank paper to a white tiled studio
    wall. Only their back and one raised arm are visible, no face. Even
    daylight, plain uncluttered wall.`,

  /** The team row. Deliberately not head-on portraits: these stand in for
   *  photographs of real people who have not been shot yet, and a convincing
   *  invented face is the thing to avoid, not the thing to aim for. */
  "team-1": `Portrait-orientation 2:3 photograph of a person at a studio work
    bench, turned away from the camera and looking down at the fabric they are
    handling. Head turned far enough that the face is not identifiable. Plain
    pale grey wall behind, soft daylight.`,

  "team-2": `Portrait-orientation 2:3 photograph of a person standing at a
    screen printing press, seen in profile from the shoulders up, face turned
    away toward the press. Not identifiable. Plain pale grey background, soft
    even light.`,

  "team-3": `Portrait-orientation 2:3 photograph of a person carrying a stack of
    folded blank garments, framed from the chest down so no face is in shot.
    Plain pale grey background, soft daylight.`,
};

const names = process.argv.slice(2);
const targets = names.length ? names : Object.keys(ITEMS);

await mkdir(OUT_DIR, { recursive: true });

let failed = 0;
for (const name of targets) {
  if (!ITEMS[name]) {
    console.error(`FAIL ${name}: no prompt by that name`);
    failed++;
    continue;
  }

  try {
    const { buffer } = await viaCodex(`${ITEMS[name]}\n\n${STYLE}`);
    // WebP, not the PNG Codex hands back. These are photographs: the first five
    // came to 12 MB as PNG and 616 KB as WebP, and the deploy archive has a
    // hard ceiling it has already been refused by once.
    const path = join(OUT_DIR, `${name}.webp`);
    await sharp(buffer).webp({ quality: 82, effort: 6 }).toFile(path);
    console.log(`ok   ${path}`);
  } catch (err) {
    console.error(`FAIL ${name}: ${err.message}`);
    failed++;
  }
}

process.exit(failed ? 1 : 0);
