import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    /** Google `sub`: id người dùng ổn định, gán ở callback `jwt` lúc đăng nhập. */
    uid?: string;
  }
}
