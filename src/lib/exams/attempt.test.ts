import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attemptDuration,
  normalizeAnswers,
  parseExamId,
  submissionSchema,
  toExamId,
} from "./attempt";
import type { ExamAnswers, ExamQuestion } from "./types";

function question(id: string, correct: string[]): ExamQuestion {
  const ids = ["a", "b", "c", "d", "e"];
  return {
    id,
    number: 1,
    baseId: id,
    domain: null,
    prompt: id,
    options: ids.map((option) => ({ id: option, text: option })),
    correct,
    selectCount: correct.length,
    explanation: "",
    optionExplanations: Object.fromEntries(ids.map((option) => [option, ""])),
  };
}

const exam = { questions: [question("q1", ["a"]), question("q2", ["b", "c"])] };

describe("exam id", () => {
  it("đổi qua lại source/number", () => {
    assert.equal(toExamId("bo-1", 3), "bo-1/3");
    assert.deepEqual(parseExamId("bo-1/3"), { source: "bo-1", number: 3 });
  });

  it("từ chối id sai dạng", () => {
    for (const id of ["bo-1", "bo-1/0", "../x/1", "BO/1", "bo-1/3/4"]) {
      assert.equal(parseExamId(id), null, id);
    }
  });
});

describe("normalizeAnswers", () => {
  it("giữ câu đã chọn, bỏ câu trống", () => {
    assert.deepEqual(normalizeAnswers(exam, { q1: ["a"], q2: [] }), {
      q1: ["a"],
    });
  });

  it("từ chối câu lạ, lựa chọn lạ, trùng hoặc chọn quá số đáp án", () => {
    const cases: ExamAnswers[] = [
      { q9: ["a"] },
      { q1: ["z"] },
      { q2: ["b", "b"] },
      { q1: ["a", "b"] },
      { q2: ["a", "b", "c"] },
    ];
    for (const answers of cases) {
      assert.equal(normalizeAnswers(exam, answers), null);
    }
  });
});

describe("submissionSchema", () => {
  const valid = {
    source: "bo-1",
    number: 1,
    mode: "exam",
    answers: { q1: ["a"] },
    startedAt: 1,
  };

  it("nhận bài hợp lệ", () => {
    assert.equal(submissionSchema.safeParse(valid).success, true);
  });

  it("từ chối mode lạ và source có ký tự đường dẫn", () => {
    for (const patch of [{ mode: "test" }, { source: "../bo-1" }]) {
      assert.equal(
        submissionSchema.safeParse({ ...valid, ...patch }).success,
        false,
      );
    }
  });
});

describe("attemptDuration", () => {
  it("Exam mode chặn ở thời lượng đề", () => {
    assert.equal(attemptDuration("exam", 0, 90_000, 130), 90);
    assert.equal(attemptDuration("exam", 0, 999 * 60_000, 130), 130 * 60);
    assert.equal(attemptDuration("exam", 5_000, 0, 130), 0);
  });

  it("Practice mode quá một ngày thì null", () => {
    assert.equal(attemptDuration("practice", 0, 60_000, 130), 60);
    assert.equal(attemptDuration("practice", 0, 2 * 86_400_000, 130), null);
  });
});
