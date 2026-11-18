"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

type ExamHintProps = {
  hint: string;
};

/** Nút "Gợi ý" bật/tắt đoạn gợi ý; chỉ hiện trước khi trả lời ở Practice mode. */
export default function ExamHint({ hint }: ExamHintProps) {
  const t = useTranslations("Exams");
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-warning px-4 text-sm font-semibold text-warning hover:bg-warning/10"
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
        </svg>
        {open ? t("hideHint") : t("showHint")}
      </button>
      <p
        id={id}
        hidden={!open}
        className="mt-2 rounded-lg border border-warning bg-warning/10 p-3 text-sm text-text"
      >
        {hint}
      </p>
    </div>
  );
}
