import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getExam, getExamIndex } from "@/lib/exams/load";
import ExamRunner from "./ExamRunner";

type ExamPageContentProps = {
  params: PageProps<"/[locale]/aws-exams/[source]/[exam]">["params"];
};

const EXAM_NUMBER = /^[1-9][0-9]*$/;

export default async function ExamPageContent({
  params,
}: ExamPageContentProps) {
  const { locale, source, exam: examParam } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  if (!EXAM_NUMBER.test(examParam)) notFound();

  const [exam, index, t] = await Promise.all([
    getExam(source, Number(examParam)),
    getExamIndex(),
    getTranslations("Exams"),
  ]);
  if (!exam) notFound();

  return (
    // Chế độ nằm ở `?mode=`, chỉ đọc được trên client: phần làm bài render
    // sau Suspense, khung trang vẫn prerender.
    <Suspense
      fallback={
        <p className="mx-auto max-w-6xl px-4 py-8 text-text-muted md:px-8">
          {t("loading")}
        </p>
      }
    >
      <ExamRunner exam={exam} sources={index.sources} />
    </Suspense>
  );
}
