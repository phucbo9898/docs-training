import { getTranslations } from "next-intl/server";
import type { AttemptStats } from "@/db/attempts";
import type { ExamMode } from "@/lib/exams/types";

type ExamHistoryStatsProps = {
  stats: AttemptStats;
  mode: ExamMode;
};

/** Số lần, điểm trung bình và cao nhất (đã tính sẵn bằng SQL aggregate). */
export default async function ExamHistoryStats({
  stats,
  mode,
}: ExamHistoryStatsProps) {
  const [t, tExams] = await Promise.all([
    getTranslations("History"),
    getTranslations("Exams"),
  ]);
  const percent = (value: number | null) =>
    value === null
      ? t("stats.none")
      : t("stats.percent", { value: Math.round(value) });
  const items = [
    { label: t("stats.count"), value: String(stats.count) },
    { label: t("stats.average"), value: percent(stats.avgPercent) },
    { label: t("stats.best"), value: percent(stats.bestPercent) },
  ];

  return (
    <section aria-labelledby="history-stats-heading" className="space-y-3">
      <h2 id="history-stats-heading" className="text-lg font-bold text-text">
        {t("stats.heading", { mode: tExams(`mode.${mode}`) })}
      </h2>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-border p-4">
            <dt className="text-sm text-text-muted">{item.label}</dt>
            <dd className="mt-1 text-2xl font-bold text-text">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
