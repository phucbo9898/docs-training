"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ExamSource } from "@/lib/exams/types";

type SidebarExamLinksProps = {
  sources: ExamSource[];
  /** Pathname hiện tại, không kèm locale. */
  pathname: string;
};

/** Sidebar của track luyện đề: mỗi bộ một nhóm, mỗi đề một link. */
export default function SidebarExamLinks({
  sources,
  pathname,
}: SidebarExamLinksProps) {
  const t = useTranslations("Exams");

  return (
    <>
      {sources.map((source) => (
        <section key={source.id} aria-labelledby={`sidebar-exams-${source.id}`}>
          <h2
            id={`sidebar-exams-${source.id}`}
            className="px-3 text-xs font-bold tracking-wide text-text-muted uppercase"
          >
            {source.title}
          </h2>
          <ul className="mt-1 space-y-1">
            {source.exams.map((exam) => {
              const href = `/aws-exams/${source.id}/${exam.number}`;
              const active = pathname === href;
              return (
                <li key={exam.number}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm leading-snug ${
                      active
                        ? "bg-primary/10 font-semibold text-primary-text"
                        : "text-text-muted hover:bg-bg-subtle hover:text-text"
                    }`}
                  >
                    <span>{t("examLabel", { number: exam.number })}</span>
                    <span className="text-xs">
                      {t("questionCount", { count: exam.questionCount })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
