import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Bỏ qua api, file nội bộ của Next/Vercel và mọi file có đuôi (ảnh, font...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
