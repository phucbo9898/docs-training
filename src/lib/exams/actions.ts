"use server";

import { getExamUser } from "@/lib/auth/session";
import { isExamAnswers } from "./guards";
import { getExam } from "./load";
import { gradeExam, type ExamGrade } from "./score";
import type { Exam } from "./types";

export type SubmitExamResult =
  | { ok: true; exam: Exam; grade: ExamGrade }
  | { ok: false; error: "unauthorized" | "notFound" | "invalid" };

/**
 * Nộp bài Exam mode: client chưa có đáp án nên chấm ở server, rồi trả đề đầy
 * đủ (đáp án, giải thích) để hiện màn kết quả và chữa đề. Server Action là
 * endpoint POST công khai: tự kiểm tra phiên, không dựa vào proxy.
 */
export async function submitExam(
  source: unknown,
  number: unknown,
  answers: unknown,
): Promise<SubmitExamResult> {
  if (!(await getExamUser())) return { ok: false, error: "unauthorized" };

  if (
    typeof source !== "string" ||
    typeof number !== "number" ||
    !Number.isInteger(number)
  ) {
    return { ok: false, error: "invalid" };
  }
  const exam = await getExam(source, number);
  if (!exam) return { ok: false, error: "notFound" };

  const maxOptions = Math.max(...exam.questions.map((q) => q.options.length));
  if (
    !isExamAnswers(answers, {
      questions: exam.questions.length,
      options: maxOptions,
    })
  ) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, exam, grade: gradeExam(exam, answers) };
}
