import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import ExamPageContent from "@/components/ExamPageContent";
import { routing } from "@/i18n/routing";
import { findExamEntry, getExamIndex } from "@/lib/exams/load";

export async function generateStaticParams() {
  const index = await getExamIndex();
  return routing.locales.flatMap((locale) =>
    index.sources.flatMap((source) =>
      source.exams.map((exam) => ({
        locale,
        source: source.id,
        exam: String(exam.number),
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aws-exams/[source]/[exam]">): Promise<Metadata> {
  const { locale, source, exam } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const found = findExamEntry(await getExamIndex(), source, Number(exam));
  return found ? { title: found.entry.title } : {};
}

export default function ExamPage({
  params,
}: PageProps<"/[locale]/aws-exams/[source]/[exam]">) {
  return <ExamPageContent params={params} />;
}
