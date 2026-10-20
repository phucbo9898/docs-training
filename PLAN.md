# Kế hoạch xây dựng Web Training – Intern Backend Training

Tài liệu này dùng để làm việc với Claude Code theo từng bước. Đặt file này (và copy vào `CLAUDE.md` ở bước 0) trong thư mục gốc project, cùng thư mục export Notion.

## 1. Quyết định đã chốt

| Hạng mục         | Chọn                                                              |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | Next.js (App Router) + TypeScript strict                          |
| Style            | Tailwind CSS + CSS variables                                      |
| Theme            | Light / Dark / System, lưu lựa chọn (`next-themes`)               |
| Đa ngôn ngữ      | `next-intl`, mặc định `vi` (`/vi`), thêm `en` (`/en`)             |
| Nội dung         | Markdown/MDX trong `content/{vi,en}/`, nguồn là export Notion     |
| Tìm kiếm         | Index JSON sinh lúc build + Fuse.js (chuẩn hóa bỏ dấu tiếng Việt) |
| Syntax highlight | Shiki (`rehype-pretty-code`)                                      |
| Triển khai       | Chạy local trước, sau đó Vercel                                   |
| SEO              | Không cần (thêm `noindex` mặc định)                               |
| Logo             | Để sẵn vùng, thay bằng `public/logo.svg` sau                      |
| Chuẩn code       | ESLint, Prettier, TypeScript strict, đặt tên nhất quán            |

## 2. Nội dung training (từ Notion)

Trang gốc: "Intern Backend Training" gồm phần giới thiệu, mục tiêu, lộ trình 4 phase, và 6 trang bài học:

| #   | Trang Notion                                       | Slug đề xuất             | Phase |
| --- | -------------------------------------------------- | ------------------------ | ----- |
| 1   | PHP TRAINING - BASIC                               | `php-basic`              | 1     |
| 2   | PHP TRAINING - Method, Session/Cookie & OOP cơ bản | `php-method-session-oop` | 1     |
| 3   | FRONTEND TRAINING – OVERVIEW                       | `frontend-overview`      | 1     |
| 4   | SQL & DATABASE - OVERVIEW                          | `sql-database-overview`  | 2     |
| 5   | LARAVEL FRAMEWORK - OVERVIEW                       | `laravel-overview`       | 3     |
| 6   | PROJECT SPECIFICATION: E-COMMERCE TRAINING SYSTEM  | `project-ecommerce`      | 4     |

Trang chủ hiển thị: Welcome, Mục tiêu, Lộ trình (4 phase dạng timeline/card), danh sách bài học.
Lưu ý: các trang "OVERVIEW" có thể còn trang con trong export. Claude Code cần quét thư mục để biết cây thật (xem bước 1).

## 3. Cấu trúc project

```
/
├─ CLAUDE.md                 # quy ước cho Claude Code (copy từ mục 7)
├─ notion-export/            # export gốc, KHÔNG sửa
├─ content/
│  ├─ vi/                    # phase-1/php-basic.mdx ...
│  └─ en/                    # bản dịch, cùng cấu trúc
├─ messages/
│  ├─ vi.json                # chuỗi giao diện
│  └─ en.json
├─ public/
│  ├─ logo.svg               # placeholder, thay sau
│  └─ content-images/        # ảnh lấy từ export
├─ scripts/
│  ├─ import-notion.ts       # chuyển export -> content/vi
│  └─ build-search-index.ts  # sinh index tìm kiếm
└─ src/
   ├─ app/[locale]/          # layout, trang chủ, [phase]/[slug]
   ├─ components/            # Header, Logo, Sidebar, Toc, ThemeToggle,
   │                         # LanguageSwitcher, SearchDialog, LessonNav, mdx/*
   ├─ lib/                   # content loader, navigation tree, search
   ├─ i18n/                  # routing, request config
   └─ styles/globals.css     # design tokens
```

## 4. Thiết kế giao diện

**Màu (CSS variables, đổi theo theme):**

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--bg`         | `#FFFFFF` | `#0B1220` |
| `--bg-subtle`  | `#F1F5F9` | `#111A2E` |
| `--text`       | `#0F172A` | `#E2E8F0` |
| `--text-muted` | `#475569` | `#94A3B8` |
| `--primary`    | `#2563EB` | `#60A5FA` |
| `--border`     | `#E2E8F0` | `#22304A` |

**Nguyên tắc dễ tiếp cận:**

- Chữ nền 16–18px, line-height 1.7, chiều rộng nội dung tối đa ~75 ký tự/dòng.
- Tương phản đạt WCAG AA, có `:focus-visible` rõ, điều hướng được bằng bàn phím.
- Vùng bấm tối thiểu 44px, có `aria-label` cho nút icon.
- Font: Be Vietnam Pro (hoặc Inter), có subset tiếng Việt.
- Hỗ trợ `prefers-reduced-motion`.

**Responsive:**

- Mobile (<768px): sidebar thành drawer, TOC ẩn.
- Tablet: sidebar thu gọn.
- Desktop (≥1024px): 3 cột (sidebar – nội dung – TOC trong bài).

**Header:** vùng logo (trái, dùng component `Logo` đọc `public/logo.svg`, fallback chữ), ô tìm kiếm (phím tắt `Ctrl/⌘+K`), chuyển ngôn ngữ, chuyển theme.

## 5. Các bước thực hiện với Claude Code

Mỗi bước: dán prompt, chờ xong, chạy phần "Kiểm tra", rồi commit trước khi sang bước tiếp theo.

### Bước 0 – Khởi tạo project và quy ước

**Prompt:**

> Đọc `PLAN.md`. Khởi tạo project Next.js (App Router, TypeScript strict, Tailwind, ESLint) ngay trong thư mục này, không xóa `notion-export/` và `PLAN.md`. Cài thêm: next-intl, next-themes, gray-matter, next-mdx-remote (hoặc @next/mdx), rehype-slug, rehype-autolink-headings, rehype-pretty-code, shiki, remark-gfm, fuse.js, Prettier. Tạo `CLAUDE.md` từ mục 7 của PLAN.md. Thêm script `lint`, `format`, `typecheck`. Chưa viết giao diện.

**Kiểm tra:** `npm run dev` mở được trang mặc định; `npm run lint` và `npm run typecheck` không lỗi.

### Bước 1 – Phân tích export Notion (chưa sửa gì)

**Prompt:**

> Quét `notion-export/`. Báo cáo: cây thư mục, số file `.md`, tên file nào còn hậu tố ID của Notion, số ảnh và nơi chứa ảnh, số bảng, số code block (kèm ngôn ngữ), các khối đặc biệt (callout `<aside>`, toggle `<details>`, embed, link nội bộ giữa các trang). Đối chiếu với bảng ở mục 2 của PLAN.md và nêu điểm lệch. Chỉ báo cáo, không thay đổi file.

**Kiểm tra:** đọc báo cáo, xác nhận số bài/ảnh khớp Notion. Chốt slug và thứ tự bài ở bước này.

### Bước 2 – Script import Notion → `content/vi`

**Prompt:**

> Viết `scripts/import-notion.ts` đọc `notion-export/` và ghi ra `content/vi/<phase>/<slug>.mdx`. Yêu cầu: bỏ hậu tố ID khỏi tên file, thêm front matter (`title`, `slug`, `phase`, `order`, `summary`), copy ảnh vào `public/content-images/` và sửa đường dẫn (decode URL, xử lý tên có dấu/khoảng trắng), chuyển `<aside>` thành component `<Callout>`, giữ `<details>` dạng toggle, sửa link nội bộ giữa các bài thành `/vi/...`, giữ nguyên code block và bảng, thoát các ký tự gây lỗi MDX (`{`, `}`, `<` ngoài code). Script chạy lại được nhiều lần (idempotent). Thêm lệnh `npm run import:notion`.

**Kiểm tra:** chạy script, mở vài file `.mdx` xem có đúng; ảnh hiển thị; không còn link tới `notion.so`.

### Bước 3 – Nền tảng i18n và theme

**Prompt:**

> Cấu hình next-intl với locales `vi` (mặc định) và `en`, routing `/[locale]/...`, truy cập `/` tự chuyển về `/vi`. Tạo `messages/vi.json` và `messages/en.json` cho toàn bộ chuỗi giao diện. Cấu hình next-themes (light/dark/system, không bị nháy màu khi tải). Định nghĩa design tokens ở mục 4 PLAN.md trong `globals.css` và map vào Tailwind. Thêm font Be Vietnam Pro. Tạo `ThemeToggle` và `LanguageSwitcher` (giữ nguyên trang hiện tại khi đổi ngôn ngữ).

**Kiểm tra:** đổi theme, F5 vẫn giữ; đổi ngôn ngữ giữ đúng đường dẫn bài học; không còn chuỗi giao diện bị hard-code.

### Bước 4 – Layout và trang bài học

**Prompt:**

> Xây layout theo mục 4 PLAN.md: Header (component `Logo` đọc `public/logo.svg` có fallback chữ, ô tìm kiếm tạm, ThemeToggle, LanguageSwitcher), Sidebar cây phase → bài (đánh dấu bài đang xem, drawer trên mobile), trang chủ (Welcome, mục tiêu, timeline 4 phase, card các bài), trang bài học `[locale]/[phase]/[slug]` render MDX, có TOC từ heading, nút Bài trước/Bài sau, breadcrumb. Tạo component MDX: `Callout`, `CodeBlock` (shiki + nút copy), `Table` cuộn ngang trên mobile, `Image` (tối ưu, có caption), `Details`. Tạo placeholder `public/logo.svg`. Cây điều hướng sinh tự động từ `content/<locale>`.

**Kiểm tra:** xem ở 375px, 768px, 1280px; cả light và dark; bảng và code block không làm tràn trang.

### Bước 5 – Dịch sang tiếng Anh

**Prompt:**

> Dịch toàn bộ `content/vi/**` sang `content/en/**` với cùng cấu trúc và tên file. Quy tắc: giữ nguyên toàn bộ code block, tên biến/hàm/lệnh, đường dẫn ảnh và front matter key (chỉ dịch `title`, `summary`); giữ nguyên thuật ngữ kỹ thuật phổ biến (Laravel, Eloquent, middleware, JOIN, INDEX...); văn phong rõ ràng, thân thiện với người mới. Dịch từng file, lưu lại danh sách file đã dịch. Nếu thiếu bản `en`, giao diện hiển thị bản `vi` kèm thông báo "Bản tiếng Anh chưa có".

**Kiểm tra:** đọc lướt 1–2 bài bằng tiếng Anh (đặc biệt các bài có nhiều thuật ngữ); `/en` hiển thị đủ bài.

### Bước 6 – Tìm kiếm

**Prompt:**

> Viết `scripts/build-search-index.ts` sinh `public/search-index.<locale>.json` từ `content/<locale>` (tiêu đề, heading, đoạn văn bản thuần, URL), chạy tự động trước `dev` và `build`. Tạo `SearchDialog` mở bằng `Ctrl/⌘+K`, dùng Fuse.js, chuẩn hóa không dấu để gõ "lap trinh" vẫn ra "lập trình", chỉ tìm trong ngôn ngữ hiện tại, hiển thị đoạn trích và điều hướng bằng bàn phím.

**Kiểm tra:** tìm "session", "JOIN", "middleware" ra đúng bài; tìm không dấu vẫn ra kết quả.

### Bước 7 – Hoàn thiện và chuẩn bị Vercel

**Prompt:**

> Rà soát accessibility (tương phản, focus, alt ảnh, thứ tự heading), responsive, và hiệu năng (ảnh, font). Thêm `noindex` toàn site và `robots.txt` chặn bot. Chạy `lint`, `typecheck`, `build` và sửa lỗi. Viết `README.md` hướng dẫn chạy local, cách thêm bài mới, cách thay logo. Kiểm tra project sẵn sàng deploy Vercel (không cần biến môi trường).

**Kiểm tra:** `npm run build && npm run start` chạy ổn ở local; sau đó mới đẩy lên Git và import vào Vercel.

## 6. Checklist nghiệm thu

- [ ] 6 bài (và trang con nếu có) hiển thị đủ ở `/vi` và `/en`
- [ ] Ảnh, bảng, code block hiển thị đúng ở mobile, tablet, desktop
- [ ] Chuyển light/dark mượt, nhớ lựa chọn
- [ ] Chuyển ngôn ngữ giữ đúng trang
- [ ] Tìm kiếm hoạt động (có dấu và không dấu)
- [ ] Logo thay được chỉ bằng cách thả file `public/logo.svg`
- [ ] `lint`, `typecheck`, `build` đều pass
- [ ] Không còn link tới Notion

## 7. Nội dung `CLAUDE.md` (copy vào gốc project)

```markdown
# Quy ước dự án

- Next.js App Router + TypeScript strict + Tailwind. Không dùng `any`.
- Chuỗi giao diện luôn lấy từ `messages/*.json` (next-intl), không hard-code.
- Màu chỉ dùng CSS variables / token Tailwind, không viết màu cố định trong component.
- Không sửa `notion-export/`. Nội dung chỉ đi qua `scripts/import-notion.ts`.
- Component: PascalCase, 1 file/1 component, props có type rõ ràng.
- Mọi thao tác UI phải dùng được bằng bàn phím; ảnh có alt; nút icon có aria-label.
- Chạy `npm run lint && npm run typecheck` trước khi báo hoàn thành.
- Commit nhỏ theo từng bước, message dạng: `feat: ...`, `fix: ...`, `chore: ...`.
```

## 8. Lưu ý khi làm việc với Claude Code

- Làm từng bước, chạy kiểm tra và commit sau mỗi bước để dễ quay lại.
- Nếu một bước lỗi, dán nguyên thông báo lỗi và đường dẫn file liên quan cho Claude Code sửa.
- Bước 1 và 5 là nơi cần con người xem lại kỹ nhất (độ khớp nội dung và chất lượng bản dịch).
