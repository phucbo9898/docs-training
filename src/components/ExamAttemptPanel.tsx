import { hasLocale } from "next-intl";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { getAttempt } from "@/db/attempts";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { requireExamUser } from "@/lib/auth/session";
import { parseExamId } from "@/lib/exams/attempt";
import { parseAttemptId, scorePercent } from "@/lib/exams/history";
import { getExam } from "@/lib/exams/load";
import ExamModeBadge from "./ExamModeBadge";
import ExamReview from "./ExamReview";
import ExamSignInAgain from "./ExamSignInAgain";
import ExamsAccountBar from "./ExamsAccountBar";

type ExamAttemptPanelProps = {
  params: PageProps<"/[locale]/aws-exams/history/[id]">["params"];
};

/**
 * Chi tiết một lần làm: chỉ ở đây mới đọc cột `answers`, rồi ghép với đề từ
 * file để chữa đề. Lần làm không thuộc người dùng hiện tại thì 404 như không
 * tồn tại.
 */
export default async function ExamAttemptPanel({
  params,
}: ExamAttemptPanelProps) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const path = `/${locale}/aws-exams/history/${encodeURIComponent(id)}`;
  const user = await requireExamUser(locale, path);
  const accountBar = <ExamsAccountBar user={user} locale={locale} />;
  const wrap = "mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8";

  if (!user.id) {
    return (
      <>
        {accountBar}
        <div className={wrap}>
          <ExamSignInAgain callbackPath={path} />
        </div>
      </>
    );
  }

  const attemptId = parseAttemptId(id);
  if (attemptId === null) notFound();
  const attempt = await getAttempt(user.id, attemptId);
  if (!attempt) notFound();

  const parsed = parseExamId(attempt.examId);
  const [exam, t, format] = await Promise.all([
    parsed ? getExam(parsed.source, parsed.number) : null,
    getTranslations("History"),
    getFormatter(),
  ]);

  return (
    <>
      {accountBar}
      <div className={`page-fade ${wrap}`}>
        <Link
          href="/aws-exams/history"
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary-text hover:underline"
        >
          <span aria-hidden="true">←</span>
          {t("detail.back")}
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-text-muted">
          <ExamModeBadge mode={attempt.mode} />
          <span className="font-semibold text-text">
            {t("detail.summary", {
              score: attempt.score,
              total: attempt.total,
              percent: scorePercent(attempt.score, attempt.total),
            })}
          </span>
          {attempt.durationS === null ? null : (
            <span>
              {t("table.minutes", {
                minutes: Math.max(1, Math.round(attempt.durationS / 60)),
              })}
            </span>
          )}
          <span>
            {format.dateTime(attempt.createdAt, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>
        </div>
        {exam ? (
          <ExamReview exam={exam} answers={attempt.answers} marked={[]} />
        ) : (
          <>
            <h1 className="text-2xl font-bold leading-tight text-text md:text-3xl">
              {attempt.examId}
            </h1>
            <p className="text-text-muted">{t("detail.examMissing")}</p>
          </>
        )}
      </div>
    </>
  );
}
