import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { requireExamUser } from "@/lib/auth/session";
import {
  findExamEntry,
  getExam,
  getExamIndex,
  getPublicExam,
} from "@/lib/exams/load";
import { isExamMode } from "@/lib/exams/types";
import ExamSession from "./ExamSession";
import ExamSetupForm from "./ExamSetupForm";
import ExamsAccountBar from "./ExamsAccountBar";

type ExamPagePanelProps = {
  params: PageProps<"/[locale]/aws-exams/[source]/[exam]">["params"];
  searchParams: PageProps<"/[locale]/aws-exams/[source]/[exam]">["searchParams"];
};

const EXAM_NUMBER = /^[1-9][0-9]*$/;

/**
 * Phần động của trang một đề. Thứ tự cố định: kiểm tra phiên trước, đọc đề
 * sau. Exam mode chỉ nhận đề không có đáp án; Practice mode nhận đủ.
 */
export default async function ExamPagePanel({
  params,
  searchParams,
}: ExamPagePanelProps) {
  const [{ locale, source, exam: examParam }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const mode = isExamMode(query.mode) ? query.mode : null;
  const path = `/${locale}/aws-exams/${encodeURIComponent(source)}/${encodeURIComponent(examParam)}`;
  const user = await requireExamUser(
    locale,
    mode ? `${path}?mode=${mode}` : path,
  );

  if (!EXAM_NUMBER.test(examParam)) notFound();
  const number = Number(examParam);
  const [index, t] = await Promise.all([
    getExamIndex(),
    getTranslations("Exams"),
  ]);
  const found = findExamEntry(index, source, number);
  if (!found) notFound();

  const accountBar = <ExamsAccountBar user={user} locale={locale} />;

  if (mode === "practice") {
    const exam = await getExam(source, number);
    if (!exam) notFound();
    return (
      <>
        {accountBar}
        {/* `key`: đổi chế độ là phiên mới, không trộn state hai chế độ. */}
        <ExamSession key={mode} mode={mode} exam={exam} />
      </>
    );
  }

  if (mode === "exam") {
    const exam = await getPublicExam(source, number);
    if (!exam) notFound();
    return (
      <>
        {accountBar}
        <ExamSession key={mode} mode={mode} exam={exam} />
      </>
    );
  }

  // Chưa chọn chế độ: chỉ cần tiêu đề từ index, không đọc file đề.
  return (
    <>
      {accountBar}
      <div className="page-fade mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {found.entry.title}
        </h1>
        <p className="mt-3 text-lg text-text-muted">{t("chooseMode")}</p>
        <div className="mt-8">
          <ExamSetupForm
            sources={index.sources}
            fixed={{ source: found.source.id, number: found.entry.number }}
          />
        </div>
      </div>
    </>
  );
}
