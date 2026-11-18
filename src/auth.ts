import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isEmailAllowed } from "@/lib/auth/allowlist";

/** Đọc mỗi lần gọi để đổi danh sách trên Vercel là có hiệu lực sau redeploy. */
export function isAllowedEmail(email: string | null | undefined): boolean {
  return isEmailAllowed(
    email,
    process.env.ALLOWED_EMAILS,
    process.env.ALLOWED_DOMAIN,
  );
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
  },
});
