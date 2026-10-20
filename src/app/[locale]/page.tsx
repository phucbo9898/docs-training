import { Suspense } from "react";
import HomePageContent from "@/components/HomePageContent";
import PageSkeleton from "@/components/PageSkeleton";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomePageContent params={params} />
    </Suspense>
  );
}
