import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import LessonPageContent from "@/components/LessonPageContent";
import { routing } from "@/i18n/routing";
import { getAllLessons, getLesson, isIndexSlug } from "@/lib/content";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const lessons = await getAllLessons(locale);
      return lessons
        .filter((lesson) => !isIndexSlug(lesson.slug))
        .map((lesson) => ({
          locale,
          module: lesson.module,
          lesson: lesson.slug,
        }));
    }),
  );
  return perLocale.flat();
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[module]/[lesson]">): Promise<Metadata> {
  const { locale, module, lesson: slug } = await params;
  if (!hasLocale(routing.locales, locale) || isIndexSlug(slug)) return {};
  const lesson = await getLesson(locale, module, slug);
  return lesson ? { title: lesson.title } : {};
}

export default function LessonPage({
  params,
}: PageProps<"/[locale]/[module]/[lesson]">) {
  return <LessonPageContent params={params} />;
}
