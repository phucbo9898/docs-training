import { Fragment } from "react";
import { matchRanges } from "@/lib/search";

type HighlightedTextProps = {
  text: string;
  /** Từ khóa đã chuẩn hóa không dấu. */
  tokens: string[];
};

/** Tô đậm từ khóa, khớp không dấu nhưng hiển thị nguyên văn bản gốc. */
export default function HighlightedText({
  text,
  tokens,
}: HighlightedTextProps) {
  const ranges = matchRanges(text, tokens);
  if (ranges.length === 0) return text;

  const parts: Array<{ value: string; match: boolean }> = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) {
      parts.push({ value: text.slice(cursor, start), match: false });
    }
    parts.push({ value: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) {
    parts.push({ value: text.slice(cursor), match: false });
  }

  return parts.map((part, index) => (
    <Fragment key={index}>
      {part.match ? (
        <mark className="rounded-sm bg-primary/20 font-semibold text-text">
          {part.value}
        </mark>
      ) : (
        part.value
      )}
    </Fragment>
  ));
}
