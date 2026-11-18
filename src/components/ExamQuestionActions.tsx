"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import type { ExamMode } from "@/lib/exams/types";

type ExamQuestionActionsProps = {
  mode: ExamMode;
  /** Số đáp án đang chọn ở câu hiện tại. */
  selectedCount: number;
  /** Số đáp án câu yêu cầu chọn. */
  selectCount: number;
  /** Practice mode: câu đã kiểm tra đáp án. */
  checked: boolean;
  /** Câu cuối thì không còn câu để bỏ qua / sang câu tiếp. */
  isLast: boolean;
  onSkip: () => void;
  onCheck: () => void;
  onNext: () => void;
};

type Action = "skip" | "check" | "next";

function actionOf(
  mode: ExamMode,
  selectedCount: number,
  checked: boolean,
): Action {
  if (selectedCount === 0) return "skip";
  if (mode === "practice" && !checked) return "check";
  return "next";
}

const PRIMARY =
  "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const SECONDARY =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-text hover:bg-bg-subtle";

/**
 * Nút dưới câu hỏi:
 * - Chưa chọn đáp án: "Bỏ qua".
 * - Practice mode, đã chọn nhưng chưa kiểm tra: "Kiểm tra đáp án".
 * - Đã kiểm tra (Practice) hoặc đã chọn (Exam): "Câu tiếp".
 * Luôn là cùng một phần tử <button> nên đổi trạng thái không làm mất focus.
 */
export default function ExamQuestionActions({
  mode,
  selectedCount,
  selectCount,
  checked,
  isLast,
  onSkip,
  onCheck,
  onNext,
}: ExamQuestionActionsProps) {
  const t = useTranslations("Exams");
  const hintId = useId();
  const action = actionOf(mode, selectedCount, checked);

  if (isLast && action !== "check") return null;

  // Câu chọn nhiều: chọn đủ số đáp án mới kiểm tra được.
  const notEnough = action === "check" && selectedCount < selectCount;
  const onClick =
    action === "skip" ? onSkip : action === "check" ? onCheck : onNext;

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {notEnough ? (
        <p id={hintId} className="text-sm text-text-muted">
          {t("actions.selectMore", { count: selectCount - selectedCount })}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onClick}
        disabled={notEnough}
        aria-describedby={notEnough ? hintId : undefined}
        className={action === "skip" ? SECONDARY : PRIMARY}
      >
        {t(`actions.${action}`)}
        {action === "check" ? null : <span aria-hidden="true">→</span>}
      </button>
    </div>
  );
}
