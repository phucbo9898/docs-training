"use client";

import { useTranslations } from "next-intl";
import { questionStatus } from "@/lib/exams/score";
import type { ExamQuestion } from "@/lib/exams/types";
import ExamExplanation from "./ExamExplanation";
import ExamFlagIcon from "./ExamFlagIcon";
import ExamOptionList from "./ExamOptionList";
import ExamVerdict from "./ExamVerdict";

type ExamReviewItemProps = {
  question: ExamQuestion;
  number: number;
  selected: readonly string[];
  marked: boolean;
  open: boolean;
  onToggle: () => void;
};

/** Một câu ở màn chữa đề: đầu câu bấm để mở/đóng, bên trong giống Practice đã trả lời. */
export default function ExamReviewItem({
  question,
  number,
  selected,
  marked,
  open,
  onToggle,
}: ExamReviewItemProps) {
  const t = useTranslations("Exams");
  const status = questionStatus(question, selected);
  const panelId = `${question.id}-review`;

  return (
    <li className="rounded-xl border border-border">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl p-4 text-left hover:bg-bg-subtle"
        >
          <span className="font-bold text-text">
            {t("questionNumber", { number })}
          </span>
          <ExamVerdict status={status} />
          {marked ? (
            <span className="inline-flex items-center gap-1 text-sm text-warning">
              <ExamFlagIcon filled />
              {t("status.marked")}
            </span>
          ) : null}
          {open ? null : (
            <span className="min-w-0 flex-1 truncate text-sm text-text-muted">
              {question.prompt}
            </span>
          )}
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h2>
      <div id={panelId} hidden={!open} className="space-y-4 px-4 pb-4">
        <p className="text-lg leading-relaxed text-text">{question.prompt}</p>
        {question.selectCount > 1 ? (
          <p className="text-sm font-semibold text-primary-text">
            {t("selectN", { count: question.selectCount })}
          </p>
        ) : null}
        <ExamOptionList
          question={question}
          selected={selected}
          reveal={question}
        />
        <ExamExplanation question={question} />
      </div>
    </li>
  );
}
