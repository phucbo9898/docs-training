"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavTrack } from "@/lib/navigation";

type SidebarTrackLinksProps = {
  tracks: NavTrack[];
};

/** Sidebar ở màn chọn track: chỉ liệt kê các track. */
export default function SidebarTrackLinks({ tracks }: SidebarTrackLinksProps) {
  const t = useTranslations("Tracks");

  return (
    <section aria-labelledby="sidebar-tracks-heading">
      <h2
        id="sidebar-tracks-heading"
        className="px-3 text-xs font-bold tracking-wide text-text-muted uppercase"
      >
        {t("label")}
      </h2>
      <ul className="mt-1 space-y-1">
        {tracks.map((track) => (
          <li key={track.id}>
            <Link
              href={track.home}
              className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold leading-snug text-text hover:bg-bg-subtle"
            >
              {t(`${track.id}.title`)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
