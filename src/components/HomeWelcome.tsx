import { useTranslations } from "next-intl";

export default function HomeWelcome() {
  const t = useTranslations("Home");
  const items = [0, 1, 2] as const;

  return (
    <section aria-labelledby="welcome-heading">
      <h1 id="welcome-heading" className="text-3xl font-bold md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-text-muted">{t("welcome.intro")}</p>
      <p className="mt-4 font-semibold">{t("welcome.listIntro")}</p>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        {items.map((index) => (
          <li key={index}>{t(`welcome.items.${index}`)}</li>
        ))}
      </ul>
    </section>
  );
}
