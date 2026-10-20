"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")}>
      <ul className="inline-flex items-center rounded-lg border border-border bg-bg-subtle p-0.5">
        {routing.locales.map((target) => {
          const active = target === locale;
          return (
            <li key={target}>
              <Link
                href={pathname}
                locale={target}
                lang={target}
                hrefLang={target}
                aria-current={active ? "true" : undefined}
                className={`inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 whitespace-nowrap text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {t(target)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
