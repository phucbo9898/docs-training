import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import HomeGoals from "@/components/HomeGoals";
import HomeLessons from "@/components/HomeLessons";
import HomeTimeline from "@/components/HomeTimeline";
import HomeWelcome from "@/components/HomeWelcome";
import { routing } from "@/i18n/routing";
import { getNavTree } from "@/lib/navigation";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tree = await getNavTree(locale);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-12 px-4 py-8 md:px-8 md:py-12">
      <HomeWelcome />
      <HomeGoals />
      <HomeTimeline />
      <HomeLessons tree={tree} />
    </div>
  );
}
