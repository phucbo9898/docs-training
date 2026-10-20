import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getLesson } from "@/lib/content";
import LessonView from "./LessonView";

type ModulePageContentProps = {
  params: PageProps<"/[locale]/[module]">["params"];
};

export default async function ModulePageContent({
  params,
}: ModulePageContentProps) {
  const { locale, module } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const lesson = await getLesson(locale, module, "index");
  if (!lesson) notFound();

  return <LessonView locale={locale} lesson={lesson} />;
}
