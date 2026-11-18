"use client";

import { useTranslations } from "next-intl";

/** Chú thích màu dùng chung cho biểu đồ vòng và thanh domain. */
export default function ExamScoreLegend() {
  const t = useTranslations("Exams");
  const items = [
    { key: "correct", swatch: "bg-success", text: "text-success" },
    { key: "incorrect", swatch: "bg-danger", text: "text-danger" },
    { key: "skipped", swatch: "bg-skipped", text: "text-text-muted" },
  ] as const;

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {items.map((item) => (
        <li
          key={item.key}
          className={`inline-flex items-center gap-1.5 ${item.text}`}
        >
          <span
            aria-hidden="true"
            className={`size-3 rounded-sm ${item.swatch}`}
          />
          {t(`legend.${item.key}`)}
        </li>
      ))}
    </ul>
  );
}
