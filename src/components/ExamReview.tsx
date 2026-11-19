"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { questionStatus, type QuestionStatus } from "@/lib/exams/score";
import { examDomains } from "@/lib/exams/domains";
import type { Exam, ExamAnswers } from "@/lib/exams/types";
import { useDomainLabel } from "@/lib/exams/use-domain-label";
import ExamReviewItem from "./ExamReviewItem";

type ExamReviewProps = {
  exam: Exam;
  answers: ExamAnswers;
  marked: string[];
  /** Không truyền: ẩn nút quay lại (trang chi tiết lịch sử có link riêng). */
  onBack?: () => void;
};

type Filter = "all" | QuestionStatus | "marked";

const FILTERS: readonly Filter[] = [
  "all",
  "correct",
  "incorrect",
  "skipped",
  "marked",
];

/** Màn chữa đề: lọc theo domain và trạng thái, mở/đóng từng câu. */
export default function ExamReview({
  exam,
  answers,
  marked,
  onBack,
}: ExamReviewProps) {
  const t = useTranslations("Exams");
  const domainLabel = useDomainLabel();
  const domainSelectId = useId();
  const domains = examDomains(exam.questions);
  /** Vị trí trong `domains`; dùng chỉ số vì domain có thể là null. */
  const [domainIndex, setDomainIndex] = useState<number | "all">("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set());

  const markedSet = new Set(marked);
  const items = exam.questions.map((question) => ({
    question,
    number: question.number,
    status: questionStatus(question, answers[question.id]),
    marked: markedSet.has(question.id),
  }));
  const inDomain = items.filter(
    (item) =>
      domainIndex === "all" || item.question.domain === domains[domainIndex],
  );

  function matches(item: (typeof items)[number], value: Filter): boolean {
    if (value === "all") return true;
    if (value === "marked") return item.marked;
    return item.status === value;
  }

  const visible = inDomain.filter((item) => matches(item, filter));
  const allClosed =
    visible.length > 0 && visible.every((item) => closed.has(item.question.id));

  function toggle(id: string) {
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setClosed(
      allClosed ? new Set() : new Set(visible.map((item) => item.question.id)),
    );
  }

  return (
    <div className="space-y-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary-text hover:underline"
        >
          <span aria-hidden="true">←</span>
          {t("review.back")}
        </button>
      ) : null}
      <h1 className="text-2xl font-bold leading-tight text-text md:text-3xl">
        {t("review.heading", { title: exam.title })}
      </h1>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <label
            htmlFor={domainSelectId}
            className="block text-sm font-semibold text-text"
          >
            {t("review.domainFilter")}
          </label>
          <select
            id={domainSelectId}
            value={String(domainIndex)}
            onChange={(event) => {
              const index = Number(event.target.value);
              setDomainIndex(
                Number.isInteger(index) && index >= 0 && index < domains.length
                  ? index
                  : "all",
              );
            }}
            className="min-h-11 rounded-lg border border-border bg-bg px-3 text-text"
          >
            <option value="all">{t("review.allDomains")}</option>
            {domains.map((item, index) => (
              <option key={item ?? ""} value={index}>
                {domainLabel(item)}
              </option>
            ))}
          </select>
        </div>
        <div
          role="group"
          aria-label={t("review.statusFilter")}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((item) => {
            const count = inDomain.filter((entry) =>
              matches(entry, item),
            ).length;
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary text-primary-text hover:bg-primary/10"
                }`}
              >
                {t(`review.filter.${item}`, { count })}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleAll}
          disabled={visible.length === 0}
          className="inline-flex min-h-11 items-center font-semibold text-primary-text hover:underline disabled:opacity-50"
        >
          {allClosed ? t("review.expandAll") : t("review.collapseAll")}
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-text-muted">{t("review.empty")}</p>
      ) : (
        <ol className="space-y-3">
          {visible.map((item) => (
            <ExamReviewItem
              key={item.question.id}
              question={item.question}
              number={item.number}
              selected={answers[item.question.id] ?? []}
              marked={item.marked}
              open={!closed.has(item.question.id)}
              onToggle={() => toggle(item.question.id)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
