import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { TrackId } from "./tracks";

/**
 * Tiêu đề tab trình duyệt theo track: "<trang> | <tên track>", hoặc chỉ tên
 * track ở trang chủ của track. Dùng `absolute` để không bị nối thêm tên site.
 */
export async function trackPageTitle(
  locale: Locale,
  track: TrackId,
  title?: string,
): Promise<Metadata["title"]> {
  const t = await getTranslations({ locale, namespace: "Tracks" });
  const trackTitle = t(`${track}.title`);
  return { absolute: title ? `${title} | ${trackTitle}` : trackTitle };
}
