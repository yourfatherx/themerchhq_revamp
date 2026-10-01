import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawn } from "node:child_process";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
export async function viaCodex(prompt, attempt = 1) {
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
