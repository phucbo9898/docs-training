import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import TrainingPageContent from "@/components/TrainingPageContent";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/training">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Tracks" });
  return { title: t("backend.title") };
}

export default function TrainingPage({
  params,
}: PageProps<"/[locale]/training">) {
  return <TrainingPageContent params={params} />;
}
