"use client";

import { useTranslations } from "next-intl";

/**
 * Fallback khi chờ kiểm tra phiên. Client Component vì trang đề không biết
 * locale lúc prerender (params chỉ có khi có request).
 */
export default function ExamLoading() {
  const t = useTranslations("Exams");

  return (
    <p
      role="status"
      className="mx-auto max-w-6xl px-4 py-8 text-text-muted md:px-8"
    >
      {t("loading")}
    </p>
  );
}
