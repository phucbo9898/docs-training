import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // CSS toàn site chỉ ~9 KiB: nhúng thẳng vào HTML để bỏ request chặn render (LCP mobile).
    inlineCss: true,
    agentUpgrade: "security",
  },
  // Trang luyện đề và đăng nhập: không cho CDN/trình duyệt lưu, không cho index.
  async headers() {
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    return [
      { source: "/:locale/aws-exams", headers: privateHeaders },
      { source: "/:locale/aws-exams/:path*", headers: privateHeaders },
      { source: "/:locale/login", headers: privateHeaders },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
