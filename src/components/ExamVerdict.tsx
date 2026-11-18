"use client";

import { useTranslations } from "next-intl";
import type { QuestionStatus } from "@/lib/exams/score";

type ExamVerdictProps = {
  status: QuestionStatus;
};

const STYLES: Record<QuestionStatus, string> = {
  correct: "border-success bg-success/10 text-success",
  incorrect: "border-danger bg-danger/10 text-danger",
  skipped: "border-border bg-bg-subtle text-text-muted",
};

/** Nhãn Đúng / Sai / Bỏ qua của một câu. */
export default function ExamVerdict({ status }: ExamVerdictProps) {
  const t = useTranslations("Exams");

  return (
    <span
      className={`rounded-full border px-3 py-0.5 text-sm font-bold ${STYLES[status]}`}
    >
      {t(`verdict.${status}`)}
    </span>
  );
}
