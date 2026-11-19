import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import allowlist from "@/config/allowed-emails.json";
import { isEmailAllowed } from "@/lib/auth/allowlist";

/**
 * Danh sách nằm trong `src/config/allowed-emails.json` (không dùng biến môi
 * trường): sửa file, commit và deploy lại là có hiệu lực.
 */
export function isAllowedEmail(email: string | null | undefined): boolean {
  return isEmailAllowed(email, allowlist.emails, allowlist.domain);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET lấy từ biến môi trường.
  providers: [Google],
  session: { strategy: "jwt" },
  // Không có locale: proxy chuyển "/login" sang "/<locale>/login".
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      // Email chưa xác minh thì không tin được để so với danh sách.
      if (profile?.email_verified !== true) return false;
      return isAllowedEmail(profile.email);
    },
    jwt({ token, account }) {
      // Chỉ có `account` lúc vừa đăng nhập. `token.sub` mặc định là UUID ngẫu
      // nhiên mỗi lần đăng nhập (không có adapter), nên lưu Google `sub` riêng.
      if (account?.provider === "google") token.uid = account.providerAccountId;
      return token;
    },
    session({ session, token }) {
      // Phiên cũ (trước khi có `uid`) không có id: cần đăng nhập lại để lưu bài.
      if (typeof token.uid === "string") session.user.id = token.uid;
      return session;
    },
  },
});
