"use client";

import { useTranslations } from "next-intl";
import type { ExamQuestion, ExamQuestionPrompt } from "@/lib/exams/types";

type ExamOptionListProps = {
  question: ExamQuestionPrompt;
  selected: readonly string[];
  /** Không truyền thì danh sách chỉ để xem (màn chữa đề). */
  onToggle?: (optionId: string) => void;
  /**
   * Có đáp án thì hiện đúng/sai và giải thích từng lựa chọn. Exam mode chưa
   * nộp bài không có dữ liệu này.
   */
  reveal?: ExamQuestion | null;
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

/** Màu chấm/ô đã chọn: chưa chấm là màu chính, đã chấm theo đúng/sai. */
const MARK: Record<OptionState, string> = {
  neutral: "checked:border-primary checked:bg-primary",
  selected: "checked:border-primary checked:bg-primary",
  correctPicked: "checked:border-success checked:bg-success",
  correctMissed: "checked:border-success checked:bg-success",
  wrongPicked: "checked:border-danger checked:bg-danger",
};

/**
 * Radio/checkbox tự vẽ: input `disabled` gốc (sau khi hiện đáp án, màn chữa
 * đề) bị trình duyệt tô xám và bỏ qua `accent-color`, gần như không thấy chấm.
 * Chế độ tương phản cao (forced colors) dùng lại giao diện gốc.
 */
const INPUT_BASE =
  "mt-1 size-4 shrink-0 appearance-none border-2 border-text-muted bg-bg forced-colors:appearance-auto";

const RADIO = "rounded-full checked:shadow-[inset_0_0_0_2px_var(--bg)]";

const CHECKBOX =
  "relative rounded-sm checked:before:absolute checked:before:top-px checked:before:left-1 checked:before:h-2 checked:before:w-1 checked:before:rotate-45 checked:before:border-r-2 checked:before:border-b-2 checked:before:border-bg checked:before:content-['']";

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
  const multi = question.selectCount > 1;
  const full = selected.length >= question.selectCount;
  const readOnly = !onToggle || Boolean(reveal);

  return (
    <ul className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = selected.includes(option.id);
        const isCorrect = reveal?.correct.includes(option.id) ?? false;
        const state = optionState(Boolean(reveal), isCorrect, isSelected);
        const disabled = readOnly || (multi && full && !isSelected);
        const inputId = `${question.id}-${option.id}`;
        const explanationId = `${inputId}-explanation`;
        // "" là lựa chọn không có giải thích riêng: không hiện khung trống.
        const explanation = reveal?.optionExplanations[option.id]?.trim() ?? "";
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
                aria-describedby={explanation ? explanationId : undefined}
                className={`${INPUT_BASE} ${multi ? CHECKBOX : RADIO} ${MARK[state]} ${
                  // Câu chọn nhiều đã đủ số đáp án: làm mờ các lựa chọn còn lại.
                  disabled && !reveal && !isSelected ? "opacity-50" : ""
                }`}
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
            {explanation ? (
              <p
                id={explanationId}
                className="mt-2 border-t border-border pt-2 pl-7 text-sm text-text-muted"
              >
                {explanation}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
