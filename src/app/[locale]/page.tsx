import { Suspense } from "react";
import PageSkeleton from "@/components/PageSkeleton";
import TrackChooserContent from "@/components/TrackChooserContent";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TrackChooserContent params={params} />
    </Suspense>
  );
}
