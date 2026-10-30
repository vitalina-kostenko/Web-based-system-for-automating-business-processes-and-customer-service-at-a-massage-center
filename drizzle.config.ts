import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/shared/lib/db/db.schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: { url: process.env.DATABASE_URL ?? "file:local.db" },
});
