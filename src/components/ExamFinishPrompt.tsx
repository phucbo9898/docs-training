"use client";

import { useTranslations } from "next-intl";

type ExamFinishPromptProps = {
  total: number;
  unanswered: number;
  onFinish: () => void;
};

/**
 * Practice mode: ở câu cuối hoặc khi đã làm hết thì nhắc nộp bài để xem điểm,
 * kết quả theo domain và chữa đề (giống Exam mode).
 */
export default function ExamFinishPrompt({
  total,
  unanswered,
  onFinish,
}: ExamFinishPromptProps) {
  const t = useTranslations("Exams");

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary bg-primary/10 p-4">
      <p className="min-w-0 flex-1 text-text">
        {unanswered === 0
          ? t("finishPrompt.done", { total })
          : t("finishPrompt.last", { count: unanswered })}
      </p>
      <button
        type="button"
        onClick={onFinish}
        className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90"
      >
        {t("finishPrompt.action")}
      </button>
    </div>
  );
}
