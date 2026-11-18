import {
  EXAM_DOMAINS,
  type Exam,
  type ExamAnswers,
  type ExamDomain,
  type ExamQuestion,
} from "./types";

/**
 * Hàm thuần, không đọc file: dùng được ở server (Server Action chấm Exam mode),
 * Client Component (Practice mode đã có sẵn đáp án) và unit test.
 */

export type QuestionStatus = "correct" | "incorrect" | "skipped";

export type ScoreSummary = {
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
  /** Phần trăm câu đúng, làm tròn xuống số nguyên. */
  percent: number;
};

export type ExamScore = ScoreSummary & { passed: boolean };

/** Điểm cả đề và theo domain: màn kết quả cần cả hai. */
export type ExamGrade = {
  score: ExamScore;
  byDomain: Partial<Record<ExamDomain, ScoreSummary>>;
};

/** Câu nhiều đáp án chỉ đúng khi chọn khớp toàn bộ tập đáp án, không thừa không thiếu. */
export function questionStatus(
  question: ExamQuestion,
  selected: readonly string[] | undefined,
): QuestionStatus {
  if (!selected || selected.length === 0) return "skipped";
  const picked = new Set(selected);
  const exact =
    picked.size === question.correct.length &&
    question.correct.every((id) => picked.has(id));
  return exact ? "correct" : "incorrect";
}

function summarize(
  questions: readonly ExamQuestion[],
  answers: ExamAnswers,
): ScoreSummary {
  const summary: ScoreSummary = {
    correct: 0,
    incorrect: 0,
    skipped: 0,
    total: questions.length,
    percent: 0,
  };
  for (const question of questions) {
    summary[questionStatus(question, answers[question.id])] += 1;
  }
  summary.percent =
    summary.total === 0
      ? 0
      : Math.floor((summary.correct / summary.total) * 100);
  return summary;
}

export function scoreExam(
  exam: Pick<Exam, "questions" | "passPercent">,
  answers: ExamAnswers,
): ExamScore {
  const summary = summarize(exam.questions, answers);
  return { ...summary, passed: summary.percent >= exam.passPercent };
}

/** Điểm theo domain; domain không có câu nào bị bỏ khỏi kết quả. */
export function scoreByDomain(
  exam: Pick<Exam, "questions">,
  answers: ExamAnswers,
): Partial<Record<ExamDomain, ScoreSummary>> {
  const result: Partial<Record<ExamDomain, ScoreSummary>> = {};
  for (const domain of EXAM_DOMAINS) {
    const questions = exam.questions.filter((q) => q.domain === domain);
    if (questions.length > 0) result[domain] = summarize(questions, answers);
  }
  return result;
}

export function gradeExam(
  exam: Pick<Exam, "questions" | "passPercent">,
  answers: ExamAnswers,
): ExamGrade {
  return {
    score: scoreExam(exam, answers),
    byDomain: scoreByDomain(exam, answers),
  };
}
