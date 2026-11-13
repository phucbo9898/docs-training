import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { countPages, getNavTree } from "@/lib/navigation";
import TrackCard from "./TrackCard";

type TrackChooserContentProps = {
  params: PageProps<"/[locale]">["params"];
};

export default async function TrackChooserContent({
  params,
}: TrackChooserContentProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, tracks] = await Promise.all([
    getTranslations("Tracks"),
    getNavTree(locale),
  ]);

  return (
    <div className="page-fade mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="text-3xl font-bold leading-tight md:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 text-lg text-text-muted">{t("intro")}</p>
      <ul aria-label={t("label")} className="mt-8 grid gap-4 sm:grid-cols-2">
        {tracks.map((track) => {
          const counts = countPages(track);
          return (
            <TrackCard
              key={track.id}
              title={t(`${track.id}.title`)}
              description={t(`${track.id}.description`)}
              meta={t(`${track.id}.meta`, counts)}
              href={track.home}
              cta={t("open")}
            />
          );
        })}
      </ul>
    </div>
  );
}
