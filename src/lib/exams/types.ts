/** Kiểu dữ liệu luyện đề, khớp `content/exams/README.md`. */

export const EXAM_DOMAINS = [
  "secure",
  "resilient",
  "performance",
  "cost",
] as const;

export type ExamDomain = (typeof EXAM_DOMAINS)[number];

export type ExamOption = { id: string; text: string };

export type ExamQuestion = {
  /** Duy nhất trong đề, dạng "bo-1-3-07". */
  id: string;
  /** Id câu gốc trong kho, để nhận biết câu trùng giữa các đề. */
  baseId: string;
  domain: ExamDomain;
  /** Tiếng Anh, giống đề thật. */
  prompt: string;
  options: ExamOption[];
  /** 1 id, hoặc nhiều id với câu Select TWO. */
  correct: string[];
  /** Tiếng Việt, mấu chốt của câu. */
  explanation: string;
  /** Giải thích cho từng lựa chọn, key là option id. */
  optionExplanations: Record<string, string>;
  hint?: string;
  /** Slug trang ôn trong /aws-saa-c03/. */
  reviewPage?: string;
};

export type Exam = {
  source: string;
  number: number;
  title: string;
  durationMinutes: number;
  /** Mốc ước lượng, không phải điểm đậu chính thức. */
  passPercent: number;
  mock: boolean;
  questions: ExamQuestion[];
};

export type ExamIndexEntry = {
  number: number;
  title: string;
  questionCount: number;
  durationMinutes: number;
};

export type ExamSource = {
  id: string;
  title: string;
  exams: ExamIndexEntry[];
};

export type ExamIndex = { sources: ExamSource[] };

export const EXAM_MODES = ["practice", "exam"] as const;

export type ExamMode = (typeof EXAM_MODES)[number];

export function isExamMode(value: unknown): value is ExamMode {
  return EXAM_MODES.some((mode) => mode === value);
}

/** Lựa chọn của người làm, key là question id. */
export type ExamAnswers = Record<string, string[]>;
