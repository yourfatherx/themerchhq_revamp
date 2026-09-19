// Conforms product flat-lays to what ProductPlate expects.
// Usage: node scripts/normalize-product-images.mjs
//
// ProductPlate is a 4:5 tile painted --color-plate and draws the photo with
// object-contain, so a photo only sits flush if its own ground is that same
// grey AND it is already 4:5. Generated images are square and land on whatever
// grey the model felt like. This does both corrections:
//
//   1. Shifts the ground to --color-plate. The shift is weighted by how close a
//      pixel is to the sampled ground, so the product itself is left alone and
//      the ground's own soft gradient is preserved rather than flattened.
//   2. Pads to 4:5 by copying the edge rows outward, so object-contain has
//      nothing to letterbox. These frames darken toward the bottom, so padding
//      with a flat grey instead leaves a visible step where the bars meet the
//      photograph — copying the edge continues whatever tone is actually there.
//
// Safe to re-run: a previous pad is cropped off first, so the ground is always
// re-derived from the photograph rather than from bars this script added.

import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";

const DIR = "public/products";
const PLATE = [0xef, 0xef, 0xf2]; // --color-plate in app/globals.css
const NEAR = 30; // channel distance within which a pixel counts as ground

const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** Average the four corners — whatever the product is, the corners are ground. */
function sampleGround(data, width, height) {
  const P = 48;
  const corners = [
    [0, 0],
    [width - P, 0],
    [0, height - P],
    [width - P, height - P],
  ];
  const sum = [0, 0, 0];
  let n = 0;
  for (const [ox, oy] of corners) {
    for (let y = oy; y < oy + P; y++) {
      for (let x = ox; x < ox + P; x++) {
        const i = (y * width + x) * 3;
        sum[0] += data[i];
        sum[1] += data[i + 1];
        sum[2] += data[i + 2];
        n++;
      }
    }
  }
  return sum.map((v) => v / n);
}

for (const file of (await readdir(DIR)).filter((f) => f.endsWith(".png"))) {
  const path = `${DIR}/${file}`;
  let base = sharp(path).removeAlpha();
  let meta = await base.metadata();

  if (meta.height > meta.width) {
    const square = await base
      .extract({
        left: 0,
        top: Math.floor((meta.height - meta.width) / 2),
        width: meta.width,
        height: meta.width,
      })
      .png()
      .toBuffer();
    base = sharp(square).removeAlpha();
    meta = await base.metadata();
  }

  const { width, height } = meta;
  const { data } = await base.raw().toBuffer({ resolveWithObject: true });

  const ground = sampleGround(data, width, height);
  const delta = PLATE.map((target, c) => target - ground[c]);

  for (let i = 0; i < data.length; i += 3) {
    // Distance from the ground decides how much of the shift this pixel takes,
    // so the product keeps its own colour and edges stay soft.
    const d = Math.max(
      Math.abs(data[i] - ground[0]),
      Math.abs(data[i + 1] - ground[1]),
      Math.abs(data[i + 2] - ground[2]),
    );
    if (d >= NEAR) continue;
    const w = 1 - d / NEAR;
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.max(0, Math.min(255, Math.round(data[i + c] + delta[c] * w)));
    }
  }

  const target = Math.round((width * 5) / 4); // 4:5
  const pad = Math.max(0, target - height);

  let out = sharp(data, { raw: { width, height, channels: 3 } });
  if (pad > 0) {
    out = out.extend({
      top: Math.floor(pad / 2),
      bottom: pad - Math.floor(pad / 2),
      extendWith: "copy",
    });
  }

  const png = await out.png({ compressionLevel: 9 }).toBuffer();
  await writeFile(path, png);

  console.log(
    `${file.padEnd(24)} ground ${hex(ground)} -> ${hex(PLATE)}  ${width}x${height} -> ${width}x${height + pad}`,
  );
}
