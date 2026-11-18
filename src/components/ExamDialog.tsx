"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ExamDialogProps = {
  open: boolean;
  onClose: () => void;
  /** id của tiêu đề bên trong, dùng cho aria-labelledby. */
  labelledBy: string;
  /** "center": hộp thoại giữa màn hình; "drawer": trượt từ phải (mobile). */
  variant?: "center" | "drawer";
  children: ReactNode;
};

/**
 * `<dialog>` gốc mở bằng showModal(): có sẵn focus trap, Esc để đóng và trả
 * focus về nút đã mở.
 */
export default function ExamDialog({
  open,
  onClose,
  labelledBy,
  variant = "center",
  children,
}: ExamDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        // Bấm ra vùng nền (chính phần tử dialog) thì đóng.
        if (event.target === event.currentTarget) onClose();
      }}
      className={`bg-bg text-text backdrop:bg-text/40 ${
        variant === "drawer"
          ? "m-0 ml-auto h-dvh max-h-dvh w-[85vw] max-w-sm border-l border-border"
          : "m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-border"
      }`}
    >
      {open ? children : null}
    </dialog>
  );
}
