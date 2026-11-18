import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import ExamLoading from "./ExamLoading";
import ExamsHomePanel from "./ExamsHomePanel";

type ExamsHomeContentProps = {
  params: PageProps<"/[locale]/aws-exams">["params"];
};

/** Khung tĩnh (tiêu đề, giới thiệu); danh sách đề nằm sau kiểm tra phiên. */
export default async function ExamsHomeContent({
  params,
}: ExamsHomeContentProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Exams");

  return (
    <div className="page-fade">
      <div className="mx-auto w-full max-w-4xl px-4 pt-8 md:px-8 md:pt-12">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-text-muted">{t("intro")}</p>
        <p className="mt-2 text-text-muted">
          {t.rich("reviewLink", {
            link: (chunks) => (
              <Link
                href="/aws-saa-c03"
                className="font-semibold text-primary-text underline underline-offset-2"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
      <Suspense fallback={<ExamLoading />}>
        <ExamsHomePanel locale={locale} />
      </Suspense>
    </div>
  );
}
