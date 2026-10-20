import type { MDXComponents } from "mdx/types";
import Callout from "@/components/mdx/Callout";
import CodeBlock from "@/components/mdx/CodeBlock";
import Details from "@/components/mdx/Details";
import Image from "@/components/mdx/Image";
import Link from "@/components/mdx/Link";
import Paragraph from "@/components/mdx/Paragraph";
import Summary from "@/components/mdx/Summary";
import Table from "@/components/mdx/Table";

/** Tên viết hoa dùng trực tiếp trong MDX; tên thường thay thế thẻ HTML do markdown/raw HTML sinh ra. */
export const mdxComponents: MDXComponents = {
  Callout,
  CodeBlock,
  Details,
  Image,
  Table,
  a: Link,
  details: Details,
  img: Image,
  p: Paragraph,
  pre: CodeBlock,
  summary: Summary,
  table: Table,
};
