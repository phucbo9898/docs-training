import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ExamMode } from "@/lib/exams/types";

type ExamHistoryFilterProps = {
  mode: ExamMode | null;
};

const OPTIONS = [null, "practice", "exam"] as const;

/** Bộ lọc chế độ dạng link (giữ trên URL, dùng được không cần JS); đổi lọc thì về trang 1. */
export default async function ExamHistoryFilter({
  mode,
}: ExamHistoryFilterProps) {
  const t = await getTranslations("History");

  return (
    <nav aria-label={t("filterLabel")}>
      <ul className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const active = option === mode;
          return (
            <li key={option ?? "all"}>
              <Link
                href={{
                  pathname: "/aws-exams/history",
                  query: option ? { mode: option } : {},
                }}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-text hover:bg-bg-subtle"
                }`}
              >
                {t(`filter.${option ?? "all"}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
