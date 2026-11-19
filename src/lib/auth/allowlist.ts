/** Hàm thuần, không đọc file cấu hình trực tiếp: dùng được trong test. */

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Email được vào tab Luyện đề khi nằm trong `allowedEmails` hoặc thuộc đúng
 * `allowedDomain`. Không cấu hình gì thì từ chối tất cả.
 */
export function isEmailAllowed(
  email: string | null | undefined,
  allowedEmails: readonly string[],
  allowedDomain: string | undefined,
): boolean {
  if (!email) return false;
  const address = normalize(email);
  const at = address.lastIndexOf("@");
  if (at <= 0 || at === address.length - 1) return false;

  if (allowedEmails.map(normalize).includes(address)) return true;

  // So khớp nguyên phần sau "@": "evil-example.com" hay "x.example.com" không
  // được tính là "example.com".
  const domain = normalize(allowedDomain ?? "").replace(/^@/, "");
  return domain !== "" && address.slice(at + 1) === domain;
}
