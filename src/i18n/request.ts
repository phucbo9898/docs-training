import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Cố định để ngày giờ (lịch sử làm bài render ở server) không theo giờ UTC
    // của máy chủ Vercel.
    timeZone: "Asia/Ho_Chi_Minh",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
