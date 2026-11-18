import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import createMiddleware from "next-intl/middleware";
import { auth, isAllowedEmail } from "./auth";
import { routing } from "./i18n/routing";
import { isMissingContentPage } from "./lib/content-route";

const intlMiddleware = createMiddleware(routing);

/** `/vi/aws-exams`, `/en/aws-exams/...`: chỉ thành viên đã đăng nhập. */
const PROTECTED = /^\/(vi|en)\/aws-exams(?:\/|$)/;

/** Cookie Auth.js lưu trang gốc khi bắt đầu đăng nhập (có tiền tố khi chạy HTTPS). */
const CALLBACK_COOKIES = [
  "__Secure-authjs.callback-url",
  "authjs.callback-url",
] as const;

function localeOf(path: string | undefined): string {
  const segment = path?.split("/")[1];
  return (
    routing.locales.find((locale) => locale === segment) ??
    routing.defaultLocale
  );
}

/**
 * Auth.js chuyển lỗi đăng nhập về "/login?error=..." (không có locale): đưa
 * về trang login đúng ngôn ngữ của trang người dùng định vào.
 */
function redirectBareLogin(request: NextRequest): NextResponse {
  const raw = CALLBACK_COOKIES.map(
    (name) => request.cookies.get(name)?.value,
  ).find(Boolean);
  let callbackPath: string | undefined;
  if (raw) {
    try {
      const url = new URL(raw, request.url);
      if (url.origin === request.nextUrl.origin) {
        callbackPath = `${url.pathname}${url.search}`;
      }
    } catch {
      // Cookie hỏng: dùng locale mặc định.
    }
  }

  const target = request.nextUrl.clone();
  target.pathname = `/${localeOf(callbackPath)}/login`;
  if (callbackPath && !target.searchParams.has("callbackUrl")) {
    target.searchParams.set("callbackUrl", callbackPath);
  }
  return NextResponse.redirect(target, 307);
}

/** Khai báo kiểu rõ để `auth()` chọn đúng overload dạng proxy, không phải route handler. */
type ProtectedHandler = (
  request: NextAuthRequest,
  event: NextFetchEvent,
) => ReturnType<NextMiddleware>;

const handleProtected: ProtectedHandler = (request) => {
  const { pathname, search } = request.nextUrl;
  if (!isAllowedEmail(request.auth?.user?.email)) {
    const target = new URL(`/${localeOf(pathname)}/login`, request.url);
    target.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(target, 307);
  }
  return intlMiddleware(request);
};

const protectedProxy = auth(handleProtected);

/**
 * Trang nội dung không tồn tại: rewrite sang `/<locale>/404` (prerender sẵn với
 * status 404). Để page động tự gọi notFound() thì Cache Components đã stream
 * shell với 200 trước đó (soft 404).
 */
function notFoundResponse(request: NextRequest): NextResponse {
  const target = request.nextUrl.clone();
  target.pathname = `/${localeOf(request.nextUrl.pathname)}/404`;
  return NextResponse.rewrite(target);
}

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;
  if (pathname === "/login") return redirectBareLogin(request);
  // Chỉ giải mã phiên ở route cần bảo vệ; các trang docs giữ nguyên như cũ.
  if (PROTECTED.test(pathname)) return protectedProxy(request, event);
  if (await isMissingContentPage(pathname)) return notFoundResponse(request);
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Bỏ qua api, file nội bộ của Next/Vercel và mọi file có đuôi (ảnh, font...).
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Route luyện đề luôn qua proxy, kể cả đường dẫn có dấu chấm ("/1.0").
    "/:locale(vi|en)/aws-exams/:path*",
  ],
};
