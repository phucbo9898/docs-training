"use client";

import { useEffect, useRef } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { ExamGrade } from "@/lib/exams/score";
import type { Exam, ExamMode } from "@/lib/exams/types";
import ExamDomainBars from "./ExamDomainBars";
import ExamDonut from "./ExamDonut";
import ExamScoreLegend from "./ExamScoreLegend";

type ExamResultProps = {
  exam: Exam;
  mode: ExamMode;
  /** Điểm đã chấm: Exam mode chấm ở server, Practice mode chấm ngay trên trình duyệt. */
  grade: ExamGrade;
  startedAt: number;
  finishedAt: number;
  onReview: () => void;
  onRestart: () => void;
};

const MINUTE_MS = 60_000;

export default function ExamResult({
  exam,
  mode,
  grade,
  startedAt,
  finishedAt,
  onReview,
  onRestart,
}: ExamResultProps) {
  const t = useTranslations("Exams");
  const format = useFormatter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { score, byDomain } = grade;
  const minutes = Math.max(1, Math.round((finishedAt - startedAt) / MINUTE_MS));

  // Vừa nộp bài: đưa focus về đầu màn kết quả.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-bold leading-tight text-text md:text-3xl"
        >
          {t("result.heading", { title: exam.title })}
        </h1>
      </div>

      <section className="flex flex-col gap-8 rounded-xl border border-border p-6 md:flex-row md:items-center">
        <div className="flex flex-col items-center gap-3">
          <ExamDonut
            score={score}
            label={t("domainSummary", {
              correct: score.correct,
              incorrect: score.incorrect,
              skipped: score.skipped,
            })}
          />
          <ExamScoreLegend />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary-text">
              {t(`mode.${mode}`)}
            </span>
            {exam.mock ? (
              <span className="rounded-md border border-warning px-2 py-0.5 font-semibold text-warning">
                {t("mockBadge")}
              </span>
            ) : null}
          </div>
          <p className="text-lg text-text">
            <span
              className={
                score.passed
                  ? "font-semibold text-success"
                  : "font-semibold text-danger"
              }
            >
              {score.passed ? t("result.passed") : t("result.failed")}
            </span>{" "}
            <span className="text-text-muted">
              {t("result.passMark", { percent: exam.passPercent })}
            </span>
          </p>
          <p className="text-text">
            <span className="text-5xl font-bold">{score.percent}%</span>{" "}
            <span className="text-text-muted">
              {t("result.correctOf", {
                correct: score.correct,
                total: score.total,
              })}
            </span>
          </p>
          <p className="text-text-muted">{t("result.minutes", { minutes })}</p>
          <p className="text-text-muted">
            {format.dateTime(finishedAt, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={onReview}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90"
            >
              {t("result.review")}
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-semibold text-text hover:bg-bg-subtle"
            >
              {t("result.restart")}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="exam-domains-heading" className="space-y-4">
        <h2 id="exam-domains-heading" className="text-xl font-bold text-text">
          {t("result.domains")}
        </h2>
        <ExamDomainBars byDomain={byDomain} />
        <ExamScoreLegend />
      </section>
    </div>
  );
}
