"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavModule } from "@/lib/navigation";

type SidebarModuleProps = {
  module: NavModule;
  /** Pathname hiện tại, không kèm locale. */
  pathname: string;
};

const linkBase =
  "flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm leading-snug";

function linkClass(active: boolean): string {
  return `${linkBase} ${
    active
      ? "bg-primary/10 font-semibold text-primary"
      : "text-text-muted hover:bg-bg-subtle hover:text-text"
  }`;
}

export default function SidebarModule({
  module,
  pathname,
}: SidebarModuleProps) {
  const t = useTranslations("Sidebar");
  const overviewActive = pathname === module.href;
  const hasActive =
    overviewActive || module.items.some((item) => item.href === pathname);

  return (
    <details open={hasActive} className="group">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold leading-snug text-text hover:bg-bg-subtle [&::-webkit-details-marker]:hidden">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 transition-transform group-open:rotate-90"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        {module.title}
      </summary>
      <ul className="ml-4 border-l border-border pl-2">
        <li>
          <Link
            href={module.href}
            aria-current={overviewActive ? "page" : undefined}
            className={linkClass(overviewActive)}
          >
            {t("overview")}
          </Link>
        </li>
        {module.items.map((item) => {
          const active = item.href === pathname;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                <span className="min-w-0 flex-1">{item.title}</span>
                {item.type === "exercise" ? (
                  <span className="shrink-0 rounded-full border border-border px-2 text-xs font-medium text-text-muted">
                    {t("exercise")}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
