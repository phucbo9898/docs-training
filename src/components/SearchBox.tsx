"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useSearch } from "./SearchProvider";

type SearchBoxProps = {
  /** Hiện gợi ý phím tắt; tắt trong drawer mobile vì không có bàn phím. */
  showShortcut?: boolean;
};

const subscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Nút trông như ô tìm kiếm, bấm để mở SearchDialog. */
export default function SearchBox({ showShortcut = false }: SearchBoxProps) {
  const t = useTranslations("Search");
  const { openSearch } = useSearch();
  // Server luôn render "Ctrl K"; client tự đổi sang ⌘K trên Apple mà không lệch hydration.
  const apple = useSyncExternalStore(subscribe, isApple, () => false);

  return (
    <button
      type="button"
      data-search-trigger
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      onClick={openSearch}
      className="flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-bg-subtle px-3 text-left text-sm text-text-muted hover:border-primary"
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="min-w-0 flex-1 truncate">{t("placeholder")}</span>
      {showShortcut ? (
        <kbd
          aria-hidden="true"
          className="hidden shrink-0 rounded border border-border bg-bg px-1.5 lg:inline py-0.5 font-sans text-xs text-text-muted"
        >
          {apple ? t("shortcutMac") : t("shortcutOther")}
        </kbd>
      ) : null}
    </button>
  );
}
