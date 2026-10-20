import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SidebarProvider from "@/components/SidebarProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import { getNavTree } from "@/lib/navigation";
import "@/styles/globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: { default: t("siteName"), template: `%s | ${t("siteName")}` },
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Chỉ gửi xuống client các chuỗi mà Client Component dùng.
  const {
    ThemeToggle,
    LanguageSwitcher,
    Header: header,
    Search,
    Sidebar: sidebar,
    CodeBlock,
  } = await getMessages();
  const [tree, tc] = await Promise.all([
    getNavTree(locale),
    getTranslations("Common"),
  ]);

  return (
    // Không đặt className/style cho <html>: next-themes quản lý class `dark` ở đó,
    // nếu React ghi lại khi layout remount (đổi locale) thì theme bị nháy về sáng.
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} ${geistMono.variable} flex min-h-full flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider
            messages={{
              ThemeToggle,
              LanguageSwitcher,
              Header: header,
              Search,
              Sidebar: sidebar,
              CodeBlock,
            }}
          >
            <SidebarProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
              >
                {tc("skipToContent")}
              </a>
              <Header />
              <div className="mx-auto flex w-full max-w-[90rem] flex-1">
                <Sidebar tree={tree} />
                <main id="main" className="min-w-0 flex-1">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
