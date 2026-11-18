import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import TrainingPageContent from "@/components/TrainingPageContent";
import { routing } from "@/i18n/routing";
import { trackPageTitle } from "@/lib/page-title";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/training">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { title: await trackPageTitle(locale, "backend") };
}

export default function TrainingPage({
  params,
}: PageProps<"/[locale]/training">) {
  return <TrainingPageContent params={params} />;
}
