import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

type CalloutType = "info" | "tip" | "warning" | "danger";

type CalloutProps = {
  type?: CalloutType;
  /** Mặc định lấy theo `type`. */
  title?: string;
  /** Emoji/biểu tượng thay cho icon mặc định (ví dụ icon của khối Notion). */
  icon?: string;
  children: ReactNode;
};

const STYLES: Record<CalloutType, string> = {
  info: "border-primary bg-primary/10 text-primary",
  tip: "border-success bg-success/10 text-success",
  warning: "border-warning bg-warning/10 text-warning",
  danger: "border-danger bg-danger/10 text-danger",
};

const ICONS: Record<CalloutType, string> = {
  info: "M12 16v-4M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  tip: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z",
  warning:
    "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  danger:
    "M12 8v4M12 16h.01M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9L7.9 2z",
};

export default function Callout({
  type = "info",
  title,
  icon,
  children,
}: CalloutProps) {
  const t = useTranslations("Callout");

  return (
    <aside
      className={`my-6 rounded-lg border-l-4 p-4 ${STYLES[type]}`}
      aria-label={title ?? t(type)}
    >
      <p className="mb-1 flex items-center gap-2 font-semibold">
        {icon ? (
          <span aria-hidden="true">{icon}</span>
        ) : (
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={ICONS[type]} />
          </svg>
        )}
        {title ?? t(type)}
      </p>
      <div className="text-text [&>*+*]:mt-3">{children}</div>
    </aside>
  );
}
