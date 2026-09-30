// Generates blank product flat-lays for the catalogue.
// Usage: node scripts/generate-product-images.mjs [name ...]   (no args = all)
//
// Providers, in the order they are auto-selected:
//   hf        Hugging Face FLUX.1-Krea-dev Space. Free, needs no key, so it is the default.
//   gemini    GEMINI_API_KEY / GOOGLE_API_KEY. Needs billing; the free tier has no image quota.
//   openrouter OPENROUTER_API_KEY. Needs purchased credits.
//   codex     Codex CLI's built-in image tool, billed to a ChatGPT subscription.
//             Needs `codex login` on a paid plan — a free plan cannot use Codex at all.
// Force one with IMAGE_PROVIDER=hf|gemini|openrouter|codex.

import { writeFile, mkdir, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawn } from "node:child_process";

const OUT_DIR = "public/products";
const OPENROUTER_MODEL = "google/gemini-2.5-flash-image";
const GEMINI_MODEL = "gemini-2.5-flash-image";
const HF_SPACE = "https://mcp-tools-flux-1-krea-dev.hf.space";
// A fixed seed reproduces the same composition regardless of prompt wording, so re-roll
// a bad framing with SEED=<n> rather than by rewording.
const SEED = Number(process.env.SEED ?? 42);

const STYLE = `Studio product flat-lay for an e-commerce catalogue, square 1:1 composition.
The item is centred on a completely seamless, perfectly flat light grey background of exactly #EFEFF2,
edge to edge, with no vignette, no gradient, and no visible surface, table or horizon.
Shot square-on from directly overhead. Soft, even, diffuse lighting with only a faint contact shadow
directly beneath the item. True, accurate material colour with no colour grading or filters.
Generous empty margin on all four sides; the item occupies roughly 70% of the frame.
Absolutely no text, no writing, no logos, no brand marks, and no printed or embroidered artwork of any
kind — the item is completely blank and undecorated. No props, no hands, no models, no packaging.
Photographic realism, sharp focus.`;

// FLUX follows short prompts best; the Space's own docs cap guidance at ~60-70 words.
// Keep the camera angle and the "no hard shadow" clause — dropping them lets FLUX drift
// into angled, directionally-lit hero shots that do not sit in a grid with the others.
const STYLE_SHORT = `Top-down flat-lay, camera directly overhead, perfectly square-on, no perspective
tilt. Seamless flat light grey background, no visible surface or horizon. Soft even diffuse studio
lighting from a large softbox, no harsh shadows, no directional sunlight, only a faint soft contact
shadow. Item centred with generous margins. Completely blank, no text, no logo. Sharp focus.`;

const ITEMS = {
  "heavyweight-hoodie":
    "Overhead flat-lay product photo of a blank navy blue heavyweight pullover hoodie in thick brushed fleece, laid flat, sleeves folded inward, hood spread flat, drawstrings tucked away, chunky ribbed cuffs and hem.",
  "heavy-cotton-tee":
    "Overhead flat-lay product photo of a blank black heavy cotton crew-neck t-shirt, laid flat with sleeves squared out to the sides, thick opaque jersey, visible ribbed collar.",
  "crew-sweatshirt":
    "Overhead flat-lay product photo of a blank oatmeal heather grey crew-neck sweatshirt, laid flat with sleeves folded inward, ribbed collar, cuffs and hem, soft looped-back fleece texture.",
  "campus-cap":
    "Overhead flat-lay product photo of a blank navy blue six-panel baseball cap with a curved brim, crown filling the frame and brim pointing down, visible stitched panel seams and a fabric-covered crown button.",
  "canvas-tote":
    "Overhead flat-lay product photo of a blank natural undyed cotton canvas tote bag, laid flat with both handles in smooth symmetrical loops above the bag body, heavy canvas weave, reinforced stitching at the handle joints.",
  "steel-bottle":
    "Overhead product photo of a blank matte white insulated stainless steel water bottle with a brushed steel screw cap, lying horizontally, centred, clean cylindrical form with a soft highlight along its length.",
  "sticker-sheet":
    "Overhead flat-lay photo of a blank sheet of glossy white weatherproof vinyl sticker stock lying flat, with kiss-cut outlines of plain circles, rounded squares and rounded rectangles visible as faint cut lines only, all empty.",
  "enamel-pin":
    "Overhead photo of three small blank circular soft-enamel lapel pins, 25mm each, in a neat evenly spaced row, polished gold metal rims around flat plain enamel faces in navy, white and gold.",

  // The eighteen added when the catalogue went from 8 products to 26. Each
  // names the colour that item lists first in content/catalogue.ts, so the
  // photograph agrees with the swatch a buyer sees beside it.
  "oversized-tee":
    "Overhead flat-lay product photo of a blank black oversized drop-shoulder t-shirt, laid flat with sleeves squared out to the sides, boxy relaxed cut, heavy opaque cotton jersey, ribbed collar.",
  "long-sleeve-tee":
    "Overhead flat-lay product photo of a blank black long-sleeve cotton t-shirt, laid flat with both sleeves extended straight out to the sides, ribbed collar and ribbed cuffs.",
  "cotton-polo":
    "Overhead flat-lay product photo of a blank navy blue cotton pique polo shirt, laid flat with short sleeves squared out, flat knitted collar, short buttoned placket.",
  "zip-hoodie":
    "Overhead flat-lay product photo of a blank black full-zip hooded sweatshirt, laid flat with the zip closed and running straight down the centre, hood spread flat, thick brushed fleece, ribbed cuffs and hem.",
  "varsity-jacket":
    "Overhead flat-lay product photo of a blank navy blue wool melton varsity jacket, laid flat with the snap front closed, ribbed striped collar, cuffs and hem, set-in sleeves folded slightly inward.",
  "crew-socks":
    "Overhead flat-lay product photo of a pair of blank black ribbed cotton crew socks laid flat side by side, neatly aligned and parallel, fine vertical rib knit texture visible.",
  "bucket-hat":
    "Overhead flat-lay product photo of a blank black washed cotton twill bucket hat seen from directly above, crown centred, the downward brim forming an even circle around it, visible topstitching.",
  "ribbed-beanie":
    "Overhead flat-lay product photo of a blank black ribbed knit beanie laid flat with the cuff folded up, chunky vertical rib texture.",
  "drawstring-bag":
    "Overhead flat-lay product photo of a blank black polyester drawstring gym sack laid flat, the cords drawn into neat symmetrical loops at the top corners, reinforced eyelets at the base.",
  "laptop-sleeve":
    "Overhead flat-lay product photo of a blank charcoal grey wool felt laptop sleeve laid flat and closed, plain rectangle with softly rounded corners, dense felt texture visible at the edges.",
  "weekender-duffel":
    "Overhead flat-lay product photo of a blank black polyester weekender duffel bag laid flat on its side, main zip closed and running the length of the top, twin carry handles laid neatly across the body.",
  "daypack":
    "Overhead flat-lay product photo of a blank black polyester daypack backpack laid flat and facing up, shoulder straps tucked out of sight beneath it, main zip closed, one flat front pocket.",
  "ceramic-mug":
    "Overhead product photo of a blank white glazed ceramic mug lying on its side, centred horizontally, the handle in clean profile, smooth even glaze with one soft highlight.",
  "vacuum-tumbler":
    "Overhead product photo of a blank matte white stainless steel vacuum tumbler lying horizontally, centred, gently tapered cylindrical body with a clear sliding lid.",
  "a5-notebook":
    "Overhead flat-lay photo of a blank black softcover A5 notebook lying closed and perfectly flat, plain uncoated cover, subtle stitched spine, completely empty.",
  "lanyard-set":
    "Overhead flat-lay product photo of a blank navy woven polyester lanyard arranged in a neat oval loop, with a clear plastic ID card holder attached at the bottom and a small metal clip.",
  "a2-poster":
    "Overhead flat-lay photo of one blank sheet of white matte poster paper lying perfectly flat in portrait orientation, clean square corners, completely empty with no print.",
  "postcard-pack":
    "Overhead flat-lay photo of a small neat stack of blank white uncoated postcards lying flat, slightly fanned so the edges of several cards show, all faces completely empty.",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolveProvider() {
  let env = "";
  try {
    env = await readFile(".env.local", "utf8");
  } catch {
    // no .env.local; fall back to the process environment
  }

  const read = (name) =>
    process.env[name] ?? env.match(new RegExp(`^${name}=(.+)$`, "m"))?.[1]?.trim();

  const forced = process.env.IMAGE_PROVIDER;
  if (forced === "gemini") return { name: "gemini", key: read("GEMINI_API_KEY") ?? read("GOOGLE_API_KEY") };
  if (forced === "openrouter") return { name: "openrouter", key: read("OPENROUTER_API_KEY") };
  if (forced === "codex") return { name: "codex" };
  // Hugging Face is free, so it wins unless a paid provider is explicitly forced.
  return { name: "hf", key: read("HF_TOKEN") };
}

async function generate(provider, name, description) {
  const { buffer, ext } =
    provider.name === "hf"
      ? await viaHuggingFace(`${description} ${STYLE_SHORT}`, provider.key)
      : provider.name === "codex"
        ? await viaCodex(`${description}\n\n${STYLE}`)
        : provider.name === "gemini"
          ? await viaGemini(provider.key, `${description}\n\n${STYLE}`)
          : await viaOpenRouter(provider.key, `${description}\n\n${STYLE}`);

  const path = join(OUT_DIR, `${name}.${ext}`);
  await writeFile(path, buffer);
  return path;
}

/**
 * Codex CLI's built-in image tool, billed to a ChatGPT subscription.
 *
 * Codex writes every image it makes into ~/.codex/generated_images/<session>/
 * and that is where we read it from. We do NOT ask it to save the file itself:
 * its own sandbox refuses the copy out of that directory ("blocked by policy"),
 * which is the one thing that stops the upstream gpt-image-bridge wrapper
 * working on Windows. Letting it generate and collecting the file ourselves
 * sidesteps the sandbox entirely.
 *
 * Files are claimed by mtime against a mark taken before the run, so a stale
 * image from an earlier session is never picked up as this one's result.
 */
async function viaCodex(prompt, attempt = 1) {
  const dir = join(homedir(), ".codex", "generated_images");
  const since = Date.now();

  const instruction =
    `Use your image_generation tool to create this image.\n\n${prompt}\n\n` +
    `Requirements:\n` +
    `- You MUST call the image_generation tool. Do not write a script or fabricate a PNG.\n` +
    `- Do NOT try to copy, move or save the file anywhere. Leave it where the tool puts it.\n` +
    `- Reply with the single word DONE.`;

  const transcript = await new Promise((resolve, reject) => {
    // Run through a login shell, with the prompt on stdin. Every part of that
    // is load-bearing, and each was arrived at by a failure:
    //
    //  - Through a shell, not spawned directly. Codex refreshes its model list
    //    in a helper process; started straight from node that refresh times out
    //    and it falls back to `gpt-5.5`, which this account cannot use, so
    //    every request 404s. Under a shell the refresh completes.
    //  - The `codex` shim, never codex.exe — the .exe falls back the same way.
    //  - Prompt over stdin, because a shell concatenates argv unescaped and a
    //    long multi-line prompt becomes an invalid command. argv stays short
    //    and flag-only, so there is nothing to quote.
    //  - workspace-write, not read-only: the image tool writes the PNG itself
    //    and a read-only sandbox blocks it, leaving the run with no file.
    //
    // The model is deliberately not pinned: Codex maps its own model name to
    // an internal id, and passing that same name back through `-m` is rejected
    // ("not supported when using Codex with a ChatGPT account").
    const child = spawn(
      "bash",
      ["-lc", "codex exec --skip-git-repo-check -s workspace-write"],
      { stdio: ["pipe", "pipe", "pipe"] },
    );
    child.stdin.end(instruction);

    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));

    const timer = setTimeout(() => child.kill(), 10 * 60_000);
    child.on("error", (e) => (clearTimeout(timer), reject(e)));
    child.on("close", () => {
      clearTimeout(timer);
      // A nonzero exit still often leaves a usable image behind, so the file
      // check below is what actually decides success.
      resolve(out);
    });
  });

  let newest = null;
  for (const session of await readdir(dir).catch(() => [])) {
    let files = [];
    try {
      files = await readdir(join(dir, session));
    } catch {
      continue; // not a directory
    }
    for (const f of files.filter((f) => f.endsWith(".png"))) {
      const p = join(dir, session, f);
      const { mtimeMs } = await stat(p);
      if (mtimeMs >= since && (!newest || mtimeMs > newest.mtimeMs)) newest = { p, mtimeMs };
    }
  }
  if (!newest) {
    // A stale-model 404 means discovery lost its race, not that the prompt or
    // the account is wrong. Give it a few more goes before giving up.
    if (/gpt-5\.5.*(does not exist|do not have access)/.test(transcript) && attempt < 4) {
      await sleep(5000);
      return viaCodex(prompt, attempt + 1);
    }
    const why = transcript.trim().split("\n").filter(Boolean).slice(-3).join(" | ");
    throw new Error(`codex produced no new image. Last lines: ${why}`);
  }

  return { buffer: await readFile(newest.p), ext: "png" };
}

// Gradio's two-step protocol: POST returns an event id, GET streams the result.
// Anonymous callers get a very small ZeroGPU quota, so HF_TOKEN is worth setting.
async function viaHuggingFace(prompt, token) {
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  const post = await fetch(`${HF_SPACE}/gradio_api/call/infer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify({ data: [prompt, SEED, false, 1024, 1024, 4.5, 28] }),
  });
  if (!post.ok) throw new Error(`HTTP ${post.status}: space rejected the request`);

  const { event_id } = await post.json();
  if (!event_id) throw new Error("no event id from space");

  const stream = await fetch(`${HF_SPACE}/gradio_api/call/infer/${event_id}`, { headers: auth });
  const text = await stream.text();

  const complete = text.split("event: complete").pop() ?? "";
  const url = complete.match(/"url":\s*"([^"]+)"/)?.[1];
  if (!url) {
    const reason = token ? "space returned an error" : "ZeroGPU quota exhausted — set HF_TOKEN";
    throw new Error(reason);
  }

  const img = await fetch(url, { headers: auth });
  if (!img.ok) throw new Error(`HTTP ${img.status}: could not download image`);

  return { buffer: Buffer.from(await img.arrayBuffer()), ext: url.split(".").pop() };
}

async function viaGemini(key, prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "1:1" },
        },
      }),
    },
  );

  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.error?.message ?? "unknown error"}`);

  const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!data) throw new Error("no image in response");
  return { buffer: Buffer.from(data, "base64"), ext: "png" };
}

async function viaOpenRouter(key, prompt) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.error?.message ?? "unknown error"}`);

  const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url) throw new Error("no image in response");
  return { buffer: Buffer.from(url.split(",")[1], "base64"), ext: "png" };
}

const provider = await resolveProvider();
console.log(`provider: ${provider.name}`);
await mkdir(OUT_DIR, { recursive: true });

const names = process.argv.slice(2);
const targets = names.length ? names : Object.keys(ITEMS);
let failed = 0;

for (const name of targets) {
  if (!ITEMS[name]) {
    console.error(`unknown item: ${name}`);
    failed++;
    continue;
  }
  // A small credit balance makes OpenRouter reject back-to-back requests with a
  // 402 about in-flight requests, so pace them and retry that case.
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const path = await generate(provider, name, ITEMS[name]);
      console.log(`ok   ${path}`);
      lastError = null;
      break;
    } catch (err) {
      lastError = err;
      if (!err.message.startsWith("HTTP 402") || attempt === 4) break;
      await sleep(attempt * 15000);
    }
  }

  if (lastError) {
    console.error(`FAIL ${name}: ${lastError.message}`);
    failed++;
  }

  await sleep(5000);
}

process.exit(failed ? 1 : 0);
