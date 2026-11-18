"use client";

import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import { questionStatus } from "@/lib/exams/score";
import type { ExamQuestion } from "@/lib/exams/types";
import ExamExplanation from "./ExamExplanation";
import ExamHint from "./ExamHint";
import ExamOptionList from "./ExamOptionList";
import ExamVerdict from "./ExamVerdict";

type ExamQuestionViewProps = {
  question: ExamQuestion;
  number: number;
  selected: readonly string[];
  onToggle: (optionId: string) => void;
  /** Practice mode, đã chọn đủ số đáp án: khóa lựa chọn và hiện kết quả. */
  revealed: boolean;
  /** Practice mode và chưa trả lời thì mới có nút gợi ý. */
  showHint: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

export default function ExamQuestionView({
  question,
  number,
  selected,
  onToggle,
  revealed,
  showHint,
  headingRef,
}: ExamQuestionViewProps) {
  const t = useTranslations("Exams");
  const promptId = `${question.id}-prompt`;
  const pick = question.correct.length;

  return (
    <section aria-labelledby={promptId} className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-bold text-text"
        >
          {t("questionNumber", { number })}
        </h2>
        {pick > 1 ? (
          <span className="rounded-full border border-primary px-3 py-0.5 text-sm font-semibold text-primary-text">
            {t("selectN", { count: pick })}
          </span>
        ) : null}
        {revealed ? (
          <ExamVerdict status={questionStatus(question, selected)} />
        ) : null}
      </div>
      <p id={promptId} className="text-lg leading-relaxed text-text">
        {question.prompt}
      </p>
      {showHint && question.hint ? <ExamHint hint={question.hint} /> : null}
      <ExamOptionList
        question={question}
        selected={selected}
        onToggle={onToggle}
        reveal={revealed}
      />
      {revealed ? <ExamExplanation question={question} /> : null}
    </section>
  );
}
