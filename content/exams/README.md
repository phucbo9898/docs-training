# Dữ liệu luyện đề AWS SAA-C03

**Trạng thái: dữ liệu thật (`mock: false`).** 2 bộ × 6 đề, tổng 780 câu, không có câu trùng giữa các đề. Tên domain, bucket, bảng, tài khoản trong câu hỏi đã được đổi sang tên trung tính (`example.com`, `examplebucket`, `ExampleTable`…). Khi thêm câu mới, giữ quy ước này.

## Cấu trúc

```text
content/exams/
  index.json        # danh sách bộ và đề (form chọn đề, sidebar, generateStaticParams)
  bo-1/1.json … 6.json
  bo-2/1.json … 6.json
```

Mỗi đề 65 câu, 130 phút. Mỗi đề có khoảng 5–16 câu chọn nhiều đáp án (chủ yếu Select TWO, vài câu Select THREE); tỉ lệ domain khác nhau giữa các đề.

## Kiểu dữ liệu

```ts
type ExamDomain = "secure" | "resilient" | "performance" | "cost";

type ExamOption = { id: string; text: string };

type ExamQuestion = {
  id: string;                 // duy nhất trong đề, dạng "bo-1-3-07"
  baseId: string;             // id câu trong kho, dạng "pool-bo-1-3-07"; dùng để nhận biết câu trùng giữa các đề
  domain: ExamDomain | string | null; // Bộ 1: ExamDomain (2 câu null = chưa phân loại);
                              // Bộ 2: tên danh mục dịch vụ AWS, vd "AWS Compute"
  prompt: string;             // tiếng Anh, giống đề thật
  options: ExamOption[];      // 4 lựa chọn; Select TWO có 5, Select THREE có 6
  correct: string[];          // 1 id, hoặc 2–3 id với câu Select TWO/THREE
  explanation: string;        // tiếng Anh, giải thích đáp án
  optionExplanations: Record<string, string>; // giải thích cho từng lựa chọn, key là option id; "" = không có
  hint?: string;
  reviewPage?: string;        // slug trang ôn trong /aws-saa-c03/; "" = không có
};

type Exam = {
  source: string;             // "bo-1" | "bo-2"
  number: number;             // 1–6
  title: string;
  durationMinutes: number;    // 130
  passPercent: number;        // 72, mốc ước lượng
  mock: boolean;
  questions: ExamQuestion[];
};

type ExamIndex = {
  sources: {
    id: string;
    title: string;
    exams: { number: number; title: string; questionCount: number; durationMinutes: number }[];
  }[];
};
```

## Thay bằng câu hỏi mới

1. Ghi đè `bo-<x>/<n>.json` theo kiểu `Exam`, đặt `mock: false`. Không giữ tên riêng (domain, bucket, tên người, địa danh) của nguồn đề.
2. Cập nhật `index.json` nếu đổi số câu hoặc thời gian.
3. Chạy `npm run build`. File sai định dạng sẽ làm build lỗi.
