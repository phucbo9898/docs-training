import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAttemptId, parseHistoryQuery, statsMode } from "./history";

describe("parseHistoryQuery", () => {
  it("đọc mode và page hợp lệ", () => {
    assert.deepEqual(parseHistoryQuery({ mode: "exam", page: "3" }), {
      mode: "exam",
      page: 3,
    });
  });

  it("giá trị lạ về mặc định", () => {
    for (const query of [
      {},
      { mode: "x", page: "0" },
      { page: "-1" },
      { page: "1.5" },
      { page: "abc" },
      { page: "99999" },
    ]) {
      assert.deepEqual(parseHistoryQuery(query), { mode: null, page: 1 });
    }
  });
});

describe("statsMode", () => {
  it("mặc định Exam, chỉ Practice khi đang lọc Practice", () => {
    assert.equal(statsMode(null), "exam");
    assert.equal(statsMode("exam"), "exam");
    assert.equal(statsMode("practice"), "practice");
  });
});

describe("parseAttemptId", () => {
  it("chỉ nhận số nguyên dương", () => {
    assert.equal(parseAttemptId("42"), 42);
    for (const id of ["0", "-1", "01", "1e3", "abc", "9999999999999999"]) {
      assert.equal(parseAttemptId(id), null, id);
    }
  });
});
