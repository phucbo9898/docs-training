import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import ExamPageContent from "@/components/ExamPageContent";
import { routing } from "@/i18n/routing";
import { findExamEntry, getExamIndex } from "@/lib/exams/load";
import { trackPageTitle } from "@/lib/page-title";

// Không có generateStaticParams: trang đề render theo request, sau kiểm tra phiên.
// `source`/`exam` vì thế chỉ có lúc request, nên `usePathname()` của layout
// (Sidebar, LanguageSwitcher) không prerender được: cho phép route này chờ
// server thay vì bọc layout dùng chung trong Suspense.
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/aws-exams/[source]/[exam]">): Promise<Metadata> {
  const { locale, source, exam } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  // Tiêu đề đề lấy từ index (công khai ở sidebar), không đọc nội dung đề.
  const found = findExamEntry(await getExamIndex(), source, Number(exam));
  return found
    ? { title: await trackPageTitle(locale, "exams", found.entry.title) }
    : {};
}

export default function ExamPage({
  params,
  searchParams,
}: PageProps<"/[locale]/aws-exams/[source]/[exam]">) {
  return <ExamPageContent params={params} searchParams={searchParams} />;
}
