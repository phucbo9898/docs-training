import { useTranslations } from "next-intl";
import type { ExamMode } from "@/lib/exams/types";

type ExamModeBadgeProps = {
  mode: ExamMode;
};

/** Nhãn chế độ của một lần làm: Exam đậm màu, Practice viền. */
export default function ExamModeBadge({ mode }: ExamModeBadgeProps) {
  const t = useTranslations("History");

  return (
    <span
      className={
        mode === "exam"
          ? "inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary-text"
          : "inline-flex rounded-md border border-border px-2 py-0.5 text-sm font-semibold text-text-muted"
      }
    >
      {t(`filter.${mode}`)}
    </span>
  );
}
