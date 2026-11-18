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
              className={`flex min-h-11 w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${
                active
                  ? "bg-primary/10 font-semibold text-primary-text ring-1 ring-primary"
                  : "text-text hover:bg-bg-subtle"
              }`}
            >
              <ExamStatusIcon status={status} label={t(`status.${status}`)} />
              <span className="w-7 shrink-0 tabular-nums text-text-muted">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1 truncate" title={question.prompt}>
                {question.prompt}
              </span>
              {isMarked ? (
                <span className="inline-flex text-warning">
                  <ExamFlagIcon filled />
                  <span className="sr-only">{t("status.marked")}</span>
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
