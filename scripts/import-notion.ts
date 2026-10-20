/**
 * Chuyển export Notion (notion-export/) sang content/vi/<module>/<slug>.mdx.
 * Chạy: npm run import:notion. Script idempotent: mỗi lần chạy xóa và sinh lại
 * content/vi/<module> và public/content-images/<module> của 6 module.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Heading, Image, Link, Root, Text } from "mdast";
import { toString } from "mdast-util-to-string";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit, SKIP } from "unist-util-visit";

type PageType = "overview" | "lesson" | "exercise";

interface ModuleConfig {
  /** Tên trang/thư mục module trong export, đã bỏ ID Notion. */
  stem: string;
  slug: string;
  phase: 1 | 2 | 3 | 4;
}

interface Page {
  sourceRel: string;
  sourceDir: string;
  module: ModuleConfig;
  type: PageType;
  title: string;
  slug: string;
  order: number;
  tree: Root;
}

interface SlugMapEntry {
  module: string;
  slug: string;
  url: string;
  type: PageType;
  title: string;
}

interface Report {
  created: string[];
  unmappedLinks: { page: string; text: string; target: string }[];
  notionLinks: { page: string; target: string }[];
  warnings: string[];
  images: string[];
}

const PROJECT_ROOT = process.cwd();
const EXPORT_DIR = path.join(PROJECT_ROOT, "notion-export");
const CONTENT_DIR = path.join(PROJECT_ROOT, "content", "vi");
const IMAGES_DIR = path.join(PROJECT_ROOT, "public", "content-images");
const SLUG_MAP_FILE = path.join(PROJECT_ROOT, "scripts", "slug-map.json");
const ROOT_PAGE_STEM = "👨‍💻 Intern Backend Training";

const MODULES: ModuleConfig[] = [
  { stem: "PHP TRAINING - BASIC", slug: "php-basic", phase: 1 },
  {
    stem: "PHP TRAINING - Method, Session Cookie & OOP cơ bản",
    slug: "php-method-session-oop",
    phase: 1,
  },
  { stem: "FRONTEND TRAINING – OVERVIEW", slug: "frontend-overview", phase: 1 },
  {
    stem: "SQL & DATABASE - OVERVIEW",
    slug: "sql-database-overview",
    phase: 2,
  },
  { stem: "LARAVEL FRAMEWORK - OVERVIEW", slug: "laravel-overview", phase: 3 },
  {
    stem: "🛒 PROJECT SPECIFICATION E-COMMERCE TRAINING SYSTEM",
    slug: "project-ecommerce",
    phase: 4,
  },
];

/** Alt viết tay cho ảnh, khóa theo `<module>/<tên file ảnh>`. */
const IMAGE_ALT: Record<string, string> = {
  "php-method-session-oop/image.png":
    "Minh họa lớp và đối tượng: bên trái là lớp Car vẽ bằng nét đứt như một bản thiết kế, bên phải là ba đối tượng cụ thể tạo từ lớp đó gồm Audi, Nissan và Volvo",
  "laravel-overview/b4bce647-722e-4064-ac19-b7e9e0d0573e.png":
    "Sơ đồ vòng đời request trong Laravel: Client gửi request đến public/index.php rồi App/Http/Kernel.php, qua Service providers (register và bootstrap), tới Router, Middleware, Controller/Action, sau đó View và trả response về Client",
};

/** Summary viết tay, khóa theo `<module>/<slug>`. Thiếu khóa thì lấy tự động và cảnh báo. */
const SUMMARIES: Record<string, string> = {
  "php-basic/index":
    "Khóa PHP cơ bản cho thực tập sinh: cú pháp, biến, kiểu dữ liệu, điều kiện, vòng lặp và function, kèm bài tập thực hành.",
  "php-basic/lesson-01-php-overview":
    "PHP là gì, chạy ở đâu (server-side), cách cài môi trường và chạy ví dụ Hello World đầu tiên.",
  "php-basic/lesson-02-syntax-variable-constant":
    "Cú pháp cơ bản và quy ước viết code, cách khai báo và đặt tên biến, hằng số và khi nào nên dùng.",
  "php-basic/lesson-03-data-types-string-array":
    "Các kiểu dữ liệu phổ biến trong PHP, thao tác cơ bản với string và cách khai báo, sử dụng array.",
  "php-basic/lesson-04-condition":
    "Viết điều kiện với if/else/elseif và switch, làm quen toán tử rút gọn như ternary và null coalescing.",
  "php-basic/lesson-05-loop":
    "Khi nào dùng for, foreach, while, do...while và cách duyệt mảng để in dữ liệu.",
  "php-basic/lesson-06-function":
    "Function là gì, cách viết function có tham số và giá trị trả về, cùng một số built-in function hay dùng.",
  "php-basic/exercise-tong-hop":
    "Bài tập tổng hợp: số nguyên tố, năm nhuận, sort mảng, xử lý chuỗi, while và do-while.",
  "php-basic/exercise-crud":
    "Bài tập CRUD bằng PHP thuần với MySQL: tạo, đọc, sửa, xóa dữ liệu bảng students.",
  "php-method-session-oop/index":
    "Method trong class, superglobals, Session và Cookie, cùng 4 tính chất cốt lõi của OOP làm nền tảng cho Laravel.",
  "frontend-overview/index":
    "Tổng quan frontend cho backend developer: HTML, CSS với Bootstrap, JavaScript với jQuery và Ajax gọi API.",
  "frontend-overview/lesson-01-html-basic":
    "HTML là gì, cấu trúc trang chuẩn, các thẻ phổ biến (text, link, image, list, table, form) và semantic HTML cơ bản.",
  "frontend-overview/lesson-02-css-bootstrap":
    "CSS dùng để làm gì, selector, box model, layout cơ bản, cách tổ chức file CSS và dựng UI nhanh với Bootstrap.",
  "frontend-overview/lesson-03-javascript-jquery":
    "JavaScript cơ bản để tạo tương tác, thao tác DOM và event, kèm jQuery cơ bản (selector, event, DOM).",
  "frontend-overview/lesson-04-ajax":
    "Ajax là gì và dùng khi nào, gọi API GET/POST bằng jQuery không reload trang và render dữ liệu lên UI.",
  "sql-database-overview/index":
    "Database, DBMS và SQL từ cơ bản đến nâng cao: CRUD, lọc, hàm, GROUP BY, JOIN và Subquery.",
  "sql-database-overview/lesson-01-database-sql-basic":
    "Database, DBMS và phân loại lệnh SQL, tạo database/table, CRUD với SELECT/INSERT/UPDATE/DELETE và các constraint cơ bản.",
  "sql-database-overview/lesson-02-advanced-query":
    "SELECT có lọc và sắp xếp, các toán tử IN/BETWEEN/LIKE, DISTINCT, LIMIT/OFFSET, hàm tổng hợp và GROUP BY.",
  "sql-database-overview/lesson-03-join-subquery":
    "Bản chất JOIN và cách chọn đúng loại, JOIN 2–3 bảng, UNION và Subquery với IN/EXISTS.",
  "sql-database-overview/exercise-lesson-01-database-sql-basic":
    "Bài tập SQL cơ bản: tạo database và table, insert, select có điều kiện, update, delete.",
  "sql-database-overview/exercise-lesson-02-advanced-query":
    "Bài tập truy vấn nâng cao: WHERE, ORDER BY, LIMIT, LIKE/IN/BETWEEN, GROUP BY và HAVING.",
  "sql-database-overview/exercise-lesson-03-join-subquery":
    "Bài tập JOIN và Subquery trên bảng users và orders: INNER JOIN, LEFT JOIN và Subquery.",
  "laravel-overview/index":
    "Laravel theo mô hình MVC: cấu trúc project, Routing, Middleware, Model, Migration, Seeder, Eloquent, DI, Cache và API.",
  "laravel-overview/lesson-01-laravel-overview":
    "Laravel là gì, dùng để làm gì, mô hình MVC, vòng đời request và lợi ích so với PHP thuần.",
  "laravel-overview/lesson-02-installation-project-structure":
    "Cài đặt và chạy Laravel project local, cấu trúc thư mục và vai trò của từng folder.",
  "laravel-overview/lesson-03-laravel-basic":
    "Các thành phần chính của Laravel: Controller, Middleware, Model, Request và Custom Request, tách logic bằng Service.",
  "laravel-overview/lesson-04-routing-middleware":
    "Routing, HTTP method, Route Parameters, group/prefix/name route và Middleware.",
  "laravel-overview/lesson-05-migration-seeder":
    "Migration là gì và vì sao cần, tạo và quản lý database bằng migration, rollback, Seeder và dữ liệu mẫu.",
  "laravel-overview/lesson-06-dependency-injection":
    "Dependency Injection: bản chất, các kiểu inject phổ biến, Constructor Promotion và tư duy loosely coupled.",
  "laravel-overview/lesson-07-caching-session":
    "Caching là gì và khi nào cần dùng, dùng Cache trong Laravel, Session và cách lưu, đọc dữ liệu Session.",
  "laravel-overview/lesson-08-event-notification-task-scheduling":
    "Event/Listener, Notification đa kênh, Task Scheduling và dùng Queue để xử lý tác vụ nặng.",
  "laravel-overview/lesson-09-interact-with-ui-api":
    "Truyền dữ liệu từ Controller sang Blade, xây API RESTful, gọi API bằng Ajax và phân biệt Web Route với API Route.",
  "project-ecommerce/index":
    "Đặc tả dự án E-commerce: CMS quản trị, API backend và trang bán hàng, kèm quy tắc chung và danh sách chức năng.",
};

const ID_SUFFIX = /\s+[0-9a-f]{32}(?=\.md$|$)/;

function stripId(name: string): string {
  return name.replace(ID_SUFFIX, "");
}

/** Bỏ emoji và ký tự dạng ký hiệu để dùng trong slug. */
function stripEmoji(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}‍️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return stripEmoji(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Notion cắt cụt tên file ở ~50 ký tự nên đích link có thể chứa "(" không có ")" tương ứng,
 * khiến parser Markdown không nhận ra link. Đích link của Notion không chứa khoảng trắng
 * (đã mã hóa %20) và luôn kết thúc bằng phần mở rộng file, nên mã hóa ngoặc trong đó thành
 * %28/%29 trước khi parse. Bỏ qua code block.
 */
function encodeLinkParens(source: string): string {
  const destination = /\]\(([^\s]+?\.(?:md|png|jpe?g|gif|webp|svg))\)/g;
  let inFence = false;
  return source
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(
        destination,
        (_, dest: string) =>
          `](${dest.replace(/\(/g, "%28").replace(/\)/g, "%29")})`,
      );
    })
    .join("\n");
}

function parseMarkdown(source: string): Root {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(encodeLinkParens(source));
}

const serializer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  // remark-mdx đăng ký extension toMarkdown để thoát `{`, `<` trong text.
  .use(remarkMdx)
  .use(remarkStringify, {
    bullet: "-",
    emphasis: "*",
    strong: "*",
    fences: true,
    listItemIndent: "one",
    rule: "-",
    // MDX không cho autolink dạng <https://...>.
    resourceLink: true,
  });

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function toPosix(p: string): string {
  return p.split(path.sep).join("/");
}

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function getH1(tree: Root, rel: string): Heading {
  const h1 = tree.children.find(
    (node): node is Heading => node.type === "heading" && node.depth === 1,
  );
  if (!h1) throw new Error(`Không tìm thấy H1 trong ${rel}`);
  return h1;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function frontMatter(page: Page, summary: string): string {
  return [
    "---",
    `title: ${yamlString(page.title)}`,
    `slug: ${yamlString(page.slug)}`,
    `module: ${yamlString(page.module.slug)}`,
    `phase: ${page.module.phase}`,
    `order: ${page.order}`,
    `type: ${page.type}`,
    `summary: ${yamlString(summary)}`,
    "---",
    "",
  ].join("\n");
}

/** Dự phòng khi thiếu summary viết tay: đoạn văn hoặc mục danh sách đầu tiên. */
function autoSummary(tree: Root): string {
  for (const node of tree.children) {
    if (node.type === "paragraph") return truncate(toString(node));
    if (node.type === "list" && node.children[0]) {
      return truncate(toString(node.children[0]));
    }
  }
  return "";
}

function truncate(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
}

function buildPages(
  files: { rel: string; tree: Root }[],
  report: Report,
): Page[] {
  const moduleByStem = new Map(MODULES.map((m) => [m.stem, m]));
  const pages: Omit<Page, "order">[] = [];

  for (const { rel, tree } of files) {
    const parts = rel.split("/");
    const fileStem = stripId(parts[parts.length - 1]).replace(/\.md$/, "");
    if (parts.length === 1 && fileStem === ROOT_PAGE_STEM) {
      report.warnings.push(
        `Bỏ qua trang gốc "${ROOT_PAGE_STEM}" (không thuộc 6 module; nội dung trang chủ sẽ đi qua messages/*.json).`,
      );
      continue;
    }
    if (parts[0] !== ROOT_PAGE_STEM) {
      throw new Error(`Đường dẫn ngoài dự kiến: ${rel}`);
    }

    const title = toString(getH1(tree, rel)).trim();
    const sourceDir = parts.slice(0, -1).join("/");

    if (parts.length === 2) {
      const mod = moduleByStem.get(fileStem);
      if (!mod) throw new Error(`Trang không thuộc module nào: ${rel}`);
      pages.push({
        sourceRel: rel,
        sourceDir,
        module: mod,
        type: "overview",
        title,
        slug: "index",
        tree,
      });
      continue;
    }

    const mod = moduleByStem.get(stripId(parts[1]));
    if (!mod) throw new Error(`Thư mục không thuộc module nào: ${rel}`);

    const lesson = /LESSON\s+(\d+)/i.exec(title);
    if (lesson) {
      const number = lesson[1].padStart(2, "0");
      const name = title
        .replace(/^.*?LESSON\s+\d+\s*[–—-]\s*/i, "")
        .replace(/\([^)]*\)?/g, "");
      pages.push({
        sourceRel: rel,
        sourceDir,
        module: mod,
        type: "lesson",
        title,
        slug: `lesson-${number}-${slugify(name)}`,
        tree,
      });
    } else if (
      /^(🧪\s*)?Bài tập/i.test(stripEmoji(title)) ||
      title.includes("🧪")
    ) {
      pages.push({
        sourceRel: rel,
        sourceDir,
        module: mod,
        type: "exercise",
        title,
        slug: "",
        tree,
      });
    } else {
      throw new Error(`Không phân loại được trang: ${rel} (H1: ${title})`);
    }
  }

  // Gán slug cho bài tập: theo bài học cha (thư mục trùng tên bài học), hoặc theo tiêu đề.
  const lessonByDir = new Map<string, Omit<Page, "order">>();
  for (const p of pages) {
    if (p.type === "lesson") {
      lessonByDir.set(stripId(p.sourceRel).replace(/\.md$/, ""), p);
    }
  }
  const parentOf = new Map<
    Omit<Page, "order">,
    Omit<Page, "order"> | undefined
  >();
  for (const p of pages) {
    if (p.type !== "exercise") continue;
    const parent = lessonByDir.get(stripId(p.sourceDir));
    parentOf.set(p, parent);
    if (parent) {
      p.slug = `exercise-${parent.slug}`;
    } else {
      const name = stripEmoji(p.title).replace(/^Bài tập\s*[–—-]?\s*/i, "");
      p.slug = `exercise-${slugify(name)}`;
      report.warnings.push(
        `Bài tập "${p.title}" không nằm dưới bài học nào, đặt slug theo tiêu đề: ${p.module.slug}/${p.slug}`,
      );
    }
  }

  // Kiểm tra trùng slug trong cùng module.
  const seen = new Map<string, string>();
  for (const p of pages) {
    const key = `${p.module.slug}/${p.slug}`;
    const prev = seen.get(key);
    if (prev) throw new Error(`Trùng slug ${key}: ${prev} và ${p.sourceRel}`);
    seen.set(key, p.sourceRel);
  }

  // Thứ tự: index = 0; bài học theo số, bài tập đi liền sau bài học cha, bài tập mồ côi xếp cuối
  // theo thứ tự link trong trang index.
  const result: Page[] = [];
  for (const mod of MODULES) {
    const inModule = pages.filter((p) => p.module === mod);
    const index = inModule.find((p) => p.type === "overview");
    if (!index) throw new Error(`Module ${mod.slug} thiếu trang chính`);
    const linkOrder: string[] = [];
    visit(index.tree, "link", (node: Link) => {
      linkOrder.push(safeDecode(node.url.split("#")[0]) ?? node.url);
    });
    const indexOf = (p: Omit<Page, "order">): number => {
      const i = linkOrder.findIndex((url) =>
        stripId(url).endsWith(stripId(path.posix.basename(p.sourceRel))),
      );
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };

    const lessons = inModule
      .filter((p) => p.type === "lesson")
      .sort((a, b) => a.slug.localeCompare(b.slug));
    const sequence: Omit<Page, "order">[] = [index];
    for (const lesson of lessons) {
      sequence.push(lesson);
      sequence.push(
        ...inModule
          .filter((p) => p.type === "exercise" && parentOf.get(p) === lesson)
          .sort((a, b) => a.slug.localeCompare(b.slug)),
      );
    }
    sequence.push(
      ...inModule
        .filter((p) => p.type === "exercise" && !parentOf.get(p))
        .sort(
          (a, b) => indexOf(a) - indexOf(b) || a.slug.localeCompare(b.slug),
        ),
    );
    sequence.forEach((p, order) => result.push({ ...p, order }));
  }
  return result;
}

interface Resolver {
  slugMap: Map<string, SlugMapEntry>;
  report: Report;
  imageCopies: Map<string, string>;
}

function transformPage(page: Page, resolver: Resolver): void {
  const { slugMap, report, imageCopies } = resolver;
  const tree = page.tree;

  // H1 đã chuyển vào front matter.
  const h1Index = tree.children.findIndex(
    (n) => n.type === "heading" && n.depth === 1,
  );
  tree.children.splice(h1Index, 1);

  const sourceDirAbs = path.posix.join(...toPosix(page.sourceDir).split("/"));

  visit(tree, (node, index, parent) => {
    if (node.type === "link") {
      const target = node.url;
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
        if (/notion\.(so|site)/i.test(target)) {
          report.notionLinks.push({ page: page.sourceRel, target });
        }
        return;
      }
      if (target.startsWith("#")) return;
      const decoded = safeDecode(target.replace(/[#?].*$/, ""));
      const hash = /#.*$/.exec(target)?.[0] ?? "";
      const resolved =
        decoded === null
          ? null
          : stripId(
              path.posix.normalize(path.posix.join(sourceDirAbs, decoded)),
            );
      const entry = resolved ? slugMap.get(resolved) : undefined;
      if (entry) {
        node.url = entry.url + hash;
      } else {
        report.unmappedLinks.push({
          page: page.sourceRel,
          text: toString(node),
          target,
        });
        if (parent && index !== undefined) {
          // Gỡ link chết, giữ lại phần chữ.
          parent.children.splice(index, 1, ...node.children);
          return [SKIP, index];
        }
      }
      return;
    }

    if (node.type === "image") {
      const decoded = safeDecode(node.url);
      if (decoded === null)
        throw new Error(
          `URL ảnh không giải mã được trong ${page.sourceRel}: ${node.url}`,
        );
      const abs = path.join(
        EXPORT_DIR,
        path.posix.normalize(path.posix.join(sourceDirAbs, decoded)),
      );
      const fileName = path.basename(abs);
      const alt = IMAGE_ALT[`${page.module.slug}/${fileName}`];
      if (!alt) {
        throw new Error(
          `Thiếu alt viết tay cho ảnh ${page.module.slug}/${fileName} (trong ${page.sourceRel}). Thêm vào IMAGE_ALT.`,
        );
      }
      const dest = path.join(IMAGES_DIR, page.module.slug, fileName);
      const prev = imageCopies.get(dest);
      if (prev && prev !== abs) throw new Error(`Trùng tên ảnh đích: ${dest}`);
      imageCopies.set(dest, abs);
      (node as Image).url =
        `/content-images/${page.module.slug}/${encodeURIComponent(fileName)}`;
      (node as Image).alt = alt;
      return;
    }

    if (node.type === "code") {
      if (!node.lang) node.lang = "text";
      return;
    }

    // Cú pháp link còn sót trong text nghĩa là parser không nhận ra link.
    if (node.type === "text" && /\]\(/.test(node.value)) {
      report.warnings.push(
        `${page.sourceRel}: có thể còn link không parse được: ${truncate(node.value, 80)}`,
      );
      return;
    }

    // HTML thô ngoài code block sẽ làm hỏng MDX: chuyển thành text để được thoát ký tự.
    if (node.type === "html" && parent && index !== undefined) {
      report.warnings.push(
        `${page.sourceRel}: HTML thô ngoài code block được thoát thành text: ${truncate(node.value, 60)}`,
      );
      const text: Text = { type: "text", value: node.value };
      parent.children.splice(index, 1, text);
      return [SKIP, index + 1];
    }
    return;
  });
}

async function main(): Promise<void> {
  const report: Report = {
    created: [],
    unmappedLinks: [],
    notionLinks: [],
    warnings: [],
    images: [],
  };

  const allFiles = await walk(EXPORT_DIR);
  const mdFiles = allFiles.filter((f) => f.endsWith(".md"));
  const imageFiles = allFiles.filter((f) =>
    /\.(png|jpe?g|gif|webp|svg)$/i.test(f),
  );
  for (const f of allFiles) {
    if (!mdFiles.includes(f) && !imageFiles.includes(f)) {
      report.warnings.push(
        `Bỏ qua file không nhận diện: ${toPosix(path.relative(EXPORT_DIR, f))}`,
      );
    }
  }

  const parsed = await Promise.all(
    mdFiles.map(async (file) => ({
      rel: toPosix(path.relative(EXPORT_DIR, file)),
      tree: parseMarkdown(await fs.readFile(file, "utf8")),
    })),
  );
  const pages = buildPages(parsed, report);

  // Bảng ánh xạ: đường dẫn đã giải mã, bỏ ID Notion -> slug.
  const slugMap = new Map<string, SlugMapEntry>();
  for (const page of pages) {
    const key = stripId(page.sourceRel);
    if (slugMap.has(key))
      throw new Error(`Trùng khóa ánh xạ sau khi bỏ ID: ${key}`);
    slugMap.set(key, {
      module: page.module.slug,
      slug: page.slug,
      url:
        page.slug === "index"
          ? `/vi/${page.module.slug}`
          : `/vi/${page.module.slug}/${page.slug}`,
      type: page.type,
      title: page.title,
    });
  }

  const resolver: Resolver = { slugMap, report, imageCopies: new Map() };
  for (const page of pages) transformPage(page, resolver);

  // Làm sạch thư mục đích của 6 module rồi sinh lại.
  for (const mod of MODULES) {
    await fs.rm(path.join(CONTENT_DIR, mod.slug), {
      recursive: true,
      force: true,
    });
    await fs.rm(path.join(IMAGES_DIR, mod.slug), {
      recursive: true,
      force: true,
    });
  }

  // Nạp động: chuỗi phụ thuộc ESM-only của @mdx-js/mdx không require() được từ file CJS.
  const { compile } = await import("@mdx-js/mdx");
  const compileErrors: string[] = [];
  for (const page of pages) {
    const key = `${page.module.slug}/${page.slug}`;
    let summary = SUMMARIES[key];
    if (!summary) {
      summary = autoSummary(page.tree);
      report.warnings.push(
        `Thiếu summary viết tay cho ${key}, dùng tự động: "${summary}"`,
      );
    }
    const body = String(await serializer.stringify(page.tree)).trimEnd();
    const output = `${frontMatter(page, summary)}\n${body}\n`;

    try {
      await compile(body, { remarkPlugins: [remarkGfm] });
    } catch (error) {
      compileErrors.push(
        `${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const dest = path.join(CONTENT_DIR, page.module.slug, `${page.slug}.mdx`);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, output, "utf8");
    report.created.push(toPosix(path.relative(PROJECT_ROOT, dest)));
  }

  for (const [dest, src] of [...resolver.imageCopies].sort()) {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
    report.images.push(toPosix(path.relative(PROJECT_ROOT, dest)));
  }
  const referenced = new Set([...resolver.imageCopies.values()]);
  for (const img of imageFiles) {
    if (!referenced.has(img)) {
      report.warnings.push(
        `Ảnh không được trang nào tham chiếu: ${toPosix(path.relative(EXPORT_DIR, img))}`,
      );
    }
  }

  const sortedMap = Object.fromEntries(
    [...slugMap].sort(([a], [b]) => a.localeCompare(b)),
  );
  await fs.writeFile(
    SLUG_MAP_FILE,
    `${JSON.stringify(sortedMap, null, 2)}\n`,
    "utf8",
  );

  printReport(report, pages, compileErrors);
  if (compileErrors.length > 0) process.exitCode = 1;
}

function printReport(
  report: Report,
  pages: Page[],
  compileErrors: string[],
): void {
  const out: string[] = [];
  out.push("=== Báo cáo import Notion ===");
  out.push(`File .mdx đã tạo: ${report.created.length}`);
  out.push(`Ảnh đã copy: ${report.images.length}`);
  for (const img of report.images) out.push(`  - ${img}`);
  out.push("Slug:");
  for (const p of pages)
    out.push(
      `  - ${p.module.slug}/${p.slug}  [${p.type}, phase ${p.module.phase}, order ${p.order}]`,
    );
  out.push(`Link nội bộ không map được: ${report.unmappedLinks.length}`);
  for (const l of report.unmappedLinks)
    out.push(`  - ${l.page}: "${l.text}" -> ${l.target}`);
  out.push(`Link trỏ tới Notion: ${report.notionLinks.length}`);
  for (const l of report.notionLinks) out.push(`  - ${l.page}: ${l.target}`);
  out.push(`Lỗi biên dịch MDX: ${compileErrors.length}`);
  for (const e of compileErrors) out.push(`  - ${e}`);
  out.push(`Cảnh báo: ${report.warnings.length}`);
  for (const w of report.warnings) out.push(`  - ${w}`);
  out.push(
    `Bảng ánh xạ: ${toPosix(path.relative(PROJECT_ROOT, SLUG_MAP_FILE))}`,
  );
  console.log(out.join("\n"));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
