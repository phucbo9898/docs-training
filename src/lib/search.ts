// Chỉ import kiểu: thư viện Fuse được tải động khi mở tìm kiếm (xem loadSearcher).
import type FuseClass from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import { foldText } from "./search-text";
import { isTrackId, type TrackId } from "./tracks";

/** Một mục trong public/search-index.<locale>.json (xem scripts/build-search-index.ts). */
export type SearchEntry = {
  title: string;
  module: string;
  track: TrackId;
  phase: number;
  /** Đường dẫn kèm locale, có `#anchor` khi trỏ tới một heading. */
  url: string;
  heading: string;
  text: string;
};

export type SearchHit = {
  entry: SearchEntry;
  /** Đoạn trích quanh chỗ khớp đầu tiên trong `text`. */
  snippet: string;
};

export type SearchOutcome = {
  hits: SearchHit[];
  /** Từ khóa đã chuẩn hóa không dấu, dùng để tô đậm. */
  tokens: string[];
};

export type Searcher = { search: (query: string) => SearchOutcome };

const MAX_RESULTS = 20;
const FUSE_LIMIT = 60;
const SNIPPET_BEFORE = 50;
const SNIPPET_LENGTH = 170;
/** Ký tự điều khiển của Fuse extended search, bỏ khỏi từ khóa người dùng gõ. */
const FUSE_SYNTAX = /['"!^$|=]/g;

function isSearchEntry(value: unknown): value is SearchEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.title === "string" &&
    typeof entry.module === "string" &&
    isTrackId(entry.track) &&
    typeof entry.phase === "number" &&
    typeof entry.url === "string" &&
    typeof entry.heading === "string" &&
    typeof entry.text === "string"
  );
}

function isSearchEntries(value: unknown): value is SearchEntry[] {
  return Array.isArray(value) && value.every(isSearchEntry);
}

export function tokenize(query: string): string[] {
  return foldText(query)
    .replace(FUSE_SYNTAX, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

/** Cắt đoạn trích quanh từ khóa đầu tiên, bắt đầu ở ranh giới từ. */
function makeSnippet(text: string, tokens: string[]): string {
  if (text.length <= SNIPPET_LENGTH) return text;
  const folded = foldText(text);
  const positions = tokens
    .map((token) => folded.indexOf(token))
    .filter((index) => index >= 0);
  const first = positions.length > 0 ? Math.min(...positions) : 0;

  let start = Math.max(0, first - SNIPPET_BEFORE);
  if (start > 0) {
    const space = text.indexOf(" ", start);
    start = space === -1 || space > first ? start : space + 1;
  }
  const end = Math.min(text.length, start + SNIPPET_LENGTH);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/** Các đoạn [start, end) của `text` khớp với từ khóa, không dấu và không phân biệt hoa thường. */
export function matchRanges(
  text: string,
  tokens: string[],
): Array<[number, number]> {
  if (tokens.length === 0) return [];
  const folded = foldText(text);
  const ranges: Array<[number, number]> = [];
  for (const token of tokens) {
    let from = folded.indexOf(token);
    while (from !== -1) {
      ranges.push([from, from + token.length]);
      from = folded.indexOf(token, from + token.length);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);

  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }
  return merged;
}

function createSearcher(
  Fuse: typeof FuseClass,
  entries: SearchEntry[],
): Searcher {
  const options: IFuseOptions<SearchEntry> = {
    keys: [
      { name: "title", weight: 0.3 },
      { name: "heading", weight: 0.3 },
      { name: "text", weight: 0.3 },
      { name: "module", weight: 0.1 },
    ],
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    threshold: 0.2,
    // Chuẩn hóa không dấu khi dựng index của Fuse, khớp với từ khóa đã chuẩn hóa.
    getFn: (obj, path) => {
      const value = Fuse.config.getFn(obj, path);
      if (typeof value === "string") return foldText(value);
      return Array.isArray(value) ? value.map(foldText) : "";
    },
  };
  const fuse = new Fuse(entries, options);

  return {
    search(query) {
      const tokens = tokenize(query);
      if (tokens.length === 0) return { hits: [], tokens };

      // Khớp đúng chuỗi con trước; chỉ khi không có gì mới cho phép gõ sai chính tả.
      let results = fuse.search(tokens.map((token) => `'${token}`).join(" "), {
        limit: FUSE_LIMIT,
      });
      if (results.length === 0) {
        results = fuse.search(tokens.join(" "), { limit: FUSE_LIMIT });
      }

      // Một bài có thể có nhiều đoạn cùng anchor, chỉ giữ đoạn tốt nhất.
      const seen = new Set<string>();
      const hits: SearchHit[] = [];
      for (const { item } of results) {
        if (seen.has(item.url)) continue;
        seen.add(item.url);
        hits.push({ entry: item, snippet: makeSnippet(item.text, tokens) });
        if (hits.length === MAX_RESULTS) break;
      }
      return { hits, tokens };
    },
  };
}

const searchers = new Map<string, Promise<Searcher>>();

/** Tải index của một locale đúng một lần; lỗi thì xóa cache để lần sau thử lại. */
export function loadSearcher(locale: string): Promise<Searcher> {
  const cached = searchers.get(locale);
  if (cached) return cached;

  // Tải Fuse song song với index để không nằm trong JS ban đầu của mọi trang.
  const promise = Promise.all([
    import("fuse.js"),
    fetch(`/search-index.${locale}.json`).then((response) => {
      if (!response.ok) throw new Error(`Search index ${response.status}`);
      return response.json() as Promise<unknown>;
    }),
  ]).then(([{ default: Fuse }, data]) => {
    if (!isSearchEntries(data)) throw new Error("Invalid search index");
    return createSearcher(Fuse, data);
  });
  searchers.set(locale, promise);
  promise.catch(() => searchers.delete(locale));
  return promise;
}
