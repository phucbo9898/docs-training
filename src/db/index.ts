import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof createDb>;

function createDb(url: string) {
  // Driver HTTP: mỗi truy vấn là một request, không giữ kết nối (hợp serverless).
  return drizzle({ client: neon(url), schema });
}

let instance: Db | undefined;

/** Tạo khi dùng lần đầu, để build không cần `DATABASE_URL`. */
export function getDb(): Db {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("db: thiếu biến môi trường DATABASE_URL");
    instance = createDb(url);
  }
  return instance;
}
