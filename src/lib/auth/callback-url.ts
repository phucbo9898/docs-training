/**
 * Chỉ nhận đường dẫn nội bộ ("/vi/aws-exams/..."), để `callbackUrl` trên URL
 * không thành open redirect. Không hợp lệ thì trả `fallback`.
 */
export function safeCallbackPath(
  value: string | null | undefined,
  fallback: string,
): string {
  if (!value || !value.startsWith("/")) return fallback;
  // "//host" và "/\host" bị trình duyệt hiểu là sang domain khác.
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  try {
    const base = "http://internal.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
