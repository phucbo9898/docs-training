"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { isExamMode, type Exam, type ExamSource } from "@/lib/exams/types";
import ExamSession from "./ExamSession";
import ExamSetupForm from "./ExamSetupForm";

type ExamRunnerProps = {
  exam: Exam;
  sources: ExamSource[];
};

/** Có `?mode=` hợp lệ thì vào làm bài; chưa có thì hiện form chọn sẵn đề này. */
export default function ExamRunner({ exam, sources }: ExamRunnerProps) {
  const t = useTranslations("Exams");
  const mode = useSearchParams().get("mode");

  if (!isExamMode(mode)) {
    return (
      <div className="page-fade mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {exam.title}
        </h1>
        <p className="mt-3 text-lg text-text-muted">{t("chooseMode")}</p>
        <div className="mt-8">
          <ExamSetupForm
            sources={sources}
            initialSource={exam.source}
            initialNumber={exam.number}
          />
        </div>
      </div>
    );
  }

  // `key` để đổi chế độ là bắt đầu phiên mới, không trộn state hai chế độ.
  return <ExamSession key={mode} exam={exam} mode={mode} />;
}
