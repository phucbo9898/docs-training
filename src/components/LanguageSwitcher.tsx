"use client";

import { useTransition, type MouseEvent } from "react";
import { useLocale, useTranslations, type Locale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Click thường: chuyển trong transition để giữ UI cũ tới khi trang mới sẵn sàng.
  // Click có phím bổ trợ (mở tab mới...) để trình duyệt xử lý theo link.
  function onSwitch(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    if (target === locale || pending) return;
    startTransition(() => router.replace(pathname, { locale: target }));
  }

  return (
    <nav aria-label={t("label")} aria-busy={pending}>
      <ul
        className={`inline-flex items-center rounded-lg border border-border bg-bg-subtle p-0.5 transition-opacity ${
          pending ? "opacity-70" : ""
        }`}
      >
        {routing.locales.map((target) => {
          const active = target === locale;
          return (
            <li key={target}>
              <Link
                href={pathname}
                locale={target}
                lang={target}
                hrefLang={target}
                onClick={(event) => onSwitch(event, target)}
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
