import type { ReactElement } from "react";
import { compile, run } from "@mdx-js/mdx";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";

export type Heading = { id: string; text: string; depth: 2 | 3 };

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { id?: unknown; dataLabel?: string };
  children?: HastNode[];
};

const prettyCodeOptions: Options = {
  theme: {
    light: "github-light-high-contrast",
    dark: "github-dark-high-contrast",
  },
  // Nền và màu chữ do globals.css quyết định theo theme của trang.
  keepBackground: false,
  defaultLang: { block: "plaintext" },
};

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/** Gom h2/h3 sau rehype-slug để dựng TOC với đúng id của heading. */
function collectHeadings(headings: Heading[]) {
  return () => (tree: HastNode) => {
    const walk = (node: HastNode) => {
      const depth =
        node.tagName === "h2" ? 2 : node.tagName === "h3" ? 3 : null;
      const id = node.properties?.id;
      if (depth && typeof id === "string") {
        headings.push({ id, text: textOf(node).trim(), depth });
        return;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

function childElements(node: HastNode, tagName: string): HastNode[] {
  return (node.children ?? []).filter((child) => child.tagName === tagName);
}

/**
 * Gắn `data-label` (tiêu đề cột) vào từng ô `td` để trên mobile CSS hiển thị
 * bảng dạng thẻ xếp dọc mà vẫn biết ô thuộc cột nào, không cần cuộn ngang.
 */
function rehypeTableLabels() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.tagName !== "table") {
        node.children?.forEach(walk);
        return;
      }
      const headerRow = childElements(node, "thead")
        .flatMap((thead) => childElements(thead, "tr"))
        .at(0);
      if (!headerRow) return;
      const labels = childElements(headerRow, "th").map((th) =>
        textOf(th).trim(),
      );
      childElements(node, "tbody")
        .flatMap((tbody) => childElements(tbody, "tr"))
        .forEach((row) => {
          childElements(row, "td").forEach((cell, index) => {
            const label = labels[index];
            if (label) cell.properties = { ...cell.properties, dataLabel: label };
          });
        });
    };
    walk(tree);
  };
}

/**
 * Biên dịch MDX + tô màu code. Shiki nạp grammar bất đồng bộ nên việc này phải
 * nằm trong `"use cache"` thì route mới prerender được; vì vậy chỉ trả về dữ
 * liệu thuần (code đã biên dịch, headings), còn việc dựng React element làm ở
 * `renderMdx` để các component MDX dùng được next-intl theo request.
 */
async function compileLesson(
  source: string,
): Promise<{ code: string; headings: Heading[] }> {
  "use cache";

  const headings: Heading[] = [];
  const file = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      collectHeadings(headings),
      rehypeTableLabels,
      [rehypePrettyCode, prettyCodeOptions],
    ],
  });
  return { code: String(file), headings };
}

export async function renderMdx(
  source: string,
  components: MDXComponents,
): Promise<{ content: ReactElement; headings: Heading[] }> {
  const { code, headings } = await compileLesson(source);
  // Code do chính compileLesson sinh ra từ file trong `content/`, không phải input người dùng.
  const { default: Content } = await run(code, { Fragment, jsx, jsxs });
  return { content: <Content components={components} />, headings };
}
