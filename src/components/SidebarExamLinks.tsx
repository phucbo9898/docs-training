"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ExamSource } from "@/lib/exams/types";

type SidebarExamLinksProps = {
  sources: ExamSource[];
  /** Pathname hiện tại, không kèm locale. */
  pathname: string;
};

function examHref(sourceId: string, number: number): string {
  return `/aws-exams/${sourceId}/${number}`;
}

/**
 * Sidebar của track luyện đề: mỗi bộ là một nhóm mở/đóng được, mỗi đề một
 * link có ô số thứ tự. Đang ở trang chọn đề thì mở hết các bộ.
 */
export default function SidebarExamLinks({
  sources,
  pathname,
}: SidebarExamLinksProps) {
  const t = useTranslations("Exams");
  const anyActive = sources.some((source) =>
    source.exams.some((exam) => examHref(source.id, exam.number) === pathname),
  );

  return (
    <section aria-labelledby="sidebar-exams-heading">
      <h2
        id="sidebar-exams-heading"
        className="px-3 text-xs font-bold tracking-wide text-text-muted uppercase"
      >
        {t("sidebarHeading")}
      </h2>
      <div className="mt-1 space-y-1">
        {sources.map((source) => {
          const hasActive = source.exams.some(
            (exam) => examHref(source.id, exam.number) === pathname,
          );
          return (
            <details
              key={source.id}
              open={hasActive || !anyActive}
              className="group"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold leading-snug text-text hover:bg-bg-subtle [&::-webkit-details-marker]:hidden">
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
                  className="shrink-0 transition-transform group-open:rotate-90"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span className="min-w-0 flex-1">{source.title}</span>
                <span className="shrink-0 rounded-full bg-bg-subtle px-2 py-0.5 text-xs font-medium text-text-muted group-hover:bg-bg">
                  {t("setup.sourceMeta", { exams: source.exams.length })}
                </span>
              </summary>
              <ul className="mt-1 ml-5 space-y-0.5 border-l border-border pl-2">
                {source.exams.map((exam) => {
                  const href = examHref(source.id, exam.number);
                  const active = pathname === href;
                  return (
                    <li key={exam.number}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-11 items-center gap-3 rounded-md px-2 py-2 text-sm leading-snug ${
                          active
                            ? "bg-primary/10 font-semibold text-primary-text"
                            : "text-text-muted hover:bg-bg-subtle hover:text-text"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold tabular-nums ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-bg"
                          }`}
                        >
                          {exam.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          {t("examLabel", { number: exam.number })}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums">
                          {t("questionCount", { count: exam.questionCount })}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
}
