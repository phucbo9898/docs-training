"use client";

import { useTranslations } from "next-intl";
import type { ScoreSummary } from "@/lib/exams/score";
import { EXAM_DOMAINS, type ExamDomain } from "@/lib/exams/types";

type ExamDomainBarsProps = {
  byDomain: Partial<Record<ExamDomain, ScoreSummary>>;
};

/** Phần nhỏ hơn ngưỡng này không đủ chỗ ghi % bên trong thanh. */
const LABEL_MIN_PERCENT = 6;

function percentOf(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

/** Mỗi domain một thanh xếp chồng Đúng / Sai / Bỏ qua. */
export default function ExamDomainBars({ byDomain }: ExamDomainBarsProps) {
  const t = useTranslations("Exams");

  return (
    <ul className="space-y-5">
      {EXAM_DOMAINS.map((domain) => {
        const score = byDomain[domain];
        if (!score) return null;
        const parts = [
          {
            key: "correct",
            value: score.correct,
            className: "bg-success/15 text-success",
          },
          {
            key: "incorrect",
            value: score.incorrect,
            className: "bg-danger/15 text-danger",
          },
          {
            key: "skipped",
            value: score.skipped,
            className: "bg-skipped text-text",
          },
        ] as const;
        const description = t("domainSummary", {
          correct: score.correct,
          incorrect: score.incorrect,
          skipped: score.skipped,
        });

        return (
          <li key={domain}>
            <p className="font-semibold text-text">
              {t("domainHeading", {
                domain: t(`domain.${domain}`),
                count: score.total,
              })}
            </p>
            <div
              role="img"
              aria-label={description}
              className="mt-1.5 flex h-6 overflow-hidden rounded text-xs font-medium"
            >
              {parts.map((part) => {
                const percent = percentOf(part.value, score.total);
                if (percent === 0) return null;
                return (
                  <span
                    key={part.key}
                    style={{ width: `${percent}%` }}
                    className={`flex items-center justify-center ${part.className}`}
                  >
                    {percent >= LABEL_MIN_PERCENT ? `${percent}%` : null}
                  </span>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
