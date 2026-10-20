import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavLink } from "@/lib/navigation";

type LessonNavProps = {
  prev: NavLink | null;
  next: NavLink | null;
};

const cardClass =
  "flex min-h-11 flex-col gap-1 rounded-lg border border-border p-4 hover:border-primary hover:bg-bg-subtle";

export default function LessonNav({ prev, next }: LessonNavProps) {
  const t = useTranslations("Lesson");
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={t("pagination")}
      className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link href={prev.href} rel="prev" className={cardClass}>
          <span className="text-sm text-text-muted">← {t("prev")}</span>
          <span className="font-semibold text-text">{prev.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          rel="next"
          className={`${cardClass} sm:col-start-2 sm:text-right`}
        >
          <span className="text-sm text-text-muted">{t("next")} →</span>
          <span className="font-semibold text-text">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
