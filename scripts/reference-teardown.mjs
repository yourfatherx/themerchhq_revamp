// Captures a reference website for a design teardown, so a clone can be built
// from measurements rather than from memory of a browsing session.
//
// Usage: node scripts/reference-teardown.mjs <url> [--out <dir>] [--max-pages 15]
//                                                  [--per-template 2] [--only desktop,mobile]
//
// Starting at <url>, it follows same-origin links (at most --per-template pages
// under any one collection path such as /blog/*) and writes, per page:
//   <viewport>-full.jpg          full page, taken after a slow scroll so every
//                                scroll-triggered entrance has played
//   <viewport>-scroll-NN.jpg     one viewport per scroll step (sticky / hiding chrome)
//   desktop-load-NNNNms.jpg      first-paint filmstrip (page-load entrances)
//   <viewport>.webm              video of the load, the scroll and the probes
//   hover/NN-{rest,hover}.png    each distinct interactive element, at rest and hovered
//   mobile-menu.jpg              the mobile menu, opened
//   desktop.html, raw.html       rendered DOM and server HTML
//   data.json                    the census below
// and summary.json + summary.md aggregating every page.
//
// The census: @font-face sources and loaded faces, type styles, colours (grounds
// weighted by area), radii, borders, shadows, gaps, paddings, max-widths, media
// queries, CSS custom properties, keyframes, Framer layer names and appear
// config, sticky and fixed elements, motion sampled every frame after each
// scroll step (entrances, scroll-linked transforms, loops) with timings, hover
// deltas with timings, custom cursors, images, video, forms, links and meta.
//
// Playwright is not a project dependency. The script falls back to the global
// install (`npm root -g`) that the cloud environment ships with.

import { execSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: "tablet", width: 810, height: 1080, deviceScaleFactor: 1 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];
const LOAD_FRAMES_MS = [0, 150, 300, 500, 800, 1200, 1800, 2600];
const SETTLE_MS = 1200; // frames sampled after each scroll step
const MAX_SCROLL_STEPS = 40;
const MAX_HOVER_TARGETS = 45;
const MAX_CANDIDATES = 1800;

const args = parseArgs(process.argv.slice(2));
const start = new URL(args.url);
const outDir = args.out ?? join("docs", "reference", start.hostname.split(".")[0]);
const viewports = VIEWPORTS.filter((v) => !args.only || args.only.includes(v.name));
const hoverSeen = new Set(); // hover signatures probed on earlier pages

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const queue = [normalise(start.href)];
const queued = new Set(queue);
const perTemplate = new Map();
const pages = [];

try {
  while (queue.length && pages.length < args.maxPages) {
    const url = queue.shift();
    console.log(`\n→ ${url}`);
    const data = await capturePage(url);
    pages.push(data);
    for (const href of data.census?.links?.map((l) => l.href) ?? []) {
      const next = normalise(href);
      if (!next || queued.has(next)) continue;
      const key = templateKey(next);
      if ((perTemplate.get(key) ?? 0) >= args.perTemplate) continue;
      perTemplate.set(key, (perTemplate.get(key) ?? 0) + 1);
      queued.add(next);
      queue.push(next);
    }
  }
} finally {
  await browser.close();
}

await rm(join(outDir, ".video-tmp"), { recursive: true, force: true });
const summary = summarise(pages);
await writeFile(join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
await writeFile(join(outDir, "summary.md"), renderSummary(summary));
console.log(`\nDone: ${pages.length} page(s) → ${outDir}`);
if (queue.length) console.log(`Not captured (raise --max-pages): ${queue.join(", ")}`);

// ---------------------------------------------------------------------------

async function capturePage(url) {
  const slug = slugFor(url);
  const dir = join(outDir, slug);
  await mkdir(join(dir, "hover"), { recursive: true });
  const data = { url, slug, capturedAt: new Date().toISOString(), viewports: {} };

  for (const vp of viewports) {
    console.log(`  ${vp.name} ${vp.width}×${vp.height}`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: Boolean(vp.isMobile),
      hasTouch: Boolean(vp.hasTouch),
      reducedMotion: "no-preference",
      recordVideo: { dir: join(outDir, ".video-tmp"), size: { width: vp.width, height: vp.height } },
    });
    const page = await context.newPage();
    const v = {};
    try {
      const t0 = Date.now();
      const response = await page.goto(url, { waitUntil: "commit", timeout: 60_000 });
      if (vp.name === viewports[0].name) {
        // Tag and sample as early as the DOM allows, while the load filmstrip is taken.
        await page.waitForLoadState("domcontentloaded").catch(() => {});
        v.loadCandidates = await page.evaluate(tagCandidates, MAX_CANDIDATES).catch(() => []);
        const sampling = page.evaluate(sampleMotion, 3000).catch((e) => ({ error: e.message }));
        v.loadFrames = await loadFilmstrip(page, dir, t0);
        v.loadMotion = await sampling;
        if (response) await writeFile(join(dir, "raw.html"), await response.text().catch(() => ""));
      }
      await page.waitForLoadState("load", { timeout: 30_000 }).catch(() => {});
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      await page.waitForTimeout(1500);

      v.candidates = await page.evaluate(tagCandidates, MAX_CANDIDATES);
      v.scroll = await scrollPass(page, dir, vp, v.candidates);
      v.chrome = await chromeProbe(page, vp);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      await fullPage(page, join(dir, `${vp.name}-full.jpg`));
      v.layers = await page.evaluate(layerOutline, vp.name === "desktop" ? 7 : 4);

      if (vp.name === "desktop") {
        data.census = await page.evaluate(census);
        await writeFile(join(dir, "desktop.html"), await page.content());
        if (pages.length === 0) data.bundles = await page.evaluate(scanBundles).catch((e) => ({ error: e.message }));
        data.hover = await hoverPass(page, dir);
        data.cursor = await cursorProbe(page, vp);
      }
      if (vp.isMobile) v.menu = await mobileMenuProbe(page, dir, v.candidates);
    } catch (e) {
      v.error = e.message;
      console.warn(`    ! ${e.message}`);
    }
    const video = page.video();
    await context.close();
    if (video) await video.saveAs(join(dir, `${vp.name}.webm`)).then(() => video.delete()).catch(() => {});
    data.viewports[vp.name] = v;
  }

  await writeFile(join(dir, "data.json"), JSON.stringify(data, null, 2));
  return data;
}

async function loadFilmstrip(page, dir, t0) {
  const frames = [];
  for (const at of LOAD_FRAMES_MS) {
    const wait = t0 + at - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
    const took = Date.now() - t0;
    const file = `desktop-load-${String(at).padStart(4, "0")}ms.jpg`;
    try {
      await page.screenshot({ path: join(dir, file), type: "jpeg", quality: 70 });
      frames.push({ at, took, file });
    } catch (e) {
      frames.push({ at, took, error: e.message });
    }
  }
  return frames;
}

async function scrollPass(page, dir, vp, candidates) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const maxY = Math.max(0, height - vp.height);
  let step = Math.round(vp.height * 0.75);
  if (maxY / step > MAX_SCROLL_STEPS) step = Math.ceil(maxY / MAX_SCROLL_STEPS);
  const positions = [];
  for (let y = 0; y < maxY; y += step) positions.push(y);
  positions.push(maxY);

  const steps = [];
  for (const [i, y] of positions.entries()) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    const motion = await page.evaluate(sampleMotion, SETTLE_MS);
    const actualY = await page.evaluate(() => Math.round(window.scrollY));
    steps.push({ y, actualY, ...motion });
    if (vp.name !== "tablet") {
      await page
        .screenshot({ path: join(dir, `${vp.name}-scroll-${String(i).padStart(2, "0")}.jpg`), type: "jpeg", quality: 70 })
        .catch(() => {});
    }
  }
  return { documentHeight: height, step, analysis: analyseMotion(steps, candidates), steps: steps.map(compactStep) };
}

// Does fixed / sticky chrome hide on the way down and return on the way up?
async function chromeProbe(page, vp) {
  const read = () =>
    page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => ["fixed", "sticky"].includes(getComputedStyle(el).position))
        .slice(0, 20)
        .map((el) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            name: el.getAttribute("data-framer-name"),
            tag: el.tagName.toLowerCase(),
            position: cs.position,
            top: Math.round(r.top),
            height: Math.round(r.height),
            width: Math.round(r.width),
            transform: cs.transform,
            opacity: cs.opacity,
            background: cs.backgroundColor,
            backdrop: cs.backdropFilter,
            zIndex: cs.zIndex,
          };
        }),
    );
  const at = async (label, fn) => {
    await fn();
    await page.waitForTimeout(900);
    return { label, scrollY: await page.evaluate(() => Math.round(window.scrollY)), elements: await read() };
  };
  const wheel = (dy) => (vp.hasTouch ? page.evaluate((d) => window.scrollBy(0, d), dy) : page.mouse.wheel(0, dy));
  return [
    await at("top", () => page.evaluate(() => window.scrollTo(0, 0))),
    await at("down 1200", () => wheel(1200)),
    await at("down 400 more", () => wheel(400)),
    await at("up 250", () => wheel(-250)),
  ];
}

async function hoverPass(page, dir) {
  const targets = await page.evaluate((max) => {
    const all = [...document.querySelectorAll("body *")].filter((el) => {
      if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") return false;
      const r = el.getBoundingClientRect();
      return r.width >= 4 && r.height >= 4 && (el.matches("a[href],button,[role=button],summary") || getComputedStyle(el).cursor === "pointer");
    });
    const outer = all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
    return outer.slice(0, max * 4).map((el, i) => {
      el.setAttribute("data-td-hover", String(i));
      const r = el.getBoundingClientRect();
      return {
        i,
        tag: el.tagName.toLowerCase(),
        name: el.getAttribute("data-framer-name"),
        text: (el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 60),
        href: el.getAttribute("href"),
        signature: [el.tagName, el.getAttribute("data-framer-name") ?? "", String(el.className?.baseVal ?? el.className).split(" ")[0], Math.round(r.width / 16), Math.round(r.height / 8)].join("|"),
      };
    });
  }, MAX_HOVER_TARGETS);

  const results = [];
  for (const t of targets) {
    if (results.length >= MAX_HOVER_TARGETS) break;
    if (hoverSeen.has(t.signature)) continue;
    hoverSeen.add(t.signature);
    const n = String(results.length).padStart(2, "0");
    const el = page.locator(`[data-td-hover="${t.i}"]`).first();
    try {
      await el.scrollIntoViewIfNeeded({ timeout: 3000 });
      await page.mouse.move(1, 1);
      await page.waitForTimeout(500);
      const box = await el.boundingBox();
      if (!box) continue;
      const vpSize = page.viewportSize();
      const clip = {
        x: Math.max(0, box.x - 16),
        y: Math.max(0, box.y - 16),
        width: Math.min(vpSize.width - Math.max(0, box.x - 16), box.width + 32),
        height: Math.min(vpSize.height - Math.max(0, box.y - 16), box.height + 32),
      };
      const before = await el.evaluate(styleSnapshot);
      await page.screenshot({ path: join(dir, "hover", `${n}-rest.png`), clip }).catch(() => {});
      const timing = el.evaluate(sampleSubtree, 1000).catch(() => null);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
      const series = await timing;
      await page.waitForTimeout(150);
      const after = await el.evaluate(styleSnapshot);
      await page.screenshot({ path: join(dir, "hover", `${n}-hover.png`), clip }).catch(() => {});
      const changes = diffSnapshots(before, after);
      results.push({ n, ...t, changes, settleMs: series?.settleMs ?? null, cursor: after[0]?.cursor });
    } catch (e) {
      results.push({ n, ...t, error: e.message.slice(0, 140) });
    }
  }
  await page.mouse.move(1, 1);
  return results;
}

// A custom cursor is a fixed, pointer-events:none element that follows the mouse.
async function cursorProbe(page, vp) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const points = [
    [vp.width * 0.2, vp.height * 0.3],
    [vp.width * 0.55, vp.height * 0.6],
    [vp.width * 0.8, vp.height * 0.4],
  ];
  const snaps = [];
  for (const [x, y] of points) {
    await page.mouse.move(x, y, { steps: 8 });
    await page.waitForTimeout(600);
    snaps.push({
      x,
      y,
      els: await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            const cs = getComputedStyle(el);
            return cs.position === "fixed" && cs.pointerEvents === "none";
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              name: el.getAttribute("data-framer-name"),
              cx: Math.round(r.left + r.width / 2),
              cy: Math.round(r.top + r.height / 2),
              w: Math.round(r.width),
              h: Math.round(r.height),
              blend: getComputedStyle(el).mixBlendMode,
            };
          }),
      ),
    });
  }
  const followers = (snaps[0]?.els ?? []).filter((_, i) =>
    snaps.every((s) => {
      const e = s.els[i];
      return e && Math.abs(e.cx - s.x) < 60 && Math.abs(e.cy - s.y) < 60;
    }),
  );
  return { bodyCursor: await page.evaluate(() => getComputedStyle(document.body).cursor), followers };
}

async function mobileMenuProbe(page, dir, candidates) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => {
    const visibleLinks = () => [...document.querySelectorAll("a[href]")].filter((a) => a.getBoundingClientRect().height > 0 && getComputedStyle(a).visibility !== "hidden").length;
    const all = [...document.querySelectorAll("body *")].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > 140 || r.width < 12 || r.height < 12 || r.width > 120 || r.height > 120) return false;
      if (!(el.matches("button,[role=button]") || getComputedStyle(el).cursor === "pointer")) return false;
      const a = el.closest("a[href]");
      return !a || new URL(a.href).pathname === location.pathname;
    });
    const outer = all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
    return {
      links: visibleLinks(),
      list: outer
        .map((el, i) => {
          el.setAttribute("data-td-menu", String(i));
          return { i, x: Math.round(el.getBoundingClientRect().left), name: el.getAttribute("data-framer-name"), tag: el.tagName.toLowerCase() };
        })
        .sort((a, b) => b.x - a.x),
    };
  });
  for (const c of before.list.slice(0, 3)) {
    await page.locator(`[data-td-menu="${c.i}"]`).first().click({ timeout: 3000 }).catch(() => {});
    const series = await page.evaluate(sampleMotion, 1200).catch(() => null);
    const after = await page.evaluate(() => ({
      links: [...document.querySelectorAll("a[href]")].filter((a) => a.getBoundingClientRect().height > 0 && getComputedStyle(a).visibility !== "hidden").length,
      texts: [...document.querySelectorAll("a[href]")]
        .filter((a) => {
          const r = a.getBoundingClientRect();
          return r.height > 0 && r.top >= 0 && r.top < innerHeight;
        })
        .map((a) => a.innerText.trim())
        .filter(Boolean)
        .slice(0, 30),
    }));
    if (after.links > before.links) {
      await page.screenshot({ path: join(dir, "mobile-menu.jpg"), type: "jpeg", quality: 75 }).catch(() => {});
      const motion = series ? analyseMotion([{ y: 0, actualY: 0, ...series }], candidates).filter((m) => m.kind !== "loop") : null;
      return { toggle: c, linksBefore: before.links, ...after, motion };
    }
  }
  return { toggle: null, note: "No toggle in the top 140px revealed more links." };
}

async function fullPage(page, path) {
  try {
    await page.screenshot({ path, fullPage: true, type: "jpeg", quality: 72, timeout: 60_000 });
  } catch (e) {
    console.warn(`    ! full-page screenshot failed: ${e.message.slice(0, 120)}`);
  }
}

// ---------------------------------------------------------------------------
// In-page functions. These are serialised into the page, so they cannot close
// over anything in this module.

function tagCandidates(max) {
  const els = [...document.querySelectorAll("body *")].filter((el) => {
    if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") return false;
    const cs = getComputedStyle(el);
    return (
      el.hasAttribute("data-framer-name") ||
      el.hasAttribute("data-framer-appear-id") ||
      cs.willChange !== "auto" ||
      cs.transform !== "none" ||
      cs.opacity !== "1" ||
      cs.animationName !== "none" ||
      cs.position === "sticky" ||
      cs.position === "fixed"
    );
  });
  document.querySelectorAll("[data-td-id]").forEach((el) => el.removeAttribute("data-td-id"));
  const kept = els.slice(0, max);
  kept.forEach((el, i) => el.setAttribute("data-td-id", String(i)));
  return kept.map((el, i) => ({
    id: i,
    parent: el.parentElement?.closest("[data-td-id]")?.getAttribute("data-td-id") ?? null,
    name: el.getAttribute("data-framer-name"),
    appearId: el.getAttribute("data-framer-appear-id"),
    tag: el.tagName.toLowerCase(),
    position: getComputedStyle(el).position,
    text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 50),
  }));
}

// Reads every tagged element each animation frame for `ms` and returns the
// ones that changed, as [id, [[t, "transform|opacity|top|filter|clip"], …]].
// `top` is document-relative, so a smooth-scroll library that is still easing
// the page does not make every element look animated; sticky and fixed
// elements do show up, because their document position is what changes.
async function sampleMotion(ms) {
  const els = [...document.querySelectorAll("[data-td-id]")];
  const read = (el) => {
    const cs = getComputedStyle(el);
    return [cs.transform, cs.opacity, Math.round(el.getBoundingClientRect().top + window.scrollY), cs.filter, cs.clipPath].join("|");
  };
  const first = els.map(read);
  const last = first.slice();
  const series = new Map();
  const t0 = performance.now();
  await new Promise((resolve) => {
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      els.forEach((el, i) => {
        const value = read(el);
        if (value === last[i]) return;
        last[i] = value;
        if (!series.has(i)) series.set(i, [[0, first[i]]]);
        const s = series.get(i);
        if (s.length < 80) s.push([t, value]);
        else s[s.length - 1] = [t, value];
      });
      if (t < ms) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
  return { windowMs: ms, changed: [...series].map(([i, s]) => [els[i].dataset.tdId, s]) };
}

async function sampleSubtree(root, ms) {
  const els = [root, ...root.querySelectorAll("*")].slice(0, 40);
  const read = (el) => {
    const cs = getComputedStyle(el);
    return [cs.transform, cs.opacity, cs.color, cs.backgroundColor, cs.boxShadow, cs.width, cs.borderColor].join("|");
  };
  let lastChange = 0;
  const last = els.map(read);
  const t0 = performance.now();
  await new Promise((resolve) => {
    const tick = () => {
      const t = performance.now() - t0;
      els.forEach((el, i) => {
        const v = read(el);
        if (v !== last[i]) {
          last[i] = v;
          lastChange = t;
        }
      });
      if (t < ms) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
  return { settleMs: Math.round(lastChange) };
}

function styleSnapshot(root) {
  const props = ["color", "backgroundColor", "backgroundImage", "borderColor", "borderWidth", "borderRadius", "boxShadow", "transform", "opacity", "filter", "textDecorationLine", "width", "height", "letterSpacing", "cursor"];
  return [root, ...root.querySelectorAll("*")].slice(0, 30).map((el, i) => {
    const cs = getComputedStyle(el);
    const o = { i, tag: el.tagName.toLowerCase(), name: el.getAttribute("data-framer-name") };
    for (const p of props) o[p] = cs[p];
    return o;
  });
}

function layerOutline(maxDepth) {
  const nodes = [];
  const walk = (el, depth) => {
    for (const child of el.children) {
      if (nodes.length > 2500) return;
      const named = child.hasAttribute("data-framer-name") || /^(header|nav|main|section|footer|h[1-6]|p|a|button|img|video|form)$/i.test(child.tagName);
      const r = child.getBoundingClientRect();
      const cs = getComputedStyle(child);
      if (cs.display === "none") continue;
      if (named && r.width >= 24 && r.height >= 12) {
        const own = [...child.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
        nodes.push({
          depth,
          name: child.getAttribute("data-framer-name"),
          tag: child.tagName.toLowerCase(),
          x: Math.round(r.left),
          y: Math.round(r.top + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
          display: cs.display,
          dir: cs.display.includes("flex") ? cs.flexDirection : undefined,
          gap: cs.gap !== "normal" ? cs.gap : undefined,
          cols: cs.display.includes("grid") ? cs.gridTemplateColumns : undefined,
          pad: cs.padding !== "0px" ? cs.padding : undefined,
          maxW: cs.maxWidth !== "none" ? cs.maxWidth : undefined,
          bg: cs.backgroundColor !== "rgba(0, 0, 0, 0)" ? cs.backgroundColor : undefined,
          radius: cs.borderRadius !== "0px" ? cs.borderRadius : undefined,
          pos: cs.position !== "static" && cs.position !== "relative" ? cs.position : undefined,
          text: (own || (child.matches("h1,h2,h3,h4,h5,h6,p,a,button") ? child.innerText : "")).trim().replace(/\s+/g, " ").slice(0, 90) || undefined,
          src: child.currentSrc || child.getAttribute("src") || undefined,
        });
        if (depth < maxDepth) walk(child, depth + 1);
      } else {
        walk(child, depth);
      }
    }
  };
  walk(document.body, 0);
  return nodes;
}

// Framer compiles each effect into its JS modules as plain objects, e.g.
// {damping:60,delay:0,mass:1,stiffness:500,type:"spring"} for a transition and
// {opacity:0,rotate:0,scale:1,x:0,y:40} for a start state. Tallying them gives
// the site's motion vocabulary, including effects the sampler never triggered.
async function scanBundles() {
  const urls = [...new Set(performance.getEntriesByType("resource").map((e) => e.name).filter((u) => /\.m?js(\?|$)/.test(u)))].slice(0, 80);
  const transitions = new Map();
  const states = new Map();
  const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
  let read = 0;
  for (const url of urls) {
    let src = "";
    try {
      src = await (await fetch(url)).text();
      read++;
    } catch {
      continue;
    }
    for (const m of src.matchAll(/\{[^{}]{0,300}?type:"(?:spring|tween|inertia)"[^{}]{0,300}?\}/g)) bump(transitions, m[0]);
    for (const m of src.matchAll(/\{(?:(?:opacity|scale|scaleX|scaleY|rotate|rotateX|rotateY|skewX|skewY|x|y|z|transformPerspective):-?[\d.e]+,?){3,}\}/g)) bump(states, m[0]);
  }
  const top = (map, n) => [...map].sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, count]) => ({ value, count }));
  return { scripts: urls.length, read, transitions: top(transitions, 60), states: top(states, 60) };
}

function census() {
  const tally = (map, key, extra) => {
    const e = map.get(key) ?? { key, count: 0, ...extra?.init };
    e.count++;
    extra?.add?.(e);
    map.set(key, e);
  };
  const visible = (cs, r) => r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0";
  const type = new Map(), text = new Map(), ground = new Map(), border = new Map(), radius = new Map(), shadow = new Map();
  const gap = new Map(), padding = new Map(), maxWidth = new Map(), filter = new Map(), transition = new Map(), gradient = new Map();

  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!visible(cs, r)) continue;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
    if (own) {
      const key = [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.lineHeight, cs.letterSpacing, cs.textTransform, cs.fontStyle].join(" | ");
      tally(type, key, {
        init: { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, colors: {}, tags: {}, samples: [] },
        add: (e) => {
          e.colors[cs.color] = (e.colors[cs.color] ?? 0) + 1;
          const tag = el.tagName.toLowerCase();
          e.tags[tag] = (e.tags[tag] ?? 0) + 1;
          if (e.samples.length < 3) e.samples.push(own.slice(0, 70));
        },
      });
      tally(text, cs.color);
    }
    const area = Math.round((r.width * r.height) / 1000);
    if (cs.backgroundColor !== "rgba(0, 0, 0, 0)") tally(ground, cs.backgroundColor, { init: { area: 0 }, add: (e) => (e.area += area) });
    if (cs.backgroundImage.includes("gradient")) tally(gradient, cs.backgroundImage.slice(0, 200));
    if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") tally(border, `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`);
    if (cs.borderRadius !== "0px") tally(radius, cs.borderRadius, { init: { names: [] }, add: (e) => e.names.length < 4 && el.dataset.framerName && !e.names.includes(el.dataset.framerName) && e.names.push(el.dataset.framerName) });
    if (cs.boxShadow !== "none") tally(shadow, cs.boxShadow);
    if (cs.display.includes("flex") || cs.display.includes("grid")) {
      if (cs.gap !== "normal" && cs.gap !== "0px") tally(gap, cs.gap);
      if (cs.padding !== "0px") tally(padding, cs.padding);
    }
    if (cs.maxWidth !== "none") tally(maxWidth, cs.maxWidth);
    if (cs.backdropFilter !== "none") tally(filter, `backdrop ${cs.backdropFilter}`);
    if (cs.filter !== "none") tally(filter, cs.filter);
    if (cs.mixBlendMode !== "normal") tally(filter, `blend ${cs.mixBlendMode}`);
    if (cs.transitionDuration !== "0s") tally(transition, `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction} ${cs.transitionDelay}`);
  }

  const cssVars = new Map(), media = new Map(), fontFaces = [], keyframes = [];
  const walkRules = (rules) => {
    for (const rule of rules) {
      if (rule instanceof CSSFontFaceRule) {
        fontFaces.push({ family: rule.style.getPropertyValue("font-family"), weight: rule.style.getPropertyValue("font-weight"), style: rule.style.getPropertyValue("font-style"), src: rule.style.getPropertyValue("src").slice(0, 180) });
      } else if (rule instanceof CSSKeyframesRule) {
        keyframes.push({ name: rule.name, css: rule.cssText.slice(0, 400) });
      } else if (rule instanceof CSSMediaRule) {
        tally(media, rule.conditionText);
        walkRules(rule.cssRules);
      } else if (rule instanceof CSSStyleRule) {
        for (const p of rule.style) if (p.startsWith("--") && cssVars.size < 600) tally(cssVars, `${p}: ${rule.style.getPropertyValue(p).trim()}`);
      } else if (rule.cssRules) {
        walkRules(rule.cssRules);
      }
    }
  };
  for (const sheet of document.styleSheets) {
    try {
      walkRules(sheet.cssRules);
    } catch {
      fontFaces.push({ note: `cross-origin sheet not readable: ${sheet.href}` });
    }
  }

  const sorted = (map, n = 40, by = "count") => [...map.values()].sort((a, b) => b[by] - a[by]).slice(0, n);
  const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
  return {
    meta: {
      title: document.title,
      description: meta('meta[name="description"]'),
      ogImage: meta('meta[property="og:image"]'),
      generator: meta('meta[name="generator"]'),
      themeColor: meta('meta[name="theme-color"]'),
      lang: document.documentElement.lang,
      favicon: document.querySelector('link[rel~="icon"]')?.href ?? null,
      lenis: document.documentElement.classList.contains("lenis"),
      documentHeight: document.documentElement.scrollHeight,
    },
    loadedFonts: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight} ${f.style}`),
    fontFaces,
    typeStyles: sorted(type, 60),
    textColors: sorted(text, 30),
    grounds: sorted(ground, 30, "area"),
    gradients: sorted(gradient, 15),
    borders: sorted(border, 20),
    radii: sorted(radius, 25),
    shadows: sorted(shadow, 15),
    gaps: sorted(gap, 30),
    paddings: sorted(padding, 30),
    maxWidths: sorted(maxWidth, 20),
    filters: sorted(filter, 20),
    transitions: sorted(transition, 20),
    mediaQueries: sorted(media, 30),
    cssVariables: sorted(cssVars, 200),
    keyframes,
    framerScripts: [...document.querySelectorAll('script[type^="framer/"]')].map((s) => ({ id: s.id, type: s.type, content: s.textContent.slice(0, 30_000) })),
    framerHydrate: document.querySelector("#main")?.getAttribute("data-framer-hydrate-v2")?.slice(0, 4000) ?? null,
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({ tag: h.tagName.toLowerCase(), text: h.innerText.trim().replace(/\s+/g, " ").slice(0, 120) })),
    links: [...document.querySelectorAll("a[href]")].map((a) => ({ text: a.innerText.trim().replace(/\s+/g, " ").slice(0, 60), href: a.href })),
    images: [...document.querySelectorAll("img")].slice(0, 120).map((img) => ({ src: img.currentSrc || img.src, alt: img.alt, natural: `${img.naturalWidth}×${img.naturalHeight}`, rendered: `${Math.round(img.getBoundingClientRect().width)}×${Math.round(img.getBoundingClientRect().height)}`, fit: getComputedStyle(img).objectFit })),
    videos: [...document.querySelectorAll("video")].map((v) => ({ src: v.currentSrc || v.querySelector("source")?.src, poster: v.poster, autoplay: v.autoplay, loop: v.loop, muted: v.muted })),
    iframes: [...document.querySelectorAll("iframe")].map((f) => f.src),
    forms: [...document.querySelectorAll("input,textarea,select")].map((f) => ({ tag: f.tagName.toLowerCase(), type: f.type, name: f.name, placeholder: f.placeholder })),
    svgCount: document.querySelectorAll("svg").length,
  };
}

// ---------------------------------------------------------------------------
// Node-side analysis and output.

// Kinds: "loop" keeps moving whenever it is sampled (marquee, ticker, spinner);
// "scroll-linked" changes at three or more scroll positions (parallax, scroll
// transforms); "triggered" runs once or twice and settles (entrances, chrome
// hiding on scroll, menus opening).
function analyseMotion(steps, candidates = []) {
  const info = new Map(candidates.map((c) => [String(c.id), c]));
  const byId = new Map();
  for (const step of steps) {
    for (const [id, series] of step.changed ?? []) {
      const entry = byId.get(id) ?? { id, windows: new Map() };
      const [, from] = series[0];
      const [tEnd, to] = series.at(-1);
      const tStart = series[1]?.[0] ?? 0;
      const windowMs = step.windowMs ?? SETTLE_MS;
      entry.windows.set(step.actualY, { atScrollY: step.actualY, startMs: tStart, endMs: tEnd, frames: series.length, from, to, windowMs, runsToEnd: tEnd >= windowMs - 100 });
      byId.set(id, entry);
    }
  }
  // An element that moves only because a tagged ancestor moves, in the same
  // window and on the same clock, is the ancestor's motion rather than its own.
  const followsAncestor = (id, w) => {
    for (let p = info.get(id)?.parent; p != null; p = info.get(p)?.parent) {
      const pw = byId.get(p)?.windows.get(w.atScrollY);
      if (pw && Math.abs(pw.startMs - w.startMs) < 80 && Math.abs(pw.endMs - w.endMs) < 80) return true;
    }
    return false;
  };
  const out = [];
  for (const e of byId.values()) {
    const windows = [...e.windows.values()].filter((w) => !followsAncestor(e.id, w));
    if (!windows.length) continue;
    const loops = windows.filter((w) => w.runsToEnd).length;
    // One window can only call something a loop when it outran a long (load) window.
    const looping = loops >= 2 ? loops >= windows.length * 0.6 : windows.length === 1 && windows[0].runsToEnd && windows[0].windowMs >= 2500;
    const kind = looping ? "loop" : windows.length >= 3 ? "scroll-linked" : "triggered";
    const c = info.get(e.id);
    out.push({ id: e.id, kind, name: c?.name ?? null, tag: c?.tag, text: c?.text, windows: windows.slice(0, 8) });
  }
  return out;
}

// "matrix(1, 0, 0, 1, 0, 40)|0|1180|none|none" → "translate 0,40, opacity 0 @y1180"
function describeState(state = "") {
  const [transform = "none", opacity = "1", top = "?", filter = "none", clip = "none"] = state.split("|");
  const parts = [];
  const m = transform.match(/^matrix\(([^)]+)\)$/);
  if (m) {
    const [a, b, c, d, e, f] = m[1].split(",").map(Number);
    const r = (n, p = 3) => +n.toFixed(p);
    if (b === 0 && c === 0) {
      if (a !== 1 || d !== 1) parts.push(a === d ? `scale ${r(a)}` : `scale ${r(a)},${r(d)}`);
      if (e || f) parts.push(`translate ${r(e, 1)},${r(f, 1)}`);
    } else {
      parts.push(`rotate ${Math.round((Math.atan2(b, a) * 180) / Math.PI)}° scale ${r(Math.hypot(a, b))} translate ${r(e, 1)},${r(f, 1)}`);
    }
  } else if (transform !== "none") {
    parts.push(transform.slice(0, 70));
  }
  if (opacity !== "1") parts.push(`opacity ${opacity}`);
  if (filter !== "none") parts.push(filter);
  if (clip !== "none") parts.push(`clip ${clip.slice(0, 50)}`);
  return `${parts.join(", ") || "rest"} @y${top}`;
}

function compactStep(step) {
  return { y: step.y, actualY: step.actualY, changedCount: step.changed?.length ?? 0 };
}

function diffSnapshots(before, after) {
  const out = [];
  before.forEach((b, i) => {
    const a = after[i];
    if (!a) return;
    for (const k of Object.keys(b)) {
      if (["i", "tag", "name"].includes(k)) continue;
      if (b[k] !== a[k]) out.push({ el: i === 0 ? "self" : `${b.tag}#${i}${b.name ? ` (${b.name})` : ""}`, prop: k, from: b[k], to: a[k] });
    }
  });
  return out.slice(0, 40);
}

function summarise(pages) {
  const merge = (field, key = "key", by = "count", n = 40) => {
    const m = new Map();
    for (const p of pages) {
      for (const e of p.census?.[field] ?? []) {
        const cur = m.get(e[key]) ?? { ...e, count: 0, area: 0, pages: 0 };
        cur.count += e.count ?? 0;
        cur.area += e.area ?? 0;
        cur.pages += 1;
        m.set(e[key], cur);
      }
    }
    return [...m.values()].sort((a, b) => b[by] - a[by]).slice(0, n);
  };
  const first = pages[0]?.census ?? {};
  return {
    site: start.origin,
    capturedAt: new Date().toISOString(),
    pages: pages.map((p) => ({ url: p.url, slug: p.slug, title: p.census?.meta?.title, height: p.census?.meta?.documentHeight, headings: p.census?.headings?.slice(0, 25) })),
    meta: first.meta,
    loadedFonts: [...new Set(pages.flatMap((p) => p.census?.loadedFonts ?? []))],
    fontFaces: first.fontFaces,
    typeStyles: merge("typeStyles", "key", "count", 50),
    textColors: merge("textColors"),
    grounds: merge("grounds", "key", "area", 30),
    gradients: merge("gradients"),
    borders: merge("borders"),
    radii: merge("radii"),
    shadows: merge("shadows"),
    gaps: merge("gaps"),
    paddings: merge("paddings"),
    maxWidths: merge("maxWidths"),
    filters: merge("filters"),
    transitions: merge("transitions"),
    mediaQueries: merge("mediaQueries"),
    cssVariables: merge("cssVariables", "key", "count", 200),
    keyframes: first.keyframes,
    framerScripts: first.framerScripts?.map((f) => ({ id: f.id, type: f.type, bytes: f.content.length })),
    bundles: pages[0]?.bundles,
    chrome: Object.entries(pages[0]?.viewports ?? {}).flatMap(([vp, v]) =>
      (v.chrome ?? []).flatMap((probe) => probe.elements.map((e) => ({ vp, probe: probe.label, scrollY: probe.scrollY, ...e }))),
    ),
    motion: pages.flatMap((p) =>
      Object.entries(p.viewports).flatMap(([vp, v]) => [
        ...(v.loadMotion?.changed ? analyseMotion([{ y: 0, actualY: 0, ...v.loadMotion }], v.loadCandidates) : []).map((m) => ({ page: p.slug, vp, phase: "load", ...m })),
        ...(v.scroll?.analysis ?? []).map((m) => ({ page: p.slug, vp, phase: "scroll", ...m })),
      ]),
    ),
    hover: pages.flatMap((p) => (p.hover ?? []).map((h) => ({ page: p.slug, ...h }))),
    cursor: pages[0]?.cursor,
    mobileMenu: pages[0]?.viewports?.mobile?.menu,
  };
}

function renderSummary(s) {
  const rows = (items, cols) => items.map((i) => `| ${cols.map((c) => String(c(i) ?? "").replace(/\|/g, "\\|")).join(" | ")} |`).join("\n");
  const table = (title, head, items, cols) => (items?.length ? `\n## ${title}\n\n| ${head.join(" | ")} |\n| ${head.map(() => "---").join(" | ")} |\n${rows(items, cols)}\n` : "");
  return [
    `# Reference capture: ${s.site}`,
    `Captured ${s.capturedAt}. Generator: ${s.meta?.generator ?? "unknown"}. Lenis smooth scroll: ${s.meta?.lenis ? "yes" : "no"}.`,
    table("Pages", ["Slug", "Title", "Height (px)", "URL"], s.pages, [(p) => p.slug, (p) => p.title, (p) => p.height, (p) => p.url]),
    `\n## Fonts\n\nLoaded: ${s.loadedFonts.join(", ") || "none reported"}\n`,
    table("Type styles (desktop, by frequency)", ["Family", "Size", "Weight", "Line height", "Tracking", "Case", "Count", "Sample"], s.typeStyles, [
      (t) => t.fontFamily?.split(",")[0],
      (t) => t.fontSize,
      (t) => t.fontWeight,
      (t) => t.lineHeight,
      (t) => t.letterSpacing,
      (t) => t.textTransform,
      (t) => t.count,
      (t) => t.samples?.[0],
    ]),
    table("Text colours", ["Colour", "Count"], s.textColors, [(c) => c.key, (c) => c.count]),
    table("Grounds (by painted area)", ["Colour", "Area (k px²)", "Count"], s.grounds, [(c) => c.key, (c) => c.area, (c) => c.count]),
    table("Gradients", ["Gradient", "Count"], s.gradients, [(c) => c.key, (c) => c.count]),
    table("Borders", ["Border", "Count"], s.borders, [(c) => c.key, (c) => c.count]),
    table("Radii", ["Radius", "Count", "Layers"], s.radii, [(c) => c.key, (c) => c.count, (c) => c.names?.join(", ")]),
    table("Shadows", ["Shadow", "Count"], s.shadows, [(c) => c.key, (c) => c.count]),
    table("Gaps (flex/grid)", ["Gap", "Count"], s.gaps, [(c) => c.key, (c) => c.count]),
    table("Paddings (flex/grid)", ["Padding", "Count"], s.paddings, [(c) => c.key, (c) => c.count]),
    table("Max widths", ["Max width", "Count"], s.maxWidths, [(c) => c.key, (c) => c.count]),
    table("Media queries", ["Condition", "Count"], s.mediaQueries, [(c) => c.key, (c) => c.count]),
    table("Filters and blend modes", ["Value", "Count"], s.filters, [(c) => c.key, (c) => c.count]),
    table("CSS transitions", ["Transition", "Count"], s.transitions, [(c) => c.key, (c) => c.count]),
    table("Hover changes", ["Page", "#", "Element", "Settles (ms)", "Changes"], s.hover, [
      (h) => h.page,
      (h) => h.n,
      (h) => `${h.tag}${h.name ? ` “${h.name}”` : ""} ${h.text ? `“${h.text}”` : ""}`,
      (h) => h.settleMs,
      (h) => (h.error ? `error: ${h.error}` : h.changes?.map((c) => `${c.el}.${c.prop}: ${c.from} → ${c.to}`).slice(0, 4).join("; ")),
    ]),
    table("Motion (sampled every frame; times from the scroll or load that triggered it)", ["Page", "Viewport", "Phase", "Kind", "Element", "At scrollY", "Start–end (ms)", "From → to"], s.motion.flatMap((m) => m.windows.slice(0, m.kind === "triggered" ? 2 : 3).map((w) => ({ ...m, w }))), [
      (m) => m.page,
      (m) => m.vp,
      (m) => m.phase,
      (m) => m.kind,
      (m) => `${m.name ? `“${m.name}” ` : ""}${m.tag}${m.text ? ` “${m.text.slice(0, 30)}”` : ""}`,
      (m) => m.w.atScrollY,
      (m) => `${m.w.startMs}–${m.w.endMs}${m.w.runsToEnd ? "+" : ""}`,
      (m) => `${describeState(m.w.from)} → ${describeState(m.w.to)}`,
    ]),
    table("Transitions compiled into the JS bundles", ["Transition", "Count"], s.bundles?.transitions, [(t) => `\`${t.value}\``, (t) => t.count]),
    table("Start and end states compiled into the JS bundles", ["State", "Count"], s.bundles?.states, [(t) => `\`${t.value}\``, (t) => t.count]),
    table("Fixed and sticky chrome while scrolling", ["Viewport", "Probe", "scrollY", "Element", "Position", "Top", "Transform", "Opacity", "Background", "Backdrop"], s.chrome, [
      (c) => c.vp,
      (c) => c.probe,
      (c) => c.scrollY,
      (c) => c.name ?? c.tag,
      (c) => c.position,
      (c) => c.top,
      (c) => c.transform,
      (c) => c.opacity,
      (c) => c.background,
      (c) => c.backdrop,
    ]),
    `\n## Cursor\n\n\`\`\`json\n${JSON.stringify(s.cursor, null, 2)}\n\`\`\`\n`,
    `\n## Mobile menu\n\n\`\`\`json\n${JSON.stringify(s.mobileMenu, null, 2)}\n\`\`\`\n`,
    `\n## Framer data scripts\n\n\`\`\`json\n${JSON.stringify(s.framerScripts ?? [], null, 2)}\n\`\`\`\n(Full contents in <page>/data.json → census.framerScripts.)\n`,
    table("CSS custom properties", ["Declaration", "Count"], s.cssVariables, [(c) => c.key, (c) => c.count]),
  ].join("\n");
}

// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { url: null, out: null, maxPages: 15, perTemplate: 2, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") out.out = argv[++i];
    else if (a === "--max-pages") out.maxPages = Number(argv[++i]);
    else if (a === "--per-template") out.perTemplate = Number(argv[++i]);
    else if (a === "--only") out.only = argv[++i].split(",");
    else if (!a.startsWith("--")) out.url = a;
  }
  if (!out.url) {
    console.error("Usage: node scripts/reference-teardown.mjs <url> [--out <dir>] [--max-pages 15] [--per-template 2] [--only desktop,tablet,mobile]");
    process.exit(1);
  }
  return out;
}

function normalise(href) {
  try {
    const u = new URL(href, start);
    if (u.origin !== start.origin) return null;
    if (/\.(png|jpe?g|gif|webp|svg|pdf|zip|mp4|webm)$/i.test(u.pathname)) return null;
    u.hash = "";
    u.search = "";
    return u.href.replace(/\/$/, "") || u.href;
  } catch {
    return null;
  }
}

function templateKey(href) {
  const parts = new URL(href).pathname.split("/").filter(Boolean);
  return parts.length >= 2 ? parts.slice(0, -1).join("/") + "/*" : `/${parts.join("/")}`;
}

function slugFor(href) {
  const path = new URL(href).pathname.split("/").filter(Boolean).join("--");
  return path || "home";
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const root = execSync("npm root -g", { encoding: "utf8" }).trim();
    return import(pathToFileURL(join(root, "playwright", "index.mjs")).href);
  }
}
