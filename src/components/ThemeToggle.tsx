"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactElement } from "react";

type ThemeValue = "light" | "dark" | "system";

type ThemeOption = {
  value: ThemeValue;
  icon: ReactElement;
};

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const OPTIONS: ThemeOption[] = [
  {
    value: "light",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    icon: (
      <svg {...iconProps}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    value: "system",
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

const subscribe = () => () => {};

export default function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { theme, setTheme } = useTheme();
  // Theme chỉ biết ở client; trước khi mount không đánh dấu nút nào để tránh lệch hydration.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center rounded-lg border border-border bg-bg-subtle p-0.5"
    >
      {OPTIONS.map(({ value, icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={t(value)}
            title={t(value)}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={`inline-flex size-11 items-center justify-center rounded-md transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-text-muted hover:text-text"
            }`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
