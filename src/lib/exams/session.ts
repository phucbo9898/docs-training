import type { ExamAnswers, ExamMode } from "./types";

/** Bài đang làm dở, lưu ở sessionStorage để refresh không mất. */
export type ExamProgress = {
  answers: ExamAnswers;
  /** Id các câu đã đánh dấu. */
  marked: string[];
  /** Practice mode: id các câu đã bấm "Kiểm tra đáp án" (đã hiện đúng/sai). */
  checked: string[];
  /** Mốc bắt đầu (ms), đồng hồ Exam mode tính từ đây. */
  startedAt: number;
  /** Chỉ số câu đang xem (0-based). */
  current: number;
};

export function progressKey(
  source: string,
  number: number,
  mode: ExamMode,
): string {
  return `exam:${source}:${number}:${mode}`;
}

export function newProgress(): ExamProgress {
  return {
    answers: {},
    marked: [],
    checked: [],
    startedAt: Date.now(),
    current: 0,
  };
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

/** Bản lưu cũ chưa có `checked`: vẫn hợp lệ, đọc vào thì coi như rỗng. */
function isProgress(
  value: unknown,
): value is Omit<ExamProgress, "checked"> & { checked?: string[] } {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  const answers = data.answers;
  return (
    typeof answers === "object" &&
    answers !== null &&
    !Array.isArray(answers) &&
    Object.values(answers).every(isStringArray) &&
    isStringArray(data.marked) &&
    (data.checked === undefined || isStringArray(data.checked)) &&
    typeof data.startedAt === "number" &&
    Number.isFinite(data.startedAt) &&
    typeof data.current === "number" &&
    Number.isInteger(data.current) &&
    data.current >= 0
  );
}

/** Đọc bài làm dở; storage bị chặn hoặc dữ liệu hỏng thì coi như chưa có. */
export function loadProgress(key: string): ExamProgress | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    return isProgress(data) ? { ...data, checked: data.checked ?? [] } : null;
  } catch {
    return null;
  }
}

export function saveProgress(key: string, progress: ExamProgress): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Storage đầy hoặc bị chặn: bỏ qua, bài vẫn làm tiếp được trong trang.
  }
}

export function clearProgress(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Như trên.
  }
}
