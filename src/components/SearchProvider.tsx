"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import SearchDialog from "./SearchDialog";
import { useSidebar } from "./SidebarProvider";

type SearchState = {
  openSearch: () => void;
};

const SearchContext = createContext<SearchState | null>(null);

export function useSearch(): SearchState {
  const state = useContext(SearchContext);
  if (!state) throw new Error("useSearch must be used inside SearchProvider");
  return state;
}

/** Nút tìm kiếm đang hiển thị, dùng khi mở bằng Ctrl/Cmd+K lúc chưa focus nút nào. */
function findVisibleTrigger(): HTMLElement | null {
  const triggers = document.querySelectorAll<HTMLElement>(
    "[data-search-trigger]",
  );
  for (const trigger of triggers) {
    if (trigger.checkVisibility({ visibilityProperty: true })) return trigger;
  }
  return null;
}

const SCROLL_WAIT_MS = 5000;

/**
 * Nội dung bài được stream về sau khi route đổi, lúc đó Next đã bỏ qua việc cuộn
 * tới #hash vì heading chưa có trong DOM. Đợi route đổi xong và heading xuất
 * hiện rồi tự cuộn (kiểm tra pathname để không cuộn nhầm heading của trang cũ).
 */
function scrollToHeadingWhenReady(path: string, id: string) {
  const scroll = () => {
    if (window.location.pathname !== path) return false;
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ block: "start" });
    return true;
  };
  if (scroll()) return;

  const observer = new MutationObserver(() => {
    if (scroll()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), SCROLL_WAIT_MS);
}

/** Giữ trạng thái mở, phím tắt Ctrl/Cmd+K và hộp thoại tìm kiếm của cả trang. */
export default function SearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setOpen: setSidebarOpen } = useSidebar();
  const [open, setOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openSearch = useCallback(() => {
    const active = document.activeElement;
    returnFocusRef.current =
      active instanceof HTMLElement && active !== document.body
        ? active
        : findVisibleTrigger();
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    target?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      if (event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      if (!open) openSearch();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openSearch]);

  const navigate = useCallback(
    (url: string) => {
      returnFocusRef.current = null;
      setOpen(false);
      setSidebarOpen(false);
      router.push(url);
      const [path, hash] = url.split("#");
      if (hash) scrollToHeadingWhenReady(path, hash);
    },
    [router, setSidebarOpen],
  );

  const value = useMemo(() => ({ openSearch }), [openSearch]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog open={open} onClose={closeSearch} onNavigate={navigate} />
    </SearchContext.Provider>
  );
}
