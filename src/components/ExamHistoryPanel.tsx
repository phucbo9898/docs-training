import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { attemptStats, listAttempts } from "@/db/attempts";
import { requireExamUser } from "@/lib/auth/session";
import { toExamId } from "@/lib/exams/attempt";
import { parseHistoryQuery, statsMode } from "@/lib/exams/history";
import { getExamIndex } from "@/lib/exams/load";
import ExamHistoryFilter from "./ExamHistoryFilter";
import ExamHistoryPager from "./ExamHistoryPager";
import ExamHistoryStats from "./ExamHistoryStats";
import ExamHistoryTable from "./ExamHistoryTable";
import ExamSignInAgain from "./ExamSignInAgain";
import ExamsAccountBar from "./ExamsAccountBar";

type ExamHistoryPanelProps = {
  locale: string;
  searchParams: PageProps<"/[locale]/aws-exams/history">["searchParams"];
};

/**
 * Phần động của trang lịch sử: kiểm tra phiên, rồi đọc một trang lịch sử (cột
 * nhẹ) và thống kê (aggregate) song song. Không đọc cột `answers`.
 */
export default async function ExamHistoryPanel({
  locale,
  searchParams,
}: ExamHistoryPanelProps) {
  const path = `/${locale}/aws-exams/history`;
  const [user, query, t] = await Promise.all([
    requireExamUser(locale, path),
    searchParams,
    getTranslations("History"),
  ]);
  const accountBar = <ExamsAccountBar user={user} locale={locale} />;
  const body = (children: ReactNode) => (
    <>
      {accountBar}
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 pb-8 pt-6 md:px-8 md:pb-12">
        {children}
      </div>
    </>
  );

  if (!user.id) return body(<ExamSignInAgain callbackPath={path} />);

  const { mode, page } = parseHistoryQuery(query);
  const statsFor = statsMode(mode);
  const userId = user.id;
  const data = await Promise.all([
    listAttempts(userId, mode, page),
    attemptStats(userId, statsFor),
    getExamIndex(),
  ]).then(
    ([list, stats, index]) => ({ list, stats, index }),
    (error: unknown) => {
      console.error("history: không đọc được lịch sử", error);
      return null;
    },
  );
  if (!data) {
    return body(
      <p
        role="alert"
        className="rounded-lg border border-danger bg-danger/10 p-4 text-text"
      >
        {t("loadError")}
      </p>,
    );
  }

  const titles = new Map(
    data.index.sources.flatMap((source) =>
      source.exams.map(
        (entry) => [toExamId(source.id, entry.number), entry.title] as const,
      ),
    ),
  );

  return body(
    <>
      <ExamHistoryStats stats={data.stats} mode={statsFor} />
      <ExamHistoryFilter mode={mode} />
      {data.list.items.length === 0 ? (
        <p className="text-text-muted">{t("empty")}</p>
      ) : (
        <ExamHistoryTable items={data.list.items} titles={titles} />
      )}
      <ExamHistoryPager page={page} hasNext={data.list.hasNext} mode={mode} />
    </>,
  );
}
