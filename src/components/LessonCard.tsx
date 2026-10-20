import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/lib/navigation";

/** Cả thẻ bấm được nhờ link phủ kín (after:absolute), nhưng chỉ có một link để đọc/tab. */
export default function LessonCard({ item }: { item: NavItem }) {
  const t = useTranslations("Lesson");

  return (
    <li className="relative flex flex-col gap-2 rounded-lg border border-border p-4 focus-within:border-primary hover:border-primary hover:bg-bg-subtle">
      <h4 className="font-semibold">
        <Link
          href={item.href}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {item.title}
        </Link>
      </h4>
      {item.summary ? (
        <p className="text-sm text-text-muted">{item.summary}</p>
      ) : null}
      {item.type === "exercise" ? (
        <span className="mt-auto self-start rounded-full border border-border px-2 text-xs font-medium text-text-muted">
          {t("exercise")}
        </span>
      ) : null}
    </li>
  );
}
