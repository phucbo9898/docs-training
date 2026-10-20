import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getLesson, isIndexSlug } from "@/lib/content";
import LessonView from "./LessonView";

type LessonPageContentProps = {
  params: PageProps<"/[locale]/[module]/[lesson]">["params"];
};

export default async function LessonPageContent({
  params,
}: LessonPageContentProps) {
  const { locale, module, lesson: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // `index` là trang tổng quan, chỉ truy cập qua /[locale]/[module].
  if (isIndexSlug(slug)) notFound();
  const lesson = await getLesson(locale, module, slug);
  if (!lesson) notFound();

  return <LessonView locale={locale} lesson={lesson} />;
}
