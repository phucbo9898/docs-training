import { access } from "node:fs/promises";
import path from "node:path";
import { routing } from "@/i18n/routing";
import { RESERVED_SLUGS } from "./tracks";

const CONTENT_DIR = path.join(process.cwd(), "content");
const INDEX_SLUG = "index";

/** Chỉ nhận segment dạng slug: không cho `..`, `/` hay ký tự lạ đi vào đường dẫn file. */
const SLUG = /^[a-z0-9][a-z0-9-]*$/;

/** Segment đầu tiên là route tĩnh, không phải module nội dung. */
const STATIC_SEGMENTS: readonly string[] = [...RESERVED_SLUGS, "login"];

const CONTENT_PATH = new RegExp(
  `^/(?:${routing.locales.join("|")})/([^/]+)(?:/([^/]+))?/?$`,
);

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/**
 * `true` khi `pathname` có dạng `/<locale>/<module>[/<bài>]` nhưng không có
 * file tương ứng. Cấu trúc lấy từ locale mặc định, giống `src/lib/content.ts`
 * (locale khác thiếu bản dịch vẫn hiển thị bằng bản mặc định).
 */
export async function isMissingContentPage(pathname: string): Promise<boolean> {
  const match = CONTENT_PATH.exec(pathname);
  if (!match) return false;

  const [, module, lesson] = match;
  if (STATIC_SEGMENTS.includes(module)) return false;
  if (!SLUG.test(module)) return true;
  if (lesson !== undefined && (!SLUG.test(lesson) || lesson === INDEX_SLUG)) {
    return true;
  }

  const file = path.join(
    CONTENT_DIR,
    routing.defaultLocale,
    module,
    `${lesson ?? INDEX_SLUG}.mdx`,
  );
  return !(await exists(file));
}
