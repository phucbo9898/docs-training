import { sql } from "drizzle-orm";
import {
  bigserial,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { ExamAnswers, ExamMode } from "../lib/exams/types";

/**
 * Mỗi dòng là một lần nộp bài. Nội dung đề không nằm ở đây (vẫn là file JSON),
 * chỉ lưu đáp án người dùng chọn để chữa lại khi xem chi tiết.
 */
export const attempts = pgTable(
  "attempts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    /** Google `sub` (ổn định), không dùng email. */
    userId: text("user_id").notNull(),
    /** Dạng "bo-1/3": `<source>/<number>`. */
    examId: text("exam_id").notNull(),
    mode: text("mode").$type<ExamMode>().notNull().default("exam"),
    score: smallint("score").notNull(),
    total: smallint("total").notNull(),
    /** Chỉ câu đã chọn, luôn là mảng: `{ "bo-1-3-07": ["b"] }`. */
    answers: jsonb("answers").$type<ExamAnswers>().notNull(),
    durationS: integer("duration_s"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("attempts_user_exam_created_idx").on(
      table.userId,
      table.examId,
      table.createdAt.desc(),
    ),
    check("attempts_mode_check", sql`${table.mode} in ('practice', 'exam')`),
  ],
);

export type Attempt = typeof attempts.$inferSelect;
