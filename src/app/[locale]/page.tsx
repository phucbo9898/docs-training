import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  // Tạm thời: bố cục đầy đủ (Header, nội dung trang chủ) làm ở bước 4.
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-end gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-text-muted">{t("welcome.intro")}</p>
    </main>
  );
}
