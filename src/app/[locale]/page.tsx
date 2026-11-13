import TrackChooserContent from "@/components/TrackChooserContent";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  return <TrackChooserContent params={params} />;
}
