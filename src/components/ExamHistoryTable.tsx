import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AttemptSummary } from "@/db/attempts";
import { scorePercent } from "@/lib/exams/history";
import ExamModeBadge from "./ExamModeBadge";

type ExamHistoryTableProps = {
  items: AttemptSummary[];
  /** Tiêu đề đề theo exam id; đề không còn trong index thì hiện exam id. */
  titles: ReadonlyMap<string, string>;
};

/** Bảng các lần làm. Cuộn ngang trong khung riêng khi màn hẹp. */
export default async function ExamHistoryTable({
  items,
  titles,
}: ExamHistoryTableProps) {
  const [t, format] = await Promise.all([
    getTranslations("History"),
    getFormatter(),
  ]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">{t("table.caption")}</caption>
        <thead className="bg-bg-subtle text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("table.exam")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("table.mode")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("table.score")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("table.duration")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("table.date")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const title = titles.get(item.examId) ?? item.examId;
            const date = format.dateTime(item.createdAt, {
              dateStyle: "medium",
              timeStyle: "short",
            });
            return (
              <tr key={item.id} className="border-t border-border">
                <td className="px-4 py-3 text-text">{title}</td>
                <td className="px-4 py-3">
                  <ExamModeBadge mode={item.mode} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-text">
                  {t("table.scoreValue", {
                    score: item.score,
                    total: item.total,
                    percent: scorePercent(item.score, item.total),
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-text-muted">
                  {item.durationS === null
                    ? t("table.noDuration")
                    : t("table.minutes", {
                        minutes: Math.max(1, Math.round(item.durationS / 60)),
                      })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-text-muted">
                  {date}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/aws-exams/history/${item.id}`}
                    aria-label={t("table.detailLabel", { title, date })}
                    className="inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-2"
                  >
                    {t("table.detail")}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
