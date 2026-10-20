import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavItem, NavPhase } from "@/lib/navigation";
import LessonCard from "./LessonCard";

export default function HomeLessons({ tree }: { tree: NavPhase[] }) {
  const t = useTranslations("Home.lessons");

  return (
    <section aria-labelledby="lessons-heading">
      <h2 id="lessons-heading" className="text-2xl font-bold">
        {t("heading")}
      </h2>
      <div className="mt-6 space-y-10">
        {tree.map((phase) => (
          <div key={phase.phase}>
            <h3 className="text-sm font-bold tracking-wide text-primary uppercase">
              {phase.label}
              {phase.title ? ` · ${phase.title}` : ""}
            </h3>
            {phase.modules.map((module) => {
              const exercises = module.items.filter(
                (item) => item.type === "exercise",
              ).length;
              // Module chưa có bài con thì thẻ duy nhất là trang tổng quan.
              const cards: NavItem[] =
                module.items.length > 0
                  ? module.items
                  : [
                      {
                        href: module.href,
                        title: t("overview"),
                        type: "overview",
                        summary: module.summary,
                      },
                    ];
              return (
                <div key={module.slug} className="mt-5">
                  <h4 className="text-lg font-semibold">
                    <Link href={module.href} className="hover:underline">
                      {module.title}
                    </Link>
                  </h4>
                  {module.items.length > 0 ? (
                    <p className="text-sm text-text-muted">
                      {t("count", {
                        lessons: module.items.length - exercises,
                        exercises,
                      })}
                    </p>
                  ) : null}
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map((item) => (
                      <LessonCard key={item.href} item={item} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
