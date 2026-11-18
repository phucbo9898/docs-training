"use client";

import { useTranslations } from "next-intl";
import ExamFlagIcon from "./ExamFlagIcon";

type ExamToolbarProps = {
  number: number;
  total: number;
  marked: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleMark: () => void;
};

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-text hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-50";

/** "Câu x/y", Trước / Sau và nút đánh dấu. */
export default function ExamToolbar({
  number,
  total,
  marked,
  onPrev,
  onNext,
  onToggleMark,
}: ExamToolbarProps) {
  const t = useTranslations("Exams");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="mr-auto font-semibold text-text tabular-nums">
        {t("position", { number, total })}
      </p>
      <button
        type="button"
        aria-pressed={marked}
        onClick={onToggleMark}
        className={`${buttonClass} ${marked ? "border-warning text-warning" : ""}`}
      >
        <ExamFlagIcon filled={marked} />
        {marked ? t("unmark") : t("mark")}
      </button>
      <button
        type="button"
        onClick={onPrev}
        disabled={number <= 1}
        className={buttonClass}
      >
        <span aria-hidden="true">←</span>
        {t("prev")}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={number >= total}
        className={buttonClass}
      >
        {t("next")}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
