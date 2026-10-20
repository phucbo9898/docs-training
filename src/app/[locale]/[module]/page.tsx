import { hasLocale } from "next-intl";
import { Suspense } from "react";
import type { Metadata } from "next";
import ModulePageContent from "@/components/ModulePageContent";
import PageSkeleton from "@/components/PageSkeleton";
import { routing } from "@/i18n/routing";
import { getAllLessons, getLesson, isIndexSlug } from "@/lib/content";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const lessons = await getAllLessons(locale);
      return lessons
        .filter((lesson) => isIndexSlug(lesson.slug))
        .map((lesson) => ({ locale, module: lesson.module }));
    }),
  );
  return perLocale.flat();
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[module]">): Promise<Metadata> {
  const { locale, module } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const lesson = await getLesson(locale, module, "index");
  return lesson ? { title: lesson.title } : {};
}

export default function ModulePage({
  params,
}: PageProps<"/[locale]/[module]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ModulePageContent params={params} />
    </Suspense>
  );
}
