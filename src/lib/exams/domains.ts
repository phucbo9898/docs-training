import { EXAM_DOMAINS, type ExamQuestionPrompt } from "./types";

/**
 * Các domain có trong đề, mỗi domain một lần: 4 domain chuẩn theo thứ tự đề
 * thật, rồi domain khác (vd danh mục AWS của Bộ 2) theo thứ tự xuất hiện,
 * `null` (chưa phân loại) cuối cùng.
 */
export function examDomains(
  questions: readonly Pick<ExamQuestionPrompt, "domain">[],
): (string | null)[] {
  const present = new Set(questions.map((question) => question.domain));
  const known: string[] = EXAM_DOMAINS.filter((domain) => present.has(domain));
  const others = [...present].filter(
    (domain): domain is string => domain !== null && !known.includes(domain),
  );
  return [...known, ...others, ...(present.has(null) ? [null] : [])];
}
