"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavTrack } from "@/lib/navigation";
import { findTrackByPath } from "@/lib/track-path";

type HeaderTitleProps = {
  tracks: NavTrack[];
};

/**
 * Tiêu đề trên header đổi theo track đang xem; ở màn chọn track thì là tên
 * chung của site. Bấm vào để về trang chủ của track đó.
 */
export default function HeaderTitle({ tracks }: HeaderTitleProps) {
  const t = useTranslations("Header");
  const tt = useTranslations("Tracks");
  const pathname = usePathname();
  const track = findTrackByPath(tracks, pathname);

  return (
    <Link
      href={track?.home ?? "/"}
      className="inline-flex min-h-11 min-w-0 shrink items-center rounded-md font-bold text-text"
    >
      <span className="line-clamp-2 min-w-0 text-sm leading-tight sm:line-clamp-none sm:block sm:truncate sm:text-base">
        {track ? tt(`${track.id}.title`) : t("siteName")}
      </span>
    </Link>
  );
}
