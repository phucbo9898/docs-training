"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ExamQuestion } from "@/lib/exams/types";

type ExamExplanationProps = {
  question: ExamQuestion;
};

/** Giải thích chung của câu, kèm link về trang ôn keyword liên quan. */
export default function ExamExplanation({ question }: ExamExplanationProps) {
  const t = useTranslations("Exams");
  // reviewPage "" là câu chưa gắn trang ôn.
  const reviewPage = question.reviewPage?.trim();

  return (
    <section className="rounded-lg border border-border bg-bg-subtle p-4">
      <h3 className="font-bold text-text">{t("explanation")}</h3>
      <p className="mt-2 text-text">{question.explanation}</p>
      {reviewPage ? (
        <Link
          href={`/aws-saa-c03/${reviewPage}`}
          className="mt-3 inline-flex min-h-11 items-center gap-1 font-semibold text-primary-text underline underline-offset-2"
        >
          {t("reviewKeywords")}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </section>
  );
}
