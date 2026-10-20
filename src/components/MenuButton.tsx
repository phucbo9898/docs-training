"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "./SidebarProvider";

export default function MenuButton() {
  const t = useTranslations("Header");
  const { open, setOpen, menuButtonRef } = useSidebar();

  return (
    <button
      ref={menuButtonRef}
      type="button"
      aria-label={open ? t("closeMenu") : t("openMenu")}
      aria-expanded={open}
      aria-controls="site-nav"
      onClick={() => setOpen(!open)}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-text hover:bg-bg-subtle md:hidden"
    >
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
