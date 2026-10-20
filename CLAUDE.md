# Quy ước dự án
- Next.js App Router + TypeScript strict + Tailwind. Không dùng `any`.
- Chuỗi giao diện luôn lấy từ `messages/*.json` (next-intl), không hard-code.
- Màu chỉ dùng CSS variables / token Tailwind, không viết màu cố định trong component.
- Không sửa `notion-export/` (chỉ là bản export gốc).
- `content/` là nguồn chính, sửa trực tiếp; bản vi và en luôn đồng bộ cấu trúc. Không chạy lại `npm run import:notion` vì sẽ ghi đè nội dung đã sửa.
- Component: PascalCase, 1 file/1 component, props có type rõ ràng.
- Mọi thao tác UI phải dùng được bằng bàn phím; ảnh có alt; nút icon có aria-label.
- Chạy `npm run lint && npm run typecheck` trước khi báo hoàn thành.
- Commit nhỏ theo từng bước, message dạng: `feat: ...`, `fix: ...`, `chore: ...`.
