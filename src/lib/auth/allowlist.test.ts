import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isEmailAllowed } from "./allowlist";

describe("isEmailAllowed", () => {
  it("chưa cấu hình gì thì từ chối tất cả", () => {
    assert.equal(isEmailAllowed("a@example.com", undefined, undefined), false);
    assert.equal(isEmailAllowed("a@example.com", " , ", ""), false);
  });

  it("thiếu email hoặc email sai dạng thì từ chối", () => {
    assert.equal(isEmailAllowed(undefined, "a@example.com", ""), false);
    assert.equal(isEmailAllowed("", "a@example.com", ""), false);
    assert.equal(isEmailAllowed("example.com", "", "example.com"), false);
    assert.equal(isEmailAllowed("a@", "", "example.com"), false);
  });

  it("khớp danh sách email, không phân biệt hoa thường và khoảng trắng", () => {
    const list = " a@example.com, B@Other.org ";
    assert.equal(isEmailAllowed("A@Example.com", list, undefined), true);
    assert.equal(isEmailAllowed("b@other.org", list, undefined), true);
    assert.equal(isEmailAllowed("c@example.com", list, undefined), false);
  });

  it("khớp đúng domain, không nhận subdomain hay domain giả", () => {
    assert.equal(isEmailAllowed("x@example.com", "", "example.com"), true);
    assert.equal(isEmailAllowed("x@EXAMPLE.com", "", "@example.com"), true);
    assert.equal(isEmailAllowed("x@sub.example.com", "", "example.com"), false);
    assert.equal(
      isEmailAllowed("x@evil-example.com", "", "example.com"),
      false,
    );
    assert.equal(
      isEmailAllowed("x@example.com.evil", "", "example.com"),
      false,
    );
  });
});
