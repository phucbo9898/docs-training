/** Kiểu dữ liệu luyện đề. File JSON có dạng `StoredExam`. */

export const EXAM_DOMAINS = [
  "secure",
  "resilient",
  "performance",
  "cost",
] as const;

export type ExamDomain = (typeof EXAM_DOMAINS)[number];

/** Domain có nhãn dịch sẵn trong `messages` (4 domain của đề thật). */
export function isExamDomain(value: unknown): value is ExamDomain {
  return EXAM_DOMAINS.some((domain) => domain === value);
}

export type ExamOption = { id: string; text: string };

/** Phần đề ai làm cũng thấy: câu hỏi và các lựa chọn. */
type ExamQuestionBase = {
  /** Duy nhất trong đề, dạng "bo-1-3-07". */
  id: string;
  /**
   * Bộ 1 dùng `ExamDomain`; Bộ 2 dùng tên danh mục dịch vụ AWS, vd
   * "AWS Compute". `null`: câu chưa phân loại.
   */
  domain: string | null;
  /** Tiếng Anh, giống đề thật. */
  prompt: string;
  options: ExamOption[];
  number: number;
};

/** Đáp án và lời giải: Exam mode chỉ nhận sau khi nộp bài. */
type ExamAnswerKey = {
  /** Id câu gốc trong kho, để nhận biết câu trùng giữa các đề. */
  baseId: string;
  /** 1 id, hoặc nhiều id với câu Select TWO. */
  correct: string[];
  /** Tiếng Việt, mấu chốt của câu. */
  explanation: string;
  /** Giải thích cho từng lựa chọn, key là option id. Có thể là "" (không có). */
  optionExplanations: Record<string, string>;
  hint?: string;
  /** Slug trang ôn trong /aws-saa-c03/. "" là không có trang ôn. */
  reviewPage?: string;
};

/** Đúng như trong file JSON, khớp `content/exams/README.md`. */
export type StoredExamQuestion = ExamQuestionBase & ExamAnswerKey;

/** Số đáp án cần chọn: loader tính từ `correct.length`. */
type SelectCount = { selectCount: number };

/** Đủ để hiện và làm một câu, chung cho cả hai chế độ. */
export type ExamQuestionPrompt = ExamQuestionBase & SelectCount;

/** Câu đầy đủ đáp án: Practice mode, màn kết quả và chữa đề. */
export type ExamQuestion = StoredExamQuestion & SelectCount;

/**
 * Câu gửi xuống trình duyệt ở Exam mode. Các trường đáp án là `never` nên
 * TypeScript báo lỗi nếu lỡ truyền `ExamQuestion` vào chỗ cần kiểu này.
 */
export type PublicExamQuestion = ExamQuestionPrompt & {
  [Key in keyof ExamAnswerKey]?: never;
};

type ExamMeta = {
  source: string;
  number: number;
  title: string;
  durationMinutes: number;
  /** Mốc ước lượng, không phải điểm đậu chính thức. */
  passPercent: number;
  mock: boolean;
};

export type StoredExam = ExamMeta & { questions: StoredExamQuestion[] };

export type Exam = ExamMeta & { questions: ExamQuestion[] };

export type PublicExam = ExamMeta & { questions: PublicExamQuestion[] };

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

/**
 * Dữ liệu một lượt làm bài gửi xuống Client Component: Practice mode cần phản
 * hồi ngay nên có đáp án, Exam mode thì không.
 */
export type ExamSessionData =
  { mode: "practice"; exam: Exam } | { mode: "exam"; exam: PublicExam };

/** Lựa chọn của người làm, key là question id. */
export type ExamAnswers = Record<string, string[]>;
