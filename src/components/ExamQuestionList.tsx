"use client";

import { useTranslations } from "next-intl";
import type { ExamQuestionPrompt } from "@/lib/exams/types";
import ExamFlagIcon from "./ExamFlagIcon";
import ExamStatusIcon, { type ExamItemStatus } from "./ExamStatusIcon";

type ExamQuestionListProps = {
  questions: readonly ExamQuestionPrompt[];
  current: number;
  statusOf: (question: ExamQuestionPrompt) => ExamItemStatus;
  marked: ReadonlySet<string>;
  onSelect: (index: number) => void;
};

/**
 * Mỗi dòng: số câu + nội dung rút gọn một dòng. Cắt bằng CSS (`truncate`) nên
 * chuỗi đầy đủ vẫn nằm trong DOM cho trình đọc màn hình.
 */
export default function ExamQuestionList({
  questions,
  current,
  statusOf,
  marked,
  onSelect,
}: ExamQuestionListProps) {
  const t = useTranslations("Exams");

  return (
    <ol className="space-y-1">
      {questions.map((question, index) => {
        const active = index === current;
        const status = statusOf(question);
        const isMarked = marked.has(question.id);
        return (
          <li key={question.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={active ? "step" : undefined}
              className={`flex min-h-11 w-full flex-col gap-1 rounded-md px-2 py-2 text-left text-sm ${
                active
                  ? "bg-primary/10 font-semibold text-primary-text ring-1 ring-primary"
                  : "text-text hover:bg-bg-subtle"
              }`}
            >
              <span className="flex items-center gap-2">
                <ExamStatusIcon status={status} label={t(`status.${status}`)} />
                <span className="tabular-nums text-text-muted">
                  {question.number}
                </span>
                {status === "correct" || status === "incorrect" ? (
                  // Icon trạng thái đã có nhãn cho trình đọc màn hình.
                  <span
                    aria-hidden="true"
                    className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold text-bg ${
                      status === "correct" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {t(`status.${status}`)}
                  </span>
                ) : null}
                {isMarked ? (
                  <span className="ml-auto inline-flex text-warning">
                    <ExamFlagIcon filled />
                    <span className="sr-only">{t("status.marked")}</span>
                  </span>
                ) : null}
              </span>
              <span className="block w-full truncate" title={question.prompt}>
                {question.prompt}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
