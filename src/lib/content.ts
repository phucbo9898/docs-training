import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";

export type LessonType = "overview" | "lesson" | "exercise";

export type LessonMeta = {
  module: string;
  /** Slug trong thư mục module; `index` là trang tổng quan của module. */
  slug: string;
  title: string;
  phase: number;
  order: number;
  type: LessonType;
  summary: string;
  /** Đường dẫn không kèm locale: `/<module>` hoặc `/<module>/<slug>`. */
  href: string;
  /** Chưa có bản dịch ở locale đang xem, đang dùng bản của locale mặc định. */
  fallback: boolean;
};

export type Lesson = LessonMeta & { body: string };

type Entry = { meta: LessonMeta; body: string };

const CONTENT_DIR = path.join(process.cwd(), "content");
const INDEX_SLUG = "index";

/**
 * Thứ tự module trong cùng một phase (front matter chỉ có `phase`, `order` là
 * thứ tự bài trong module). Module mới chưa khai báo ở đây xếp cuối phase.
 */
const MODULE_ORDER = [
  "php-basic",
  "php-method-session-oop",
  "frontend-overview",
  "sql-database-overview",
  "laravel-overview",
  "project-ecommerce",
];

const LESSON_TYPES: readonly LessonType[] = ["overview", "lesson", "exercise"];

function isLessonType(value: unknown): value is LessonType {
  return LESSON_TYPES.some((type) => type === value);
}

export function isIndexSlug(slug: string): boolean {
  return slug === INDEX_SLUG;
}

async function readEntry(
  locale: Locale,
  module: string,
  slug: string,
  fallback: boolean,
): Promise<Entry | null> {
  const file = path.join(CONTENT_DIR, locale, module, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const type = isLessonType(data.type) ? data.type : "lesson";
  const isIndex = slug === INDEX_SLUG;

  return {
    meta: {
      module,
      slug,
      title: typeof data.title === "string" ? data.title : slug,
      phase: typeof data.phase === "number" ? data.phase : 0,
      order: typeof data.order === "number" ? data.order : 0,
      type,
      summary: typeof data.summary === "string" ? data.summary : "",
      href: isIndex ? `/${module}` : `/${module}/${slug}`,
      fallback,
    },
    body: content,
  };
}

async function listDir(dir: string): Promise<string[]> {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

function moduleRank(module: string): number {
  const index = MODULE_ORDER.indexOf(module);
  return index === -1 ? MODULE_ORDER.length : index;
}

/**
 * Cấu trúc (module, bài) lấy từ locale mặc định; mỗi bài ưu tiên bản của
 * locale đang xem, thiếu thì dùng bản mặc định và đánh dấu `fallback`.
 */
async function loadLessons(locale: Locale): Promise<Entry[]> {
  // Đọc file ngoài request: cần cache để route vẫn prerender được (Cache Components).
  "use cache";

  const base = routing.defaultLocale;
  const modules = (await listDir(path.join(CONTENT_DIR, base))).filter(
    (name) => !name.startsWith("."),
  );

  const perModule = await Promise.all(
    modules.map(async (module) => {
      const files = await listDir(path.join(CONTENT_DIR, base, module));
      const slugs = files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.slice(0, -".mdx".length));

      const entries = await Promise.all(
        slugs.map(async (slug) => {
          if (locale !== base) {
            const translated = await readEntry(locale, module, slug, false);
            if (translated) return translated;
          }
          return readEntry(base, module, slug, locale !== base);
        }),
      );
      return entries.filter((entry): entry is Entry => entry !== null);
    }),
  );

  return perModule
    .flat()
    .sort(
      ({ meta: a }, { meta: b }) =>
        a.phase - b.phase ||
        moduleRank(a.module) - moduleRank(b.module) ||
        a.module.localeCompare(b.module) ||
        a.order - b.order ||
        a.slug.localeCompare(b.slug),
    );
}

export async function getAllLessons(locale: Locale): Promise<LessonMeta[]> {
  const entries = await loadLessons(locale);
  return entries.map(({ meta }) => meta);
}

/** Tra theo danh sách đã quét, nên tham số URL không bao giờ đi thẳng vào đường dẫn file. */
export async function getLesson(
  locale: Locale,
  module: string,
  slug: string,
): Promise<Lesson | null> {
  const entries = await loadLessons(locale);
  const entry = entries.find(
    ({ meta }) => meta.module === module && meta.slug === slug,
  );
  return entry ? { ...entry.meta, body: entry.body } : null;
}
