import { useTranslations } from "next-intl";

/** Ô tìm kiếm tạm: chưa hoạt động, thay bằng SearchDialog ở bước tìm kiếm. */
export default function SearchBox() {
  const t = useTranslations("Search");

  return (
    <div className="relative w-full">
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
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        disabled
        aria-label={t("label")}
        placeholder={t("placeholder")}
        className="h-11 w-full rounded-lg border border-border bg-bg-subtle pr-3 pl-10 text-sm text-text placeholder:text-text-muted disabled:cursor-not-allowed"
      />
    </div>
  );
}
