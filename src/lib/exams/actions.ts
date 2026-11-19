"use server";

import { findRecentAttempt, insertAttempt } from "@/db/attempts";
import { getExamUser } from "@/lib/auth/session";
import {
  attemptDuration,
  normalizeAnswers,
  submissionSchema,
  toExamId,
} from "./attempt";
import { getExam } from "./load";
import { gradeExam, type ExamGrade } from "./score";
import type { Exam, ExamAnswers } from "./types";

/**
 * Vì sao không lưu được: `signInRequired` là phiên cũ chưa có user id,
 * `failed` là lỗi DB (vd chưa cấu hình `DATABASE_URL`).
 */
export type SaveError = "signInRequired" | "failed";

export type SubmitExamResult =
  | {
      ok: true;
      /** `null`: đã chấm nhưng không lưu được, xem `saveError`. */
      attemptId: number | null;
      saveError: SaveError | null;
      score: number;
      total: number;
      grade: ExamGrade;
      /** Bài đã chấm (đã bỏ câu trống); là bài lần trước nếu bị coi là nộp trùng. */
      answers: ExamAnswers;
      /** Exam mode: đề đầy đủ để chữa đề. Practice mode đã có sẵn nên `null`. */
      exam: Exam | null;
    }
  | { ok: false; error: "unauthorized" | "notFound" | "invalid" };

/**
 * Nộp bài (cả hai chế độ): chấm ở server theo đáp án trong file đề, ghi DB
 * đúng một lần, trả điểm và id lần làm. Lưu là phụ: lưu lỗi vẫn trả kết quả
 * chấm để nộp bài không bị chặn. Server Action là endpoint POST công
 * khai: tự kiểm tra phiên, không dựa vào proxy, không nhận user id hay điểm từ
 * client.
 */
export async function submitExam(input: unknown): Promise<SubmitExamResult> {
  const user = await getExamUser();
  if (!user) return { ok: false, error: "unauthorized" };

  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { source, number, mode, startedAt } = parsed.data;

  const exam = await getExam(source, number);
  if (!exam) return { ok: false, error: "notFound" };

  const answers = normalizeAnswers(exam, parsed.data.answers);
  if (!answers) return { ok: false, error: "invalid" };

  const examId = toExamId(exam.source, exam.number);
  let saved: { id: number; answers: ExamAnswers } | null = null;
  let saveError: SaveError | null = null;
  if (!user.id) {
    // Phiên cũ chưa có id: vẫn chấm, chỉ không lưu được.
    saveError = "signInRequired";
  } else {
    try {
      // Nộp lại trong vài giây (bấm liên tục, gửi lại request): trả lần đã lưu
      // thay vì thêm dòng mới.
      const recent = await findRecentAttempt(user.id, examId, mode);
      if (recent) {
        saved = { id: recent.id, answers: recent.answers };
      } else {
        const grade = gradeExam(exam, answers);
        const id = await insertAttempt({
          userId: user.id,
          examId,
          mode,
          score: grade.score.correct,
          total: grade.score.total,
          answers,
          durationS: attemptDuration(
            mode,
            startedAt,
            Date.now(),
            exam.durationMinutes,
          ),
        });
        saved = { id, answers };
      }
    } catch (error) {
      console.error("submitExam: không lưu được kết quả", error);
      saveError = "failed";
    }
  }

  // Trả đúng bài đã lưu (có thể là lần trước) để điểm và chữa đề khớp lịch sử.
  const finalAnswers = saved?.answers ?? answers;
  const grade = gradeExam(exam, finalAnswers);
  return {
    ok: true,
    attemptId: saved?.id ?? null,
    saveError,
    score: grade.score.correct,
    total: grade.score.total,
    grade,
    answers: finalAnswers,
    exam: mode === "exam" ? exam : null,
  };
}
