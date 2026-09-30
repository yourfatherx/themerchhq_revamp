# Product flat-lays

These are generated, not photographed. The brand book forbids generated product
imagery; that rule was explicitly overridden for this set, and stands everywhere
else. Replace them with real photographs of real blanks before anything here is
quoted against.

Regenerate one with `node scripts/generate-product-images.mjs <slug>`, or the
whole set with no arguments. Always run `node scripts/normalize-product-images.mjs`
afterwards — `ProductPlate` is a 4:5 tile painted `--color-plate`, and a raw
generation is square on whatever grey the model chose.

## Two frames were altered after generation

`cotton-polo.png` and `varsity-jacket.png` came back with an invented brand
label stitched at the neck, in spite of a prompt that forbade text and logos.
A made-up wordmark on a garment we say we make ourselves is a claim we cannot
stand behind, so each label was covered with the median colour of the ring
around it and the seam feathered.

Two consequences worth knowing before anyone re-derives these from a fresh
generation:

- Re-running the generator restores the labels. The removal lives only in the
  committed PNGs.
- On `varsity-jacket.png` the feather clips the cream collar stripes, which are
  fractionally softer there than elsewhere in the frame. It is not visible at
  the size the catalogue renders, and it would go away with a re-roll.
