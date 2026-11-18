import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { questionStatus, scoreByDomain, scoreExam } from "./score";
import type { ExamQuestion } from "./types";

function question(
  id: string,
  domain: string | null,
  correct: string[],
): ExamQuestion {
  const ids = ["a", "b", "c", "d", "e"];
  return {
    id,
    baseId: id,
    domain,
    prompt: `Question ${id}`,
    options: ids.map((option) => ({ id: option, text: option })),
    correct,
    selectCount: correct.length,
    explanation: "",
    optionExplanations: Object.fromEntries(ids.map((option) => [option, ""])),
  };
}

const single = question("q1", "secure", ["c"]);
const selectTwo = question("q2", "resilient", ["a", "d"]);

describe("questionStatus", () => {
  it("câu một đáp án: đúng, sai, bỏ trống", () => {
    assert.equal(questionStatus(single, ["c"]), "correct");
    assert.equal(questionStatus(single, ["b"]), "incorrect");
    assert.equal(questionStatus(single, undefined), "skipped");
    assert.equal(questionStatus(single, []), "skipped");
  });

  it("Select TWO: đúng đủ hai, không phụ thuộc thứ tự", () => {
    assert.equal(questionStatus(selectTwo, ["d", "a"]), "correct");
  });

  it("Select TWO: đúng một nửa vẫn là sai", () => {
    assert.equal(questionStatus(selectTwo, ["a"]), "incorrect");
    assert.equal(questionStatus(selectTwo, ["a", "b"]), "incorrect");
  });

  it("chọn thừa là sai", () => {
    assert.equal(questionStatus(selectTwo, ["a", "d", "e"]), "incorrect");
    assert.equal(questionStatus(single, ["c", "a"]), "incorrect");
  });
});

describe("scoreExam", () => {
  const questions = [
    single,
    selectTwo,
    question("q3", "performance", ["b"]),
    question("q4", "cost", ["a"]),
  ];

  it("đếm đúng/sai/bỏ qua và làm tròn xuống phần trăm", () => {
    const score = scoreExam(
      { questions, passPercent: 72 },
      { q1: ["c"], q2: ["a"], q3: ["b"] },
    );
    assert.deepEqual(score, {
      correct: 2,
      incorrect: 1,
      skipped: 1,
      total: 4,
      percent: 50,
      passed: false,
    });
  });

  it("đậu khi phần trăm đạt mốc", () => {
    const answers = { q1: ["c"], q2: ["a", "d"], q3: ["b"], q4: ["a"] };
    assert.equal(
      scoreExam({ questions, passPercent: 72 }, answers).passed,
      true,
    );
    assert.equal(
      scoreExam({ questions, passPercent: 75 }, { ...answers, q4: [] }).passed,
      true,
    );
    assert.equal(
      scoreExam({ questions, passPercent: 76 }, { ...answers, q4: [] }).passed,
      false,
    );
  });

  it("đề rỗng không chia cho 0", () => {
    assert.equal(scoreExam({ questions: [], passPercent: 72 }, {}).percent, 0);
  });
});

describe("scoreByDomain", () => {
  it("gộp theo domain và bỏ domain không có câu", () => {
    const questions = [single, question("q5", "secure", ["a"]), selectTwo];
    const result = scoreByDomain(
      { questions },
      { q1: ["c"], q5: ["b"], q2: ["a"] },
    );
    assert.deepEqual(result, [
      {
        domain: "secure",
        summary: {
          correct: 1,
          incorrect: 1,
          skipped: 0,
          total: 2,
          percent: 50,
        },
      },
      {
        domain: "resilient",
        summary: { correct: 0, incorrect: 1, skipped: 0, total: 1, percent: 0 },
      },
    ]);
  });

  it("domain chuẩn trước, danh mục AWS theo thứ tự xuất hiện, null cuối", () => {
    const questions = [
      question("q1", null, ["a"]),
      question("q2", "AWS Storage", ["a"]),
      question("q3", "cost", ["a"]),
      question("q4", "AWS Compute", ["a"]),
      question("q5", "secure", ["a"]),
      question("q6", "AWS Storage", ["a"]),
    ];
    const result = scoreByDomain({ questions }, { q1: ["a"] });
    assert.deepEqual(
      result.map((item) => [item.domain, item.summary.total]),
      [
        ["secure", 1],
        ["cost", 1],
        ["AWS Storage", 2],
        ["AWS Compute", 1],
        [null, 1],
      ],
    );
    assert.equal(result.at(-1)?.summary.correct, 1);
  });
});
