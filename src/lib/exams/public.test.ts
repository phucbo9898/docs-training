import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toPublicExam } from "./public";
import type { Exam } from "./types";

const exam: Exam = {
  source: "bo-1",
  number: 1,
  title: "Bộ 1 – Đề 1",
  durationMinutes: 130,
  passPercent: 72,
  mock: true,
  questions: [
    {
      id: "bo-1-1-01",
      number: 1,
      baseId: "tt1-03",
      domain: "resilient",
      prompt: "Which queue?",
      options: [
        { id: "a", text: "SNS" },
        { id: "b", text: "SQS FIFO" },
        { id: "c", text: "Kinesis" },
      ],
      correct: ["b", "c"],
      selectCount: 2,
      explanation: "SECRET-EXPLANATION",
      optionExplanations: { a: "SECRET-A", b: "SECRET-B", c: "SECRET-C" },
      hint: "SECRET-HINT",
      reviewPage: "resilient",
    },
  ],
};

describe("toPublicExam", () => {
  it("chỉ giữ id, number, domain, prompt, options và selectCount của câu", () => {
    const [question] = toPublicExam(exam).questions;
    assert.deepEqual(question, {
      id: "bo-1-1-01",
      number: 1,
      domain: "resilient",
      prompt: "Which queue?",
      options: exam.questions[0]?.options,
      selectCount: 2,
    });
  });

  it("không còn đáp án, giải thích hay gợi ý khi serialize", () => {
    const json = JSON.stringify(toPublicExam(exam));
    for (const leaked of [
      '"correct"',
      '"explanation"',
      '"optionExplanations"',
      '"hint"',
      '"baseId"',
      '"reviewPage"',
      "SECRET",
    ]) {
      assert.equal(json.includes(leaked), false, leaked);
    }
  });
});
