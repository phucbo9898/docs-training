"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type SidebarState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Nút mở menu, để trả focus về khi đóng drawer. */
  menuButtonRef: RefObject<HTMLButtonElement | null>;
};

const SidebarContext = createContext<SidebarState | null>(null);

export function useSidebar(): SidebarState {
  const state = useContext(SidebarContext);
  if (!state) throw new Error("useSidebar must be used inside SidebarProvider");
  return state;
}

export default function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const value = useMemo(() => ({ open, setOpen, menuButtonRef }), [open]);

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
