import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import ExamsHomeContent from "@/components/ExamsHomeContent";
import { routing } from "@/i18n/routing";
import { trackPageTitle } from "@/lib/page-title";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aws-exams">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { title: await trackPageTitle(locale, "exams") };
}

export default function ExamsPage({
  params,
}: PageProps<"/[locale]/aws-exams">) {
  return <ExamsHomeContent params={params} />;
}
