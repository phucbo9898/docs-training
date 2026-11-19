import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ExamHistoryContent from "@/components/ExamHistoryContent";
import { routing } from "@/i18n/routing";
import { trackPageTitle } from "@/lib/page-title";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aws-exams/history">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "History" });
  return { title: await trackPageTitle(locale, "exams", t("title")) };
}

export default function ExamHistoryPage({
  params,
  searchParams,
}: PageProps<"/[locale]/aws-exams/history">) {
  return <ExamHistoryContent params={params} searchParams={searchParams} />;
}
