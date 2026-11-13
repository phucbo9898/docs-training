"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavTrack } from "@/lib/navigation";

type SidebarTrackHeaderProps = {
  track: NavTrack;
  /** Pathname hiện tại, không kèm locale. */
  pathname: string;
};

/** Đầu sidebar khi đang ở trong một track: quay về màn chọn và tên track. */
export default function SidebarTrackHeader({
  track,
  pathname,
}: SidebarTrackHeaderProps) {
  const t = useTranslations("Tracks");
  const active = pathname === track.home;

  return (
    <div className="space-y-1 border-b border-border pb-3">
      <Link
        href="/"
        className="flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm text-text-muted hover:bg-bg-subtle hover:text-text"
      >
        <span aria-hidden="true">←</span>
        {t("all")}
      </Link>
      <Link
        href={track.home}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 items-center rounded-md px-3 py-2 font-bold leading-snug hover:bg-bg-subtle ${
          active ? "text-primary-text" : "text-text"
        }`}
      >
        {t(`${track.id}.title`)}
      </Link>
    </div>
  );
}
