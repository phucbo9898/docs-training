import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeCallbackPath } from "./callback-url";

describe("safeCallbackPath", () => {
  const fallback = "/vi/aws-exams";

  it("giữ đường dẫn nội bộ kèm query", () => {
    assert.equal(
      safeCallbackPath("/vi/aws-exams/bo-1/1?mode=exam", fallback),
      "/vi/aws-exams/bo-1/1?mode=exam",
    );
  });

  it("chặn URL tuyệt đối và URL sang domain khác", () => {
    for (const value of [
      "https://evil.example/x",
      "//evil.example/x",
      "/\\evil.example/x",
      "javascript:alert(1)",
      "vi/aws-exams",
      "",
      null,
      undefined,
    ]) {
      assert.equal(safeCallbackPath(value, fallback), fallback, String(value));
    }
  });
});
