"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import type { NavPhase } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBox from "./SearchBox";
import { useSidebar } from "./SidebarProvider";
import SidebarModule from "./SidebarModule";
import ThemeToggle from "./ThemeToggle";

const FOCUS_DELAY_MS = 50;

/**
 * Từ md trở lên là cột cố định (hẹp ở tablet, rộng hơn ở desktop); dưới md là
 * drawer trượt từ trái, ẩn hẳn khi đóng để không nhận focus.
 */
export default function Sidebar({ tree }: { tree: NavPhase[] }) {
  const t = useTranslations("Sidebar");
  const th = useTranslations("Header");
  const pathname = usePathname();
  const { open, setOpen, menuButtonRef } = useSidebar();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Transition của visibility khiến drawer còn "hidden" ở khoảnh khắc đầu, nên đợi chút rồi mới focus.
    const timer = setTimeout(() => closeRef.current?.focus(), FOCUS_DELAY_MS);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, menuButtonRef]);

  // Chọn một trang trong drawer thì đóng drawer.
  function onNavClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      setOpen(false);
    }
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-text/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="site-nav"
        onClick={onNavClick}
        className={`flex flex-col overflow-y-auto border-r border-border bg-bg transition-[transform,visibility] max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-[85vw] max-md:max-w-xs md:sticky md:top-16 md:h-[calc(100dvh-4rem)] md:w-56 md:shrink-0 lg:w-64 ${
          open ? "" : "max-md:invisible max-md:-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 p-3 md:hidden">
          <div className="min-w-0 flex-1">
            <SearchBox />
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label={th("closeMenu")}
            onClick={() => {
              setOpen(false);
              menuButtonRef.current?.focus();
            }}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-text hover:bg-bg-subtle"
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
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label={t("label")} className="flex-1 space-y-5 p-3">
          {tree.map((phase) => (
            <section key={phase.phase} aria-label={phase.label}>
              <h2 className="px-3 text-xs font-bold tracking-wide text-text-muted uppercase">
                {phase.label}
                {phase.title ? ` · ${phase.title}` : ""}
              </h2>
              <div className="mt-1 space-y-1">
                {phase.modules.map((module) => (
                  <SidebarModule
                    key={module.slug}
                    module={module}
                    pathname={pathname}
                  />
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div
          role="group"
          aria-label={t("settings")}
          className="flex flex-wrap items-center gap-3 border-t border-border p-3 md:hidden"
        >
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
