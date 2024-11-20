import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();
config({ path: `.env.local`, override: true });

export default defineConfig({
  out: "./drizzle",
  schema: "./schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
