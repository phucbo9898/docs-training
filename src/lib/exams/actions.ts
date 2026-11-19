"use server";

import { insertAttempt } from "@/db/attempts";
import { getExamUser } from "@/lib/auth/session";
import {
  attemptDuration,
  normalizeAnswers,
  submissionSchema,
  toExamId,
} from "./attempt";
import { getExam } from "./load";
import { gradeExam, type ExamGrade } from "./score";
import type { Exam } from "./types";

export type SubmitExamResult =
  | {
      ok: true;
      attemptId: number;
      score: number;
      total: number;
      grade: ExamGrade;
      /** Exam mode: đề đầy đủ để chữa đề. Practice mode đã có sẵn nên `null`. */
      exam: Exam | null;
    }
  | { ok: false; error: "unauthorized" | "notFound" | "invalid" | "failed" };

/**
 * Nộp bài (cả hai chế độ): chấm ở server theo đáp án trong file đề, ghi DB
 * đúng một lần, trả điểm và id lần làm. Server Action là endpoint POST công
 * khai: tự kiểm tra phiên, không dựa vào proxy, không nhận user id hay điểm từ
 * client.
 */
export async function submitExam(input: unknown): Promise<SubmitExamResult> {
  const user = await getExamUser();
  // Phiên cũ chưa có id: coi như chưa đăng nhập để người dùng đăng nhập lại.
  if (!user?.id) return { ok: false, error: "unauthorized" };

  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { source, number, mode, startedAt } = parsed.data;

  const exam = await getExam(source, number);
  if (!exam) return { ok: false, error: "notFound" };

  const answers = normalizeAnswers(exam, parsed.data.answers);
  if (!answers) return { ok: false, error: "invalid" };

  const grade = gradeExam(exam, answers);
  try {
    const attemptId = await insertAttempt({
      userId: user.id,
      examId: toExamId(exam.source, exam.number),
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
    return {
      ok: true,
      attemptId,
      score: grade.score.correct,
      total: grade.score.total,
      grade,
      exam: mode === "exam" ? exam : null,
    };
  } catch (error) {
    console.error("submitExam: không lưu được kết quả", error);
    return { ok: false, error: "failed" };
  }
}
