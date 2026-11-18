import { notFound } from "next/navigation";

/**
 * Đích rewrite của proxy cho trang nội dung không tồn tại. Route tĩnh nên được
 * prerender sẵn với status 404; trang động gọi notFound() sau khi đã stream
 * shell thì chỉ trả 200 (soft 404).
 */
export default function MissingPage() {
  notFound();
}
