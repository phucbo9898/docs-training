import "server-only";
import { redirect } from "next/navigation";
import { auth, isAllowedEmail } from "@/auth";

export type ExamUser = { email: string; name: string | null };

/**
 * Người dùng hiện tại nếu có phiên hợp lệ và email vẫn còn trong danh sách
 * (gỡ khỏi danh sách là mất quyền ngay, không đợi JWT hết hạn).
 */
export async function getExamUser(): Promise<ExamUser | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isAllowedEmail(email)) return null;
  return { email, name: session.user?.name ?? null };
}

/** Kiểm tra lần hai sau proxy; không có quyền thì về trang đăng nhập. */
export async function requireExamUser(
  locale: string,
  callbackPath: string,
): Promise<ExamUser> {
  const user = await getExamUser();
  if (!user) {
    const query = new URLSearchParams({ callbackUrl: callbackPath });
    redirect(`/${locale}/login?${query.toString()}`);
  }
  return user;
}
