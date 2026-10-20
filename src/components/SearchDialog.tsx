"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { loadSearcher, type Searcher } from "@/lib/search";
import SearchResultItem from "./SearchResultItem";

type SearchDialogProps = {
  open: boolean;
  /** Đóng và trả focus về nút đã mở. */
  onClose: () => void;
  /** Đóng (không trả focus) và chuyển tới `url`. */
  onNavigate: (url: string) => void;
};

/**
 * Hộp thoại tìm kiếm dùng <dialog> modal gốc (focus bị nhốt trong hộp, nền bị
 * inert, Escape đóng). Ô nhập theo mẫu combobox + listbox, focus luôn ở ô nhập
 * và mục đang chọn được báo qua aria-activedescendant.
 */
export default function SearchDialog({
  open,
  onClose,
  onNavigate,
}: SearchDialogProps) {
  const t = useTranslations("Search");
  const locale = useLocale();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState<{
    locale: string;
    searcher: Searcher;
  } | null>(null);
  const [failedLocale, setFailedLocale] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const searcher = loaded?.locale === locale ? loaded.searcher : null;
  const failed = failedLocale === locale;
  const loading = open && !searcher && !failed;

  // Chỉ tải index khi mở lần đầu (hoặc khi bấm thử lại), mỗi locale một lần.
  useEffect(() => {
    if (!open || searcher) return;
    let cancelled = false;
    loadSearcher(locale).then(
      (result) => {
        if (!cancelled) setLoaded({ locale, searcher: result });
      },
      () => {
        if (!cancelled) setFailedLocale(locale);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [open, locale, searcher, attempt]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Giữ từ khóa lần trước nhưng bôi đen sẵn để gõ là thay thế.
      inputRef.current?.select();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Escape chỉ đóng hộp thoại, không để drawer phía sau bắt phím này. Phải là
  // listener gốc trên <dialog>: React gắn sự kiện ở document nên stopPropagation
  // của React không chặn được listener document của Sidebar.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function stopEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") event.stopPropagation();
    }
    dialog.addEventListener("keydown", stopEscape);
    return () => dialog.removeEventListener("keydown", stopEscape);
  }, []);

  // <dialog> modal không khóa cuộn trang nền.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const deferredQuery = useDeferredValue(query);
  const outcome = useMemo(
    () => searcher?.search(deferredQuery) ?? { hits: [], tokens: [] },
    [searcher, deferredQuery],
  );
  const { hits, tokens } = outcome;
  const hasQuery = tokens.length > 0;
  const active = Math.min(activeIndex, Math.max(hits.length - 1, 0));
  const optionId = (index: number) => `${baseId}-option-${index}`;

  // Cuộn mục đang chọn vào vùng nhìn thấy khi điều hướng bằng bàn phím.
  useEffect(() => {
    if (!open || hits.length === 0) return;
    document
      .getElementById(`${baseId}-option-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, hits, baseId]);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setActiveIndex(0);
  }

  function select(index: number) {
    const hit = hits[index];
    if (!hit) return;
    setQuery("");
    setActiveIndex(0);
    onNavigate(hit.entry.url);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    // Đang gõ tiếng Việt bằng IME: Enter và mũi tên thuộc về bộ gõ.
    if (event.nativeEvent.isComposing || event.target !== inputRef.current) {
      return;
    }
    if (hits.length === 0 && event.key !== "Enter") return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((active + 1) % hits.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((active - 1 + hits.length) % hits.length);
        break;
      case "Home":
        if (hits.length > 0) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (hits.length > 0) {
          event.preventDefault();
          setActiveIndex(hits.length - 1);
        }
        break;
      case "Enter":
        event.preventDefault();
        select(active);
        break;
    }
  }

  let status = "";
  if (loading) status = t("loading");
  else if (failed) status = t("error");
  else if (hasQuery) {
    status =
      hits.length > 0
        ? t("count", { count: hits.length })
        : t("empty", { query: query.trim() });
  }

  const showList = hasQuery && hits.length > 0;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("dialogLabel")}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        // Bấm vào lớp nền (target là chính <dialog>) thì đóng.
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-x-0 top-0 m-0 h-dvh max-h-none w-full max-w-none flex-col overflow-hidden border-border bg-bg p-0 text-text backdrop:bg-text/40 open:flex md:inset-x-auto md:top-[10vh] md:left-1/2 md:h-auto md:max-h-[75dvh] md:max-w-2xl md:-translate-x-1/2 md:rounded-xl md:border md:shadow-xl"
    >
      <div className="flex items-center gap-2 border-b border-border p-3">
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="ml-1 shrink-0 text-text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={t("inputLabel")}
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? optionId(active) : undefined}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={query}
          onChange={onChange}
          placeholder={t("inputPlaceholder")}
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-text-muted"
        />
        <button
          type="button"
          aria-label={t("close")}
          onClick={onClose}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-text hover:bg-bg-subtle"
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        {showList ? (
          <ul id={listId} role="listbox" aria-label={t("results")}>
            {hits.map((hit, index) => (
              <SearchResultItem
                key={hit.entry.url + index}
                id={optionId(index)}
                hit={hit}
                tokens={tokens}
                active={index === active}
                onSelect={() => select(index)}
                onHover={() => setActiveIndex(index)}
              />
            ))}
          </ul>
        ) : (
          <div className="px-3 py-8 text-center text-sm text-text-muted">
            {loading ? <p>{t("loading")}</p> : null}
            {failed ? (
              <>
                <p>{t("error")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFailedLocale(null);
                    setAttempt((value) => value + 1);
                  }}
                  className="mt-3 inline-flex h-11 items-center rounded-md border border-border px-4 font-medium text-text hover:bg-bg-subtle"
                >
                  {t("retry")}
                </button>
              </>
            ) : null}
            {!loading && !failed && !hasQuery ? <p>{t("hint")}</p> : null}
            {!loading && !failed && hasQuery ? (
              <p>{t("empty", { query: query.trim() })}</p>
            ) : null}
          </div>
        )}
      </div>

      <p className="hidden border-t border-border px-4 py-2 text-xs text-text-muted md:block">
        {t("navHint")}
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
    </dialog>
  );
}
