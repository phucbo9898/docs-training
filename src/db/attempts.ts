import "server-only";
import { and, avg, count, desc, eq, gt, max, sql } from "drizzle-orm";
import type { ExamAnswers, ExamMode } from "@/lib/exams/types";
import { getDb } from "./index";
import { attempts } from "./schema";

/** Truy vấn bảng `attempts`. Mọi hàm đọc đều lọc theo `userId` của phiên. */

export const HISTORY_PAGE_SIZE = 20;

export type NewAttempt = {
  userId: string;
  examId: string;
  mode: ExamMode;
  score: number;
  total: number;
  answers: ExamAnswers;
  durationS: number | null;
};

export async function insertAttempt(values: NewAttempt): Promise<number> {
  const [row] = await getDb()
    .insert(attempts)
    .values(values)
    .returning({ id: attempts.id });
  if (!row) throw new Error("attempts: insert không trả về id");
  return row.id;
}

/** Cửa sổ chống nộp trùng (bấm liên tục, gửi lại request). */
export const DUPLICATE_WINDOW_S = 5;

export type RecentAttempt = {
  id: number;
  score: number;
  total: number;
  answers: ExamAnswers;
};

/**
 * Lần nộp cùng user + đề + chế độ trong `DUPLICATE_WINDOW_S` giây gần nhất
 * (theo đồng hồ DB). Dùng index (user_id, exam_id, created_at desc). Chỉ chống
 * spam nhẹ: hai request chạy song song đúng lúc vẫn có thể cùng insert.
 */
export async function findRecentAttempt(
  userId: string,
  examId: string,
  mode: ExamMode,
): Promise<RecentAttempt | null> {
  const [row] = await getDb()
    .select({
      id: attempts.id,
      score: attempts.score,
      total: attempts.total,
      answers: attempts.answers,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.examId, examId),
        eq(attempts.mode, mode),
        gt(
          attempts.createdAt,
          sql`now() - make_interval(secs => ${DUPLICATE_WINDOW_S})`,
        ),
      ),
    )
    .orderBy(desc(attempts.createdAt))
    .limit(1);
  return row ?? null;
}

/** Dòng ở trang lịch sử: không có `answers` (cột nặng nhất). */
export type AttemptSummary = {
  id: number;
  examId: string;
  mode: ExamMode;
  score: number;
  total: number;
  durationS: number | null;
  createdAt: Date;
};

function ownedBy(userId: string, mode: ExamMode | null) {
  return mode
    ? and(eq(attempts.userId, userId), eq(attempts.mode, mode))
    : eq(attempts.userId, userId);
}

/**
 * Một trang lịch sử, mới nhất trước. Lấy dư một dòng để biết còn trang sau mà
 * không cần đếm tổng.
 */
export async function listAttempts(
  userId: string,
  mode: ExamMode | null,
  page: number,
): Promise<{ items: AttemptSummary[]; hasNext: boolean }> {
  const rows = await getDb()
    .select({
      id: attempts.id,
      examId: attempts.examId,
      mode: attempts.mode,
      score: attempts.score,
      total: attempts.total,
      durationS: attempts.durationS,
      createdAt: attempts.createdAt,
    })
    .from(attempts)
    .where(ownedBy(userId, mode))
    .orderBy(desc(attempts.createdAt), desc(attempts.id))
    .limit(HISTORY_PAGE_SIZE + 1)
    .offset((page - 1) * HISTORY_PAGE_SIZE);
  return {
    items: rows.slice(0, HISTORY_PAGE_SIZE),
    hasNext: rows.length > HISTORY_PAGE_SIZE,
  };
}

export type AttemptStats = {
  count: number;
  /** Phần trăm đúng trung bình, `null` khi chưa có lần nào. */
  avgPercent: number | null;
  bestPercent: number | null;
};

/** Thống kê bằng aggregate trong SQL, không tải từng dòng. */
export async function attemptStats(
  userId: string,
  mode: ExamMode | null,
): Promise<AttemptStats> {
  const percent = sql<number>`${attempts.score} * 100.0 / nullif(${attempts.total}, 0)`;
  const [row] = await getDb()
    .select({
      count: count(),
      avgPercent: avg(percent),
      bestPercent: max(percent),
    })
    .from(attempts)
    .where(ownedBy(userId, mode));
  const toNumber = (value: string | number | null | undefined) =>
    value === null || value === undefined ? null : Number(value);
  return {
    count: row?.count ?? 0,
    avgPercent: toNumber(row?.avgPercent),
    bestPercent: toNumber(row?.bestPercent),
  };
}

export type AttemptDetail = AttemptSummary & { answers: ExamAnswers };

/** Một lần làm, chỉ khi thuộc về `userId`; không thì `null` (không lộ là có tồn tại). */
export async function getAttempt(
  userId: string,
  id: number,
): Promise<AttemptDetail | null> {
  const [row] = await getDb()
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, id), eq(attempts.userId, userId)))
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    examId: row.examId,
    mode: row.mode,
    score: row.score,
    total: row.total,
    durationS: row.durationS,
    createdAt: row.createdAt,
    answers: row.answers,
  };
}
