# Dữ liệu luyện đề AWS SAA-C03

Câu hỏi là câu hỏi gốc do team tự soạn, bám theo keyword và bẫy rút ra từ 6 đề luyện. Không chứa câu hỏi của bên thứ ba.

**Trạng thái: dữ liệu mẫu (`mock: true`).** 12 đề được dựng từ kho 123 câu gốc, nên một câu có thể xuất hiện ở nhiều đề (thứ tự câu và thứ tự lựa chọn được xáo khác nhau). Trong cùng một đề không có câu trùng. Khi có câu hỏi mới, chỉ cần thay file JSON và đổi `mock` thành `false`.

## Cấu trúc

```
content/exams/
  index.json        # danh sách bộ và đề (form chọn đề, sidebar, generateStaticParams)
  bo-1/1.json … 6.json
  bo-2/1.json … 6.json
```

Mỗi đề 65 câu, 130 phút, tỉ lệ domain theo đề thật: Secure 20, Resilient 17, High-Performing 16, Cost 12. Mỗi đề có 8 câu chọn nhiều đáp án (Select TWO).

## Kiểu dữ liệu

```ts
type ExamDomain = "secure" | "resilient" | "performance" | "cost";

type ExamOption = { id: string; text: string };

type ExamQuestion = {
  id: string;                 // duy nhất trong đề, dạng "bo-1-3-07"
  baseId: string;             // id câu gốc trong kho, dùng để nhận biết câu trùng giữa các đề
  domain: ExamDomain;
  prompt: string;             // tiếng Anh, giống đề thật
  options: ExamOption[];      // 4 lựa chọn; câu Select TWO có 5
  correct: string[];          // 1 id, hoặc 2 id với câu Select TWO
  explanation: string;        // tiếng Việt, mấu chốt của câu
  optionExplanations: Record<string, string>; // giải thích cho từng lựa chọn, key là option id
  hint?: string;
  reviewPage?: string;        // slug trang ôn trong /aws-saa-c03/
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

1. Ghi đè `bo-<x>/<n>.json` theo kiểu `Exam`, đặt `mock: false`.
2. Cập nhật `index.json` nếu đổi số câu hoặc thời gian.
3. Chạy `npm run build`. File sai định dạng sẽ làm build lỗi.
