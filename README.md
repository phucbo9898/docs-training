# Intern Backend Training

Website tài liệu đào tạo thực tập sinh Backend (PHP, SQL, Laravel, dự án E-commerce). Next.js App Router, TypeScript strict, Tailwind, `next-intl` (vi mặc định, en), `next-themes` (sáng/tối/hệ thống), tìm kiếm Fuse.js không dấu.

Site mặc định `noindex` và `robots.txt` chặn mọi bot; không có analytics và không cần biến môi trường.

## Yêu cầu

Node.js >= 20.19 (xem `.nvmrc`: `nvm use`).

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3000, tự chuyển về /vi
```

Build và chạy bản production:

```bash
npm run build && npm run start
```

Các lệnh kiểm tra:

```bash
npm run lint
npm run typecheck
npm run format:check   # `content/` được bỏ qua, xem .prettierignore
```

`npm run dev` và `npm run build` tự sinh chỉ mục tìm kiếm `public/search-index.<locale>.json` (`npm run build:search`).

## Cấu trúc nội dung

`content/` là nguồn nội dung chính, sửa trực tiếp:

```text
content/
├─ vi/<module>/<slug>.mdx
└─ en/<module>/<slug>.mdx      # cùng cấu trúc và tên file với vi
```

Mỗi `<module>` là một thư mục (ví dụ `php-basic`, `laravel-overview`). `index.mdx` là trang tổng quan của module, các file còn lại là bài học/bài tập. Cây điều hướng, trang chủ và chỉ mục tìm kiếm đều sinh tự động từ thư mục này.

Chuỗi giao diện nằm ở `messages/vi.json` và `messages/en.json`, không hard-code trong component.

## Thêm bài mới

1. Tạo `content/vi/<module>/<slug>.mdx` và `content/en/<module>/<slug>.mdx` (cùng tên file) với front matter:

   ```mdx
   ---
   title: "LESSON 10 – Tiêu đề bài"
   slug: "lesson-10-ten-bai"
   module: "laravel-overview"
   phase: 3
   order: 10
   type: lesson
   summary: "Một hai câu tóm tắt, hiển thị ở thẻ bài và kết quả tìm kiếm."
   ---

   ## Mục tiêu

   Nội dung bài học…
   ```

   - `slug` trùng tên file (không có `.mdx`); `index` dành cho trang tổng quan.
   - `module` trùng tên thư mục; `phase` là 1–4; `order` quyết định thứ tự trong module.
   - `type`: `overview`, `lesson` hoặc `exercise`.
   - Bản `en` giữ nguyên toàn bộ key front matter và code block, chỉ dịch `title`, `summary` và nội dung.

2. Bản `vi` và `en` luôn có cùng cấu trúc. Nếu thiếu bản `en`, giao diện hiển thị bản `vi` kèm thông báo.
3. Ảnh đặt trong `public/content-images/<module>/` và tham chiếu bằng `![mô tả ảnh](/content-images/<module>/ten-anh.png)`. Luôn viết alt có nghĩa. Ảnh PNG được đọc kích thước thật để không xê dịch bố cục.
4. Component dùng được trong MDX: `Callout`, `Details`/`Summary`, bảng Markdown, code block có tô màu (khai báo ngôn ngữ sau ba dấu backtick).

## Thay logo

Thả file `public/logo.svg` (thay file hiện có). Header tự đọc file này; nếu xóa file thì chỉ hiện tên site bằng chữ. Logo hiển thị 32×32 px nên nên dùng SVG vuông.

## Deploy lên Vercel

Không cần biến môi trường hay cấu hình thêm.

1. Đẩy repo lên Git (GitHub/GitLab/Bitbucket).
2. Trên Vercel: **Add New → Project**, import repo. Framework tự nhận là Next.js.
3. Giữ mặc định: Build Command `npm run build`, Install Command `npm install`. Node.js Version >= 20.19 (đã khai báo trong `engines`).
4. Deploy. Mỗi lần đẩy lên nhánh chính sẽ tự build lại.

Vì site `noindex` + `robots.txt` chặn bot, công cụ tìm kiếm sẽ không lập chỉ mục trang.

## Lưu ý quan trọng

**Không chạy lại `npm run import:notion`.** Script này chuyển `notion-export/` thành `content/vi` và sẽ ghi đè toàn bộ nội dung đã chỉnh sửa. `content/` hiện là nguồn chính, và `notion-export/` chỉ là bản export gốc, không sửa.

## Ghi chú bảo mật

`npm audit` còn 2 chuỗi lỗ hổng chưa xử lý. Cả hai chỉ có cách sửa bằng `npm audit fix --force`, tức là hạ phiên bản gói chính, nên được chấp nhận có chủ đích (không dùng `--force`, không dùng `overrides`):

| Chuỗi gói                                                                                 | Mức độ   | Lý do chấp nhận                                                                                             |
| ----------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `braces` ← `micromatch` ← `fast-glob` ← `@next/eslint-plugin-next` ← `eslint-config-next` | high     | Chỉ nằm trong chuỗi lint (devDependency), không chạy trong ứng dụng đã deploy.                              |
| `sprintf-js` ← `argparse` ← `js-yaml` 3.x ← `gray-matter`                                 | moderate | Chỉ chạy lúc build để đọc front matter của nội dung do chính dự án quản lý, không xử lý dữ liệu người dùng. |

Hướng xử lý sau này: thay `gray-matter` bằng parser front matter khác dùng `js-yaml` 4.x (ví dụ `@11ty/gray-matter` hoặc `vfile-matter`), và nâng `eslint-config-next` khi có bản vá. Chạy lại `npm audit` định kỳ.
