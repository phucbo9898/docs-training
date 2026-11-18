import type { Exam, PublicExam } from "./types";

/**
 * Bỏ đáp án khỏi đề trước khi gửi xuống trình duyệt ở Exam mode. Chép từng
 * trường cần thiết (không dùng spread) để trường mới thêm vào `ExamQuestion`
 * sau này không tự lọt ra ngoài.
 */
export function toPublicExam(exam: Exam): PublicExam {
  return {
    source: exam.source,
    number: exam.number,
    title: exam.title,
    durationMinutes: exam.durationMinutes,
    passPercent: exam.passPercent,
    mock: exam.mock,
    questions: exam.questions.map((question) => ({
      id: question.id,
      domain: question.domain,
      prompt: question.prompt,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
      selectCount: question.selectCount,
    })),
  };
}
