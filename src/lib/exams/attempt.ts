import { z } from "zod";
import {
  EXAM_MODES,
  type Exam,
  type ExamAnswers,
  type ExamMode,
} from "./types";

/**
 * Hàm thuần cho việc lưu kết quả: id đề, kiểm tra bài nộp, thời lượng. Không
 * đọc file hay DB nên test được và dùng chung server/client.
 */

/** `exam_id` trong DB: "bo-1/3". */
export function toExamId(source: string, number: number): string {
  return `${source}/${number}`;
}

const EXAM_ID = /^([a-z0-9-]+)\/([1-9][0-9]*)$/;

export function parseExamId(
  examId: string,
): { source: string; number: number } | null {
  const match = EXAM_ID.exec(examId);
  if (!match?.[1] || !match[2]) return null;
  return { source: match[1], number: Number(match[2]) };
}

/** Giới hạn thô trước khi đối chiếu với đề, để payload bất thường bị loại sớm. */
const MAX_QUESTIONS = 500;
const ID = z.string().min(1).max(64);

export const examModeSchema = z.enum(EXAM_MODES);

export const submissionSchema = z.object({
  source: z
    .string()
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  number: z.number().int().positive().max(10_000),
  mode: examModeSchema,
  answers: z
    .record(ID, z.array(ID).max(10))
    .refine((value) => Object.keys(value).length <= MAX_QUESTIONS),
  /** Mốc bắt đầu (ms) theo đồng hồ trình duyệt, chỉ dùng để tính thời lượng. */
  startedAt: z.number().finite(),
});

export type Submission = z.infer<typeof submissionSchema>;

/**
 * Đối chiếu bài nộp với đề: câu phải thuộc đề, lựa chọn phải thuộc câu, không
 * trùng, không chọn quá số đáp án cần chọn. Bỏ câu trống. Sai thì `null`.
 */
export function normalizeAnswers(
  exam: Pick<Exam, "questions">,
  answers: ExamAnswers,
): ExamAnswers | null {
  const byId = new Map(exam.questions.map((q) => [q.id, q]));
  const result: ExamAnswers = {};
  for (const [questionId, picked] of Object.entries(answers)) {
    const question = byId.get(questionId);
    if (!question) return null;
    if (picked.length === 0) continue;
    if (new Set(picked).size !== picked.length) return null;
    if (picked.length > question.selectCount) return null;
    const options = new Set(question.options.map((option) => option.id));
    if (!picked.every((id) => options.has(id))) return null;
    result[questionId] = [...picked];
  }
  return result;
}

const PRACTICE_MAX_S = 24 * 60 * 60;

/**
 * Thời lượng (giây). Exam mode: chặn trong [0, thời lượng đề], nên bài nộp sau
 * khi hết giờ tính đúng bằng thời lượng tối đa. Practice mode không giới hạn
 * giờ: quá một ngày (bỏ dở rồi quay lại) thì coi như không đo được.
 */
export function attemptDuration(
  mode: ExamMode,
  startedAt: number,
  now: number,
  durationMinutes: number,
): number | null {
  const elapsed = Math.max(0, Math.round((now - startedAt) / 1000));
  if (mode === "exam") return Math.min(elapsed, durationMinutes * 60);
  return elapsed <= PRACTICE_MAX_S ? elapsed : null;
}
