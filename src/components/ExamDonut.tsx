import type { ScoreSummary } from "@/lib/exams/score";

type ExamDonutProps = {
  score: ScoreSummary;
  /** Mô tả cho trình đọc màn hình, ví dụ "Đúng 9, sai 1, bỏ qua 55". */
  label: string;
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Khe hở nhỏ giữa các phần để phân biệt khi hai màu cạnh nhau. */
const GAP = 1.5;

/** Biểu đồ vòng Đúng / Sai / Bỏ qua; màu lấy từ token. */
export default function ExamDonut({ score, label }: ExamDonutProps) {
  const parts = [
    { value: score.correct, className: "stroke-success" },
    { value: score.incorrect, className: "stroke-danger" },
    { value: score.skipped, className: "stroke-skipped" },
  ].filter((part) => part.value > 0);

  let offset = 0;
  const segments = parts.map((part) => {
    const length = (part.value / Math.max(score.total, 1)) * CIRCUMFERENCE;
    const visible = parts.length > 1 ? Math.max(length - GAP, 0.5) : length;
    const segment = { ...part, dash: visible, offset };
    offset += length;
    return segment;
  });

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
      className="size-44 shrink-0 -rotate-90 md:size-52"
    >
      <circle
        cx={50}
        cy={50}
        r={RADIUS}
        fill="none"
        strokeWidth={12}
        className="stroke-border"
      />
      {segments.map((segment) => (
        <circle
          key={segment.className}
          cx={50}
          cy={50}
          r={RADIUS}
          fill="none"
          strokeWidth={12}
          strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
          strokeDashoffset={-segment.offset}
          className={segment.className}
        />
      ))}
    </svg>
  );
}
