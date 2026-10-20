import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isIndexSlug, type Lesson } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { mdxComponents } from "@/lib/mdx-components";
import { findNeighbors, getNavTree } from "@/lib/navigation";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import LessonNav from "./LessonNav";
import Toc from "./Toc";

type LessonViewProps = {
  locale: Locale;
  lesson: Lesson;
};

export default async function LessonView({ locale, lesson }: LessonViewProps) {
  const [t, tree, { content, headings }] = await Promise.all([
    getTranslations("Lesson"),
    getNavTree(locale),
    renderMdx(lesson.body, mdxComponents),
  ]);

  const phase = tree.find((item) => item.phase === lesson.phase);
  const navModule = phase?.modules.find((item) => item.slug === lesson.module);
  const isIndex = isIndexSlug(lesson.slug);
  const { prev, next } = findNeighbors(tree, lesson.href);

  const crumbs: BreadcrumbItem[] = [{ label: t("home"), href: "/" }];
  if (phase) crumbs.push({ label: phase.label });
  if (navModule && !isIndex) {
    crumbs.push({ label: navModule.title, href: navModule.href });
  }
  crumbs.push({ label: lesson.title });

  return (
    <div className="page-fade mx-auto w-full max-w-6xl gap-10 px-4 py-6 md:px-8 md:py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem]">
      <article className="w-full max-w-[75ch] min-w-0">
        <Breadcrumb label={t("breadcrumb")} items={crumbs} />
        <header className="mb-6">
          {lesson.type === "exercise" ? (
            <p className="mb-2 inline-block rounded-full border border-border px-3 text-sm font-medium text-text-muted">
              {t("exercise")}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {lesson.title}
          </h1>
        </header>
        {lesson.fallback ? (
          <p
            role="note"
            className="mb-6 rounded-lg border border-warning bg-warning/10 p-3 text-sm"
          >
            {t("fallback")}
          </p>
        ) : null}
        <div
          className="mdx-content"
          lang={lesson.fallback ? routing.defaultLocale : undefined}
        >
          {content}
        </div>
        <LessonNav prev={prev} next={next} />
      </article>
      <Toc title={t("toc")} headings={headings} />
    </div>
  );
}
