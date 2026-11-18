import {
  type ExamAnswers,
  type ExamIndex,
  type ExamIndexEntry,
  type ExamOption,
  type ExamSource,
  type StoredExam,
} from "./types";

/**
 * Kiểm tra dữ liệu đề đọc từ JSON. Mỗi hàm trả về danh sách lỗi (rỗng là hợp
 * lệ) để loader báo đúng chỗ sai thay vì chỉ "sai định dạng".
 */

type Errors = string[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isOption(value: unknown): value is ExamOption {
  return isRecord(value) && isString(value.id) && isString(value.text);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

/** `position` bắt đầu từ 1: số câu phải khớp vị trí để lưới câu, đầu câu và chữa đề cùng một số. */
function questionErrors(value: unknown, at: string, position: number): Errors {
  if (!isRecord(value)) return [`${at}: không phải object`];
  const errors: Errors = [];
  const q = value;

  for (const key of ["id", "baseId", "prompt", "explanation"] as const) {
    if (!isString(q[key]))
      errors.push(`${at}.${key}: thiếu hoặc không phải chuỗi`);
  }
  if (q.number !== position) {
    errors.push(`${at}.number: phải là ${position} (đúng vị trí câu)`);
  }
  if (q.domain !== null && !isString(q.domain)) {
    errors.push(`${at}.domain: phải là chuỗi hoặc null`);
  }
  if (q.hint !== undefined && !isString(q.hint)) {
    errors.push(`${at}.hint: phải là chuỗi`);
  }
  if (q.reviewPage !== undefined && typeof q.reviewPage !== "string") {
    errors.push(`${at}.reviewPage: phải là chuỗi`);
  }

  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push(`${at}.options: cần ít nhất 2 lựa chọn`);
    return errors;
  }
  if (!q.options.every(isOption)) {
    errors.push(`${at}.options: lựa chọn phải có id và text`);
    return errors;
  }
  const ids = q.options.map((option) => option.id);
  if (new Set(ids).size !== ids.length) {
    errors.push(`${at}.options: id lựa chọn bị trùng`);
  }

  if (!isStringArray(q.correct) || q.correct.length === 0) {
    errors.push(`${at}.correct: cần ít nhất 1 id`);
  } else if (!q.correct.every((id) => ids.includes(id))) {
    errors.push(`${at}.correct: có id không nằm trong options`);
  } else if (q.correct.length >= ids.length) {
    errors.push(`${at}.correct: không được đúng tất cả lựa chọn`);
  }

  const explanations = q.optionExplanations;
  if (!isRecord(explanations)) {
    errors.push(`${at}.optionExplanations: thiếu`);
  } else {
    const keys = Object.keys(explanations).sort();
    if (keys.join() !== [...ids].sort().join()) {
      errors.push(`${at}.optionExplanations: key phải khớp id các lựa chọn`);
    }
    // Chuỗi rỗng hợp lệ: lựa chọn đó không có giải thích riêng.
    if (!Object.values(explanations).every((v) => typeof v === "string")) {
      errors.push(`${at}.optionExplanations: giá trị phải là chuỗi`);
    }
  }

  return errors;
}

export function examErrors(value: unknown): Errors {
  if (!isRecord(value)) return ["không phải object"];
  const errors: Errors = [];

  if (!isString(value.source)) errors.push("source: thiếu");
  if (!isPositiveInt(value.number))
    errors.push("number: phải là số nguyên dương");
  if (!isString(value.title)) errors.push("title: thiếu");
  if (!isPositiveInt(value.durationMinutes)) {
    errors.push("durationMinutes: phải là số nguyên dương");
  }
  if (
    typeof value.passPercent !== "number" ||
    value.passPercent <= 0 ||
    value.passPercent > 100
  ) {
    errors.push("passPercent: phải trong (0, 100]");
  }
  if (typeof value.mock !== "boolean") errors.push("mock: phải là boolean");

  if (!Array.isArray(value.questions) || value.questions.length === 0) {
    errors.push("questions: cần ít nhất 1 câu");
    return errors;
  }
  value.questions.forEach((question, index) => {
    errors.push(...questionErrors(question, `questions[${index}]`, index + 1));
  });
  const ids = value.questions.filter(isRecord).map((question) => question.id);
  if (new Set(ids).size !== ids.length)
    errors.push("questions: id câu bị trùng");

  return errors;
}

export function isExam(value: unknown): value is StoredExam {
  return examErrors(value).length === 0;
}

function isIndexEntry(value: unknown): value is ExamIndexEntry {
  return (
    isRecord(value) &&
    isPositiveInt(value.number) &&
    isString(value.title) &&
    isPositiveInt(value.questionCount) &&
    isPositiveInt(value.durationMinutes)
  );
}

/** Id bộ đề nằm trong URL và đường dẫn file nên chỉ cho chữ thường, số, gạch ngang. */
const SOURCE_ID = /^[a-z0-9-]+$/;

function isSource(value: unknown): value is ExamSource {
  return (
    isRecord(value) &&
    isString(value.id) &&
    SOURCE_ID.test(value.id) &&
    isString(value.title) &&
    Array.isArray(value.exams) &&
    value.exams.length > 0 &&
    value.exams.every(isIndexEntry)
  );
}

export function isExamIndex(value: unknown): value is ExamIndex {
  return (
    isRecord(value) &&
    Array.isArray(value.sources) &&
    value.sources.length > 0 &&
    value.sources.every(isSource)
  );
}

/**
 * Bài làm gửi lên Server Action: dữ liệu từ client nên kiểm tra kỹ. Giới hạn
 * số câu và số lựa chọn để payload bất thường không làm server chấm vô ích.
 */
export function isExamAnswers(
  value: unknown,
  limits: { questions: number; options: number },
): value is ExamAnswers {
  if (!isRecord(value)) return false;
  const entries = Object.entries(value);
  return (
    entries.length <= limits.questions &&
    entries.every(
      ([, picked]) =>
        Array.isArray(picked) &&
        picked.length <= limits.options &&
        picked.every((id) => typeof id === "string" && id.length <= 64),
    )
  );
}
