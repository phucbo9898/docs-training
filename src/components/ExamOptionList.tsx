"use client";

import { useTranslations } from "next-intl";
import type { ExamQuestion } from "@/lib/exams/types";

type ExamOptionListProps = {
  question: ExamQuestion;
  selected: readonly string[];
  /** Không truyền thì danh sách chỉ để xem (màn chữa đề). */
  onToggle?: (optionId: string) => void;
  /** Hiện đúng/sai và giải thích từng lựa chọn. */
  reveal: boolean;
};

type OptionState =
  "neutral" | "selected" | "correctPicked" | "correctMissed" | "wrongPicked";

function optionState(
  reveal: boolean,
  isCorrect: boolean,
  isSelected: boolean,
): OptionState {
  if (!reveal) return isSelected ? "selected" : "neutral";
  if (isCorrect) return isSelected ? "correctPicked" : "correctMissed";
  return isSelected ? "wrongPicked" : "neutral";
}

const BOX: Record<OptionState, string> = {
  neutral: "border-border bg-bg",
  selected: "border-primary bg-primary/10",
  correctPicked: "border-success bg-success/10",
  correctMissed: "border-success bg-success/10",
  wrongPicked: "border-danger bg-danger/10",
};

const TAG: Record<OptionState, string> = {
  neutral: "",
  selected: "",
  correctPicked: "bg-success text-bg",
  correctMissed: "bg-success text-bg",
  wrongPicked: "bg-danger text-bg",
};

/**
 * Các lựa chọn của một câu: radio nếu một đáp án, checkbox nếu nhiều. Câu
 * nhiều đáp án không cho chọn quá số đáp án đúng.
 */
export default function ExamOptionList({
  question,
  selected,
  onToggle,
  reveal,
}: ExamOptionListProps) {
  const t = useTranslations("Exams");
  const multi = question.correct.length > 1;
  const full = selected.length >= question.correct.length;
  const readOnly = !onToggle || reveal;

  return (
    <ul className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = selected.includes(option.id);
        const isCorrect = question.correct.includes(option.id);
        const state = optionState(reveal, isCorrect, isSelected);
        const disabled = readOnly || (multi && full && !isSelected);
        const inputId = `${question.id}-${option.id}`;
        const explanationId = `${inputId}-explanation`;
        const tag =
          state === "correctPicked"
            ? t("option.correctPicked")
            : state === "correctMissed"
              ? t("option.correctMissed")
              : state === "wrongPicked"
                ? t("option.wrongPicked")
                : "";

        return (
          <li
            key={option.id}
            className={`rounded-lg border p-4 transition-colors ${BOX[state]} ${
              disabled ? "" : "hover:border-primary"
            } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary`}
          >
            {tag ? (
              <p
                className={`mb-2 inline-block rounded px-2 py-0.5 text-xs font-bold ${TAG[state]}`}
              >
                {tag}
              </p>
            ) : null}
            <label
              htmlFor={inputId}
              className={`flex items-start gap-3 ${disabled ? "" : "cursor-pointer"}`}
            >
              <input
                id={inputId}
                type={multi ? "checkbox" : "radio"}
                name={question.id}
                value={option.id}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onToggle?.(option.id)}
                aria-describedby={reveal ? explanationId : undefined}
                className="mt-1.5 size-4 shrink-0 accent-primary"
              />
              <span className="min-w-0 flex-1 text-text">
                <span
                  aria-hidden="true"
                  className="mr-2 font-semibold text-text-muted"
                >
                  {index + 1}.
                </span>
                {option.text}
              </span>
            </label>
            {reveal ? (
              <p
                id={explanationId}
                className="mt-2 border-t border-border pt-2 pl-7 text-sm text-text-muted"
              >
                {question.optionExplanations[option.id]}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
