import { readFile } from "node:fs/promises";
import path from "node:path";
import { examErrors, isExam, isExamIndex } from "./guards";
import type { Exam, ExamIndex, ExamIndexEntry, ExamSource } from "./types";

const EXAMS_DIR = path.join(process.cwd(), "content", "exams");

async function readJson(file: string): Promise<unknown> {
  const raw = await readFile(file, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`exams: ${file} không phải JSON hợp lệ`, { cause: error });
  }
}

/** Danh sách bộ và đề. Sai định dạng thì throw để build lỗi. */
export async function getExamIndex(): Promise<ExamIndex> {
  // Đọc file ngoài request: cần cache để route vẫn prerender được (Cache Components).
  "use cache";

  const file = path.join(EXAMS_DIR, "index.json");
  const data = await readJson(file);
  if (!isExamIndex(data)) {
    throw new Error(`exams: ${file} sai định dạng ExamIndex`);
  }
  return data;
}

export function findExamEntry(
  index: ExamIndex,
  source: string,
  number: number,
): { source: ExamSource; entry: ExamIndexEntry } | null {
  const found = index.sources.find((item) => item.id === source);
  const entry = found?.exams.find((item) => item.number === number);
  return found && entry ? { source: found, entry } : null;
}

/**
 * Một đề theo (bộ, số). Tra qua index nên tham số URL không đi thẳng vào
 * đường dẫn file; đề không có trong index trả về `null`, file có mà sai định
 * dạng hoặc lệch index thì throw.
 */
export async function getExam(
  source: string,
  number: number,
): Promise<Exam | null> {
  "use cache";

  const index = await getExamIndex();
  const found = findExamEntry(index, source, number);
  if (!found) return null;

  const file = path.join(
    EXAMS_DIR,
    found.source.id,
    `${found.entry.number}.json`,
  );
  const exam = await readJson(file);
  if (!isExam(exam)) {
    const errors = examErrors(exam).slice(0, 20);
    throw new Error(`exams: ${file} sai định dạng:\n- ${errors.join("\n- ")}`);
  }

  const mismatch: string[] = [];
  if (exam.source !== found.source.id) mismatch.push("source");
  if (exam.number !== found.entry.number) mismatch.push("number");
  if (exam.questions.length !== found.entry.questionCount) {
    mismatch.push("questionCount");
  }
  if (exam.durationMinutes !== found.entry.durationMinutes) {
    mismatch.push("durationMinutes");
  }
  if (mismatch.length > 0) {
    throw new Error(
      `exams: ${file} lệch với index.json ở: ${mismatch.join(", ")}`,
    );
  }
  return exam;
}
