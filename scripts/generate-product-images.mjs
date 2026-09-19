// Generates blank product flat-lays for the catalogue.
// Usage: node scripts/generate-product-images.mjs [name ...]   (no args = all)
//
// Providers, in the order they are auto-selected:
//   hf        Hugging Face FLUX.1-Krea-dev Space. Free, needs no key, so it is the default.
//   gemini    GEMINI_API_KEY / GOOGLE_API_KEY. Needs billing; the free tier has no image quota.
//   openrouter OPENROUTER_API_KEY. Needs purchased credits.
// Force one with IMAGE_PROVIDER=hf|gemini|openrouter.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

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
  // Hugging Face is free, so it wins unless a paid provider is explicitly forced.
  return { name: "hf", key: read("HF_TOKEN") };
}

async function generate(provider, name, description) {
  const { buffer, ext } =
    provider.name === "hf"
      ? await viaHuggingFace(`${description} ${STYLE_SHORT}`, provider.key)
      : provider.name === "gemini"
        ? await viaGemini(provider.key, `${description}\n\n${STYLE}`)
        : await viaOpenRouter(provider.key, `${description}\n\n${STYLE}`);

  const path = join(OUT_DIR, `${name}.${ext}`);
  await writeFile(path, buffer);
  return path;
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
