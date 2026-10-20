# English translation glossary (vi → en)

Used when translating `content/vi/**` into `content/en/**`. Keep terms consistent across all modules.

## 1. Structural terms

| Tiếng Việt              | English                    | Note                                       |
| ----------------------- | -------------------------- | ------------------------------------------ |
| Bài học                 | Lesson                     | `LESSON 01` headings stay as-is            |
| Bài tập                 | Exercise                   | Section heading "🧪 Bài tập" → "🧪 Exercises" |
| Bài tập nhanh           | Quick Exercises            |                                            |
| Bài tập tổng hợp        | Comprehensive Exercise     |                                            |
| Bài tập CRUD            | CRUD Exercise              |                                            |
| Khóa học                | Course                     |                                            |
| Module                  | Module                     |                                            |
| Lộ trình bài học        | Lesson Roadmap             |                                            |
| Lộ trình                | Roadmap / Learning Path    | "Learning Path" if the source says so      |
| Mục tiêu                | Objectives                 |                                            |
| Mục tiêu bài học        | Lesson Objectives          |                                            |
| Mục tiêu khóa học       | Course Objectives          |                                            |
| Đối tượng               | Target Audience            |                                            |
| Yêu cầu trước khi học   | Prerequisites              |                                            |
| Chuẩn bị                | Preparation                |                                            |
| Chuẩn bị môi trường     | Environment Setup          |                                            |
| Yêu cầu môi trường      | Environment Requirements   |                                            |
| Yêu cầu tối thiểu       | Minimum Requirements       |                                            |
| Nhiệm vụ                | Tasks                      |                                            |
| Cấu trúc gợi ý          | Suggested Structure        |                                            |
| Ví dụ                   | Example                    |                                            |
| Mô tả                   | Description                |                                            |
| Cách dùng               | Usage                      |                                            |
| Cách tạo                | How to Create              |                                            |
| Đặc điểm                | Characteristics            |                                            |
| Vị trí                  | Location                   |                                            |
| Lưu ý                   | Note                       | "Lưu ý quan trọng" → "Important Notes"     |
| Ghi chú                 | Notes                      |                                            |
| Kết quả                 | Result                     |                                            |
| Bonus (nếu có thời gian)| Bonus (if you have time)   |                                            |
| Thực tập sinh / Fresher | Intern / Fresher           |                                            |
| Giải thích              | Explanation                |                                            |
| Bài 01, Bài 02… (trong bài tập) | Problem 01, Problem 02… | Avoids clashing with Lesson / Exercise |
| TTS (thực tập sinh)     | intern                     |                                            |
| Giỏi / Khá / Trung bình | Excellent / Good / Average | Grade labels                               |
| Chữ hoa / chữ thường    | uppercase / lowercase      |                                            |
| Mảng tuần tự / kết hợp / đa chiều | Indexed / Associative / Multidimensional array | |

## 2. Kept in English (do not translate)

Product / framework names: PHP, Laravel, Eloquent, Blade, Artisan, Composer, Symfony, WordPress, MySQL, XAMPP, Laragon, VS Code, Bootstrap, jQuery, Ajax, HTML, CSS, JavaScript.

Technical terms kept as-is: middleware, route, routing, controller, model, view, migration, seeder, facade, service container, dependency injection, event, listener, notification, queue, task scheduling, cache, session, cookie, token, endpoint, API, request, response, validate / validation, prepared statement, SQL injection, CRUD, MVC, OOP, class, object, method, function, constructor, namespace, trait, interface, array, string, boolean, integer, float, null, variable, constant, loop, `if` / `switch` / `for` / `foreach` / `while`.

SQL terms (always uppercase, never translated): SELECT, INSERT, UPDATE, DELETE, JOIN (INNER/LEFT/RIGHT), INDEX, GROUP BY, ORDER BY, HAVING, LIMIT, subquery, PRIMARY KEY, FOREIGN KEY, UNIQUE, AUTO_INCREMENT, database, table, column, row.

HTTP methods: GET, POST, PUT, PATCH, DELETE.

## 3. Translated words (common vocabulary)

| Tiếng Việt                  | English                                |
| --------------------------- | -------------------------------------- |
| Hệ thống quản trị           | Admin Panel / Management System        |
| Tổng quan                   | Overview                               |
| Cài đặt                     | Installation (heading) / install (verb)|
| Cấu trúc thư mục            | Directory Structure                    |
| Cấu trúc project            | Project Structure                      |
| Biến                        | Variable                               |
| Hằng số                     | Constant                               |
| Kiểu dữ liệu                | Data Types                             |
| Chuỗi                       | String                                 |
| Mảng                        | Array                                  |
| Điều kiện                   | Condition / Conditional                |
| Vòng lặp                    | Loop                                   |
| Hàm                         | Function                               |
| Hàm dựng sẵn / tự định nghĩa| Built-in / user-defined function       |
| Cơ sở dữ liệu               | Database                               |
| Truy vấn                    | Query                                  |
| Truy vấn nâng cao           | Advanced Query                         |
| Bảng (dữ liệu)              | Table                                  |
| Phân trang                  | Pagination                             |
| Tìm kiếm                    | Search                                 |
| Giỏ hàng                    | Cart                                   |
| Đơn hàng                    | Order                                  |
| Danh mục                    | Category                               |
| Sản phẩm                    | Product                                |
| Người dùng                  | User                                   |
| Chạy / thực thi             | Run / Execute                          |
| Hiểu / Biết / Làm được      | Understand / Know / Be able to …       |
| Khuyến nghị                 | Recommended                            |
| Nếu có thời gian            | If you have time                       |

## 4. Style rules

- Friendly, clear tone for beginners; second person ("you"), short sentences.
- Imperative for steps ("Create…", "Run…"); noun phrases or "Understand…" / "Be able to…" for objectives.
- Keep emoji in headings exactly as in the source.
- Heading titles that are already English (e.g. `LESSON 01 – PHP Overview`) stay unchanged.
- Keep Vietnamese UI-facing sample data (names, addresses) in code blocks unchanged; translate only code comments.
- Internal links: `/vi/...` → `/en/...`; image paths unchanged; translate alt text and captions.
