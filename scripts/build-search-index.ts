/**
 * Sinh public/search-index.<locale>.json từ content/<locale>/**.
 * Chạy: npm run build:search (tự chạy trước dev và build). File sinh ra là file
 * tĩnh, không commit; script chỉ đọc content/, không ghi vào đó.
 *
 * Mỗi mục là một đoạn thuộc một heading H2/H3 (hoặc phần mở đầu trước H2 đầu
 * tiên). Anchor sinh bằng github-slugger như rehype-slug, tính trên toàn bộ
 * heading của bài theo thứ tự nên id trùng cũng được đánh hậu tố giống trang.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { Nodes, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

type Locale = "vi" | "en";

type SearchEntry = {
  title: string;
  module: string;
  phase: number;
  /** Đường dẫn kèm locale, có `#anchor` khi trỏ tới một heading. */
  url: string;
  heading: string;
  text: string;
};

type Lesson = {
  module: string;
  slug: string;
  title: string;
  phase: number;
  tree: Root;
};

const LOCALES: readonly Locale[] = ["vi", "en"];
const INDEX_SLUG = "index";
const CONTENT_DIR = path.join(process.cwd(), "content");
const OUT_DIR = path.join(process.cwd(), "public");
/** Code block ngắn hơn ngưỡng này (dòng và ký tự) vẫn được đưa vào index. */
const MAX_CODE_LINES = 4;
const MAX_CODE_CHARS = 160;
/** Mục dài hơn thì tách theo ranh giới đoạn, cùng một anchor. */
const CHUNK_CHARS = 700;

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

function isShortCode(value: string): boolean {
  return (
    value.split("\n").length <= MAX_CODE_LINES && value.length <= MAX_CODE_CHARS
  );
}

/** Văn bản thuần của một khối; code block dài, ảnh, import/export MDX bị bỏ. */
function plainText(node: Nodes): string {
  switch (node.type) {
    case "code":
      return isShortCode(node.value) ? node.value : "";
    case "yaml":
    case "html":
    case "image":
    case "imageReference":
    case "mdxjsEsm":
    case "mdxFlowExpression":
    case "mdxTextExpression":
    case "thematicBreak":
    case "definition":
    case "footnoteDefinition":
      return "";
    case "break":
      return " ";
    case "inlineCode":
    case "text":
      return node.value;
    default:
      if (!("children" in node)) return toString(node);
      return node.children
        .map((child) => plainText(child as Nodes))
        .join(isInline(node) ? "" : " ");
  }
}

function isInline(node: Nodes): boolean {
  return (
    node.type === "paragraph" ||
    node.type === "heading" ||
    node.type === "emphasis" ||
    node.type === "strong" ||
    node.type === "delete" ||
    node.type === "link" ||
    node.type === "linkReference" ||
    node.type === "mdxJsxTextElement"
  );
}

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Gộp các đoạn liên tiếp thành chunk không vượt quá CHUNK_CHARS. */
function chunkParagraphs(paragraphs: string[]): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length + 1 > CHUNK_CHARS) {
      chunks.push(current);
      current = "";
    }
    current = current ? `${current} ${paragraph}` : paragraph;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function listMdx(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name)
    .sort();
}

async function readLessons(locale: Locale): Promise<Lesson[]> {
  const localeDir = path.join(CONTENT_DIR, locale);
  const modules = (await fs.readdir(localeDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  const lessons: Lesson[] = [];
  for (const moduleSlug of modules) {
    for (const file of await listMdx(path.join(localeDir, moduleSlug))) {
      const slug = file.slice(0, -".mdx".length);
      const raw = await fs.readFile(
        path.join(localeDir, moduleSlug, file),
        "utf8",
      );
      const { data, content } = matter(raw);
      lessons.push({
        module: moduleSlug,
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        phase: typeof data.phase === "number" ? data.phase : 0,
        tree: parser.parse(content),
      });
    }
  }
  return lessons;
}

function lessonEntries(
  locale: Locale,
  lesson: Lesson,
  moduleTitle: string,
): SearchEntry[] {
  const basePath =
    lesson.slug === INDEX_SLUG
      ? `/${locale}/${lesson.module}`
      : `/${locale}/${lesson.module}/${lesson.slug}`;
  const slugger = new GithubSlugger();
  const entries: SearchEntry[] = [];

  let anchor = "";
  let heading = lesson.title;
  let paragraphs: string[] = [];

  const flush = () => {
    // Mục chỉ có heading (nội dung là code dài) vẫn được tìm theo heading.
    const chunks = chunkParagraphs(paragraphs);
    if (chunks.length === 0 && anchor) chunks.push("");
    for (const text of chunks) {
      entries.push({
        title: lesson.title,
        module: moduleTitle,
        phase: lesson.phase,
        url: anchor ? `${basePath}#${anchor}` : basePath,
        heading,
        text,
      });
    }
    paragraphs = [];
  };

  for (const node of lesson.tree.children) {
    if (node.type === "heading") {
      const text = clean(toString(node));
      // rehype-slug đặt id cho mọi heading, kể cả H1/H4+, nên slugger phải thấy hết.
      const id = slugger.slug(text);
      if (node.depth === 2 || node.depth === 3) {
        flush();
        anchor = id;
        heading = text;
      } else if (text) {
        paragraphs.push(text);
      }
      continue;
    }
    const text = clean(plainText(node));
    if (text) paragraphs.push(text);
  }
  flush();
  return entries;
}

async function buildLocale(locale: Locale): Promise<SearchEntry[]> {
  const lessons = await readLessons(locale);
  const moduleTitles = new Map<string, string>();
  for (const lesson of lessons) {
    if (lesson.slug === INDEX_SLUG)
      moduleTitles.set(lesson.module, lesson.title);
  }
  return lessons.flatMap((lesson) =>
    lessonEntries(
      locale,
      lesson,
      moduleTitles.get(lesson.module) ?? lesson.module,
    ),
  );
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    const entries = await buildLocale(locale);
    const file = path.join(OUT_DIR, `search-index.${locale}.json`);
    // Client giả định mọi chuỗi đã NFC để vị trí khớp trên chuỗi không dấu dùng lại được.
    const json = JSON.stringify(entries).normalize("NFC");
    await fs.writeFile(file, json);
    console.log(
      `search-index.${locale}.json: ${entries.length} entries, ${(Buffer.byteLength(json) / 1024).toFixed(1)} KiB`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
