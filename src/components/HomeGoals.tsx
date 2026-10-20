import { Fragment } from "react";
import { useTranslations } from "next-intl";

const TAG = /<strong>(.*?)<\/strong>/g;

/** Chuỗi giao diện chỉ dùng thẻ `<strong>`: tách ra thành phần tử, không đưa HTML thô vào DOM. */
function withStrong(text: string) {
  const parts: Array<string | { strong: string }> = [];
  let last = 0;
  for (const match of text.matchAll(TAG)) {
    parts.push(text.slice(last, match.index), { strong: match[1] });
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));

  return parts.map((part, index) =>
    typeof part === "string" ? (
      <Fragment key={index}>{part}</Fragment>
    ) : (
      <strong key={index} className="font-semibold text-primary">
        {part.strong}
      </strong>
    ),
  );
}

export default function HomeGoals() {
  const t = useTranslations("Home");
  const items = [0, 1, 2, 3, 4] as const;

  return (
    <section aria-labelledby="goals-heading">
      <h2 id="goals-heading" className="text-2xl font-bold">
        {t("goals.heading")}
      </h2>
      <p className="mt-3 text-text-muted">{t("goals.listIntro")}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((index) => (
          <li
            key={index}
            className="rounded-lg border border-border bg-bg-subtle p-4"
          >
            {withStrong(t.raw(`goals.items.${index}`))}
          </li>
        ))}
      </ul>
    </section>
  );
}
