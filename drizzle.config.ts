import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Đọc `.env.local` giống Next (drizzle-kit không tự đọc).
loadEnvConfig(process.cwd());

// `generate` không cần kết nối; `migrate` sẽ báo lỗi nếu thiếu.
const url = process.env.DATABASE_URL ?? "";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
});
