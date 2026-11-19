import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ExamHistoryPanel from "./ExamHistoryPanel";
import ExamLoading from "./ExamLoading";

type ExamHistoryContentProps = {
  params: PageProps<"/[locale]/aws-exams/history">["params"];
  searchParams: PageProps<"/[locale]/aws-exams/history">["searchParams"];
};

/** Khung tĩnh (tiêu đề); dữ liệu lịch sử nằm sau Suspense và kiểm tra phiên. */
export default async function ExamHistoryContent({
  params,
  searchParams,
}: ExamHistoryContentProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("History");

  return (
    <div className="page-fade">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-text-muted">{t("intro")}</p>
      </div>
      <Suspense fallback={<ExamLoading />}>
        <ExamHistoryPanel locale={locale} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
