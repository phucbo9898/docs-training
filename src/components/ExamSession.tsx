"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import type { Exam, ExamMode } from "@/lib/exams/types";
import ExamWorkspace from "./ExamWorkspace";

type ExamSessionProps = {
  exam: Exam;
  mode: ExamMode;
};

function subscribe(): () => void {
  return () => {};
}

/**
 * Bài làm dở nằm ở sessionStorage, chỉ đọc được trên trình duyệt: đợi qua
 * hydration rồi mới dựng state để server và client render giống nhau.
 */
export default function ExamSession({ exam, mode }: ExamSessionProps) {
  const t = useTranslations("Exams");
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!hydrated) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-8 text-text-muted md:px-8">
        {t("loading")}
      </p>
    );
  }
  return <ExamWorkspace exam={exam} mode={mode} />;
}
