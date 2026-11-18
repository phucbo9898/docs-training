"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { EXAM_MODES, type ExamMode, type ExamSource } from "@/lib/exams/types";

type ExamSetupFormProps = {
  sources: ExamSource[];
  /** Chọn sẵn khi mở form từ trang một đề (chưa có `?mode=`). */
  initialSource?: string;
  initialNumber?: number;
};

const fieldsetClass = "space-y-3";
const legendClass = "mb-2 text-lg font-bold text-text";

function choiceClass(checked: boolean): string {
  return `flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
    checked
      ? "border-primary bg-primary/10"
      : "border-border bg-bg hover:border-primary"
  }`;
}

/** Chọn bộ → đề → chế độ, rồi chuyển sang trang làm bài. */
export default function ExamSetupForm({
  sources,
  initialSource,
  initialNumber,
}: ExamSetupFormProps) {
  const t = useTranslations("Exams");
  const router = useRouter();
  const examSelectId = useId();

  const [sourceId, setSourceId] = useState(
    sources.find((source) => source.id === initialSource)?.id ??
      sources[0]?.id ??
      "",
  );
  const source = sources.find((item) => item.id === sourceId) ?? sources[0];
  const [number, setNumber] = useState(
    source?.exams.find((exam) => exam.number === initialNumber)?.number ??
      source?.exams[0]?.number ??
      1,
  );
  const [mode, setMode] = useState<ExamMode>("practice");

  if (!source) return null;
  const exam =
    source.exams.find((item) => item.number === number) ?? source.exams[0];

  function onSourceChange(id: string) {
    setSourceId(id);
    const next = sources.find((item) => item.id === id);
    // Bộ mới không có đề đang chọn thì về đề đầu tiên.
    if (next && !next.exams.some((item) => item.number === number)) {
      setNumber(next.exams[0]?.number ?? 1);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!source || !exam) return;
    router.push(`/aws-exams/${source.id}/${exam.number}?mode=${mode}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>{t("setup.source")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((item) => (
            <label key={item.id} className={choiceClass(item.id === sourceId)}>
              <input
                type="radio"
                name="source"
                value={item.id}
                checked={item.id === sourceId}
                onChange={() => onSourceChange(item.id)}
                className="mt-1 size-4 accent-primary"
              />
              <span>
                <span className="block font-semibold text-text">
                  {item.title}
                </span>
                <span className="block text-sm text-text-muted">
                  {t("setup.sourceMeta", { exams: item.exams.length })}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor={examSelectId} className={`block ${legendClass}`}>
          {t("setup.exam")}
        </label>
        <select
          id={examSelectId}
          value={exam?.number}
          onChange={(event) => setNumber(Number(event.target.value))}
          className="min-h-11 w-full rounded-lg border border-border bg-bg px-3 text-text sm:w-64"
        >
          {source.exams.map((item) => (
            <option key={item.number} value={item.number}>
              {t("examLabel", { number: item.number })}
            </option>
          ))}
        </select>
        {exam ? (
          <p className="text-sm text-text-muted">
            {t("setup.examMeta", {
              count: exam.questionCount,
              minutes: exam.durationMinutes,
            })}
          </p>
        ) : null}
      </div>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>{t("setup.mode")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAM_MODES.map((item) => (
            <label key={item} className={choiceClass(item === mode)}>
              <input
                type="radio"
                name="mode"
                value={item}
                checked={item === mode}
                onChange={() => setMode(item)}
                className="mt-1 size-4 accent-primary"
              />
              <span>
                <span className="block font-semibold text-text">
                  {t(`mode.${item}`)}
                </span>
                <span className="block text-sm text-text-muted">
                  {item === "exam" && exam
                    ? t("mode.examDescription", {
                        minutes: exam.durationMinutes,
                      })
                    : t("mode.practiceDescription")}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
      >
        {t("setup.start")}
      </button>
    </form>
  );
}
