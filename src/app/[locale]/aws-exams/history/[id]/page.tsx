import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ExamAttemptPanel from "@/components/ExamAttemptPanel";
import ExamLoading from "@/components/ExamLoading";
import { routing } from "@/i18n/routing";
import { trackPageTitle } from "@/lib/page-title";

// Như trang đề: `id` chỉ có lúc request, nên cho route này chờ server thay vì
// prerender layout dùng chung (xem `aws-exams/[source]/[exam]/page.tsx`).
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aws-exams/history/[id]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "History" });
  return { title: await trackPageTitle(locale, "exams", t("title")) };
}

export default function ExamAttemptPage({
  params,
}: PageProps<"/[locale]/aws-exams/history/[id]">) {
  return (
    <Suspense fallback={<ExamLoading />}>
      <ExamAttemptPanel params={params} />
    </Suspense>
  );
}
