import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LoginPanel from "./LoginPanel";

type LoginPageContentProps = {
  params: PageProps<"/[locale]/login">["params"];
  searchParams: PageProps<"/[locale]/login">["searchParams"];
};

export default async function LoginPageContent({
  params,
  searchParams,
}: LoginPageContentProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <div className="page-fade mx-auto w-full max-w-xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-3xl font-bold leading-tight md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-lg text-text-muted">{t("intro")}</p>
      <Suspense
        fallback={
          <p role="status" className="mt-8 text-text-muted">
            {t("loading")}
          </p>
        }
      >
        <LoginPanel locale={locale} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
