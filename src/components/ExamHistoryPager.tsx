import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ExamMode } from "@/lib/exams/types";

type ExamHistoryPagerProps = {
  page: number;
  hasNext: boolean;
  mode: ExamMode | null;
};

const linkClass =
  "inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-semibold text-text hover:bg-bg-subtle";

/** Phân trang trước/sau, giữ bộ lọc chế độ. */
export default async function ExamHistoryPager({
  page,
  hasNext,
  mode,
}: ExamHistoryPagerProps) {
  if (page === 1 && !hasNext) return null;
  const t = await getTranslations("History");
  const href = (target: number) => ({
    pathname: "/aws-exams/history" as const,
    query: {
      ...(mode ? { mode } : {}),
      ...(target > 1 ? { page: String(target) } : {}),
    },
  });

  return (
    <nav
      aria-label={t("pager.label")}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={linkClass}>
          <span aria-hidden="true">←</span>&nbsp;{t("pager.prev")}
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-text-muted">
        {t("pager.page", { page })}
      </span>
      {hasNext ? (
        <Link href={href(page + 1)} rel="next" className={linkClass}>
          {t("pager.next")}&nbsp;<span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
