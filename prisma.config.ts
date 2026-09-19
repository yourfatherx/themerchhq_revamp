import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Next.js loads `.env.local` at runtime, but the Prisma CLI does not — so
 * `prisma migrate` would not see the connection string that `neon link` writes
 * there. Load it here, in Neon's precedence order, without overriding anything
 * already set in the real environment (which is what CI does).
 */
for (const file of [".env.local", ".env"]) {
  const full = path.join(process.cwd(), file);
  if (fs.existsSync(full)) process.loadEnvFile(full);
}

/**
 * Prisma 7 moved the connection string out of `schema.prisma`. This file is
 * read by the CLI (migrate, db push, studio); the runtime client is constructed
 * separately in `lib/db.ts` with a driver adapter.
 *
 * `DATABASE_URL` is never read in client code — NFR-5 keeps gateway
 * credentials, webhook secrets and database URLs in environment config only.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
