import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { examErrors } from "./guards";

function exam(overrides: Record<string, unknown>) {
  return {
    source: "bo-1",
    number: 1,
    title: "Đề 1",
    durationMinutes: 130,
    passPercent: 72,
    mock: false,
    questions: [
      {
        id: "bo-1-1-01",
        number: 1,
        baseId: "q1",
        domain: "secure",
        prompt: "Which option?",
        options: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
        ],
        correct: ["a"],
        explanation: "Vì A.",
        optionExplanations: { a: "Đúng.", b: "Sai." },
        reviewPage: "iam",
        ...overrides,
      },
    ],
  };
}

describe("examErrors", () => {
  it("nhận domain chuẩn, danh mục AWS và null", () => {
    for (const domain of ["secure", "AWS Compute", null]) {
      assert.deepEqual(examErrors(exam({ domain })), []);
    }
  });

  it("từ chối domain thiếu, rỗng hoặc sai kiểu", () => {
    for (const domain of [undefined, "", 1]) {
      assert.notDeepEqual(examErrors(exam({ domain })), []);
    }
  });

  it('nhận optionExplanations và reviewPage là ""', () => {
    assert.deepEqual(
      examErrors(
        exam({ optionExplanations: { a: "", b: "" }, reviewPage: "" }),
      ),
      [],
    );
  });

  it("number phải khớp vị trí câu", () => {
    for (const number of [undefined, 0, 2, "1"]) {
      assert.notDeepEqual(examErrors(exam({ number })), []);
    }
  });

  it("vẫn từ chối giải thích không phải chuỗi", () => {
    assert.notDeepEqual(
      examErrors(exam({ optionExplanations: { a: "", b: null } })),
      [],
    );
  });
});
