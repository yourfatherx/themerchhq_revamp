import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Load the connection string the same way `prisma.config.ts` does, so the
 * NFR-2 isolation gate runs locally against the linked Neon branch. Real
 * environment variables win, which is what CI relies on.
 */
for (const file of [".env.local", ".env"]) {
  const full = path.join(process.cwd(), file);
  if (fs.existsSync(full)) process.loadEnvFile(full);
}

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      /**
       * `lib/db.ts` imports `server-only`, whose default entry throws on
       * purpose. Next.js resolves its `react-server` condition to a no-op;
       * these tests exercise server code, so they resolve to the same no-op.
       * The guard still holds where it matters — importing `lib/db.ts` from a
       * client component is a Next build error, which this does not weaken.
       */
      "server-only": path.join(
        process.cwd(),
        "node_modules/server-only/empty.js",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // The isolation gate talks to a real database over the network.
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
    },
  },
});
