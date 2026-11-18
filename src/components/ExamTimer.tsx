"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type ExamTimerProps = {
  /** Mốc hết giờ (ms). Tính từ startedAt nên vẫn đúng sau khi đổi tab hay refresh. */
  deadline: number;
  onExpire: () => void;
};

const TICK_MS = 1000;
const MINUTE_MS = 60_000;

function now(): number {
  return Date.now();
}

function format(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Đồng hồ đếm ngược của Exam mode; hết giờ gọi `onExpire` để tự nộp. */
export default function ExamTimer({ deadline, onExpire }: ExamTimerProps) {
  const t = useTranslations("Exams");
  const [current, setCurrent] = useState(now);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(now()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const remaining = Math.max(0, deadline - current);

  useEffect(() => {
    if (remaining === 0) onExpire();
  }, [remaining, onExpire]);

  const low = remaining < 5 * MINUTE_MS;

  return (
    <div
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 font-semibold tabular-nums ${
        low ? "border-danger text-danger" : "border-border text-text"
      }`}
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />
      </svg>
      <span aria-hidden="true">{format(remaining)}</span>
      {/* Chỉ đổi mỗi phút nên trình đọc màn hình không bị đọc liên tục. */}
      <span className="sr-only" aria-live="polite">
        {t("timeLeft", { minutes: Math.ceil(remaining / MINUTE_MS) })}
      </span>
    </div>
  );
}
