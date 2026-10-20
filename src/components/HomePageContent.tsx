import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getNavTree } from "@/lib/navigation";
import HomeGoals from "./HomeGoals";
import HomeLessons from "./HomeLessons";
import HomeTimeline from "./HomeTimeline";
import HomeWelcome from "./HomeWelcome";

type HomePageContentProps = {
  params: PageProps<"/[locale]">["params"];
};

export default async function HomePageContent({
  params,
}: HomePageContentProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tree = await getNavTree(locale);

  return (
    <div className="page-fade mx-auto w-full max-w-4xl space-y-12 px-4 py-8 md:px-8 md:py-12">
      <HomeWelcome />
      <HomeGoals />
      <HomeTimeline />
      <HomeLessons tree={tree} />
    </div>
  );
}
