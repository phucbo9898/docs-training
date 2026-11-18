import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ExamsHomeContent from "@/components/ExamsHomeContent";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aws-exams">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Exams" });
  return { title: t("title") };
}

export default function ExamsPage({
  params,
}: PageProps<"/[locale]/aws-exams">) {
  return <ExamsHomeContent params={params} />;
}
