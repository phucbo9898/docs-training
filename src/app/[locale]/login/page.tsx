import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import LoginPageContent from "@/components/LoginPageContent";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("title") };
}

export default function LoginPage({
  params,
  searchParams,
}: PageProps<"/[locale]/login">) {
  return <LoginPageContent params={params} searchParams={searchParams} />;
}
