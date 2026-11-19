import { isExamMode, type ExamMode } from "./types";

/** Đọc query của trang lịch sử; giá trị lạ thì về mặc định, không báo lỗi. */

type QueryValue = string | string[] | undefined;

function first(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const MAX_PAGE = 1000;

export function parseHistoryQuery(query: Record<string, QueryValue>): {
  mode: ExamMode | null;
  page: number;
} {
  const mode = first(query.mode);
  const page = Number(first(query.page));
  return {
    mode: isExamMode(mode) ? mode : null,
    page: Number.isInteger(page) && page >= 1 && page <= MAX_PAGE ? page : 1,
  };
}

/** Thống kê mặc định chỉ tính Exam mode; đang lọc Practice thì tính Practice. */
export function statsMode(filter: ExamMode | null): ExamMode {
  return filter === "practice" ? "practice" : "exam";
}

/** Id lần làm trong URL: số nguyên dương, nằm trong miền bigserial an toàn với JS. */
export function parseAttemptId(value: string): number | null {
  if (!/^[1-9][0-9]{0,14}$/.test(value)) return null;
  return Number(value);
}

/** Phần trăm đúng, làm tròn xuống như `scoreExam`. */
export function scorePercent(score: number, total: number): number {
  return total === 0 ? 0 : Math.floor((score * 100) / total);
}
