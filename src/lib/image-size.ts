import { readFileSync } from "node:fs";
import path from "node:path";

export type ImageSize = { width: number; height: number };

const FALLBACK: ImageSize = { width: 1200, height: 675 };
const PNG_SIGNATURE = "89504e470d0a1a0a";

/**
 * Đọc kích thước ảnh PNG trong `public/` từ header IHDR để next/image giữ đúng
 * tỷ lệ ngay từ đầu (không xê dịch bố cục). Định dạng khác hoặc lỗi → tỷ lệ 16:9.
 */
export function getPublicImageSize(src: string): ImageSize {
  if (!src.startsWith("/") || !src.toLowerCase().endsWith(".png")) {
    return FALLBACK;
  }
  try {
    const publicDir = path.join(process.cwd(), "public");
    const file = path.join(publicDir, decodeURIComponent(src));
    if (!file.startsWith(publicDir + path.sep)) return FALLBACK;
    const head = readFileSync(file).subarray(0, 24);
    if (head.subarray(0, 8).toString("hex") !== PNG_SIGNATURE) return FALLBACK;
    const width = head.readUInt32BE(16);
    const height = head.readUInt32BE(20);
    return width > 0 && height > 0 ? { width, height } : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
