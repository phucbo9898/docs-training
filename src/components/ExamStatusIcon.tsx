export type ExamItemStatus =
  "unanswered" | "answered" | "correct" | "incorrect";

type ExamStatusIconProps = {
  status: ExamItemStatus;
  /** Chữ cho trình đọc màn hình; icon chỉ để nhìn. */
  label: string;
};

const PATHS: Record<ExamItemStatus, string> = {
  unanswered: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  answered: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  correct: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12l3 3 5-6",
  incorrect: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 9l6 6M15 9l-6 6",
};

const COLORS: Record<ExamItemStatus, string> = {
  unanswered: "text-text-muted",
  answered: "text-primary",
  correct: "text-success",
  incorrect: "text-danger",
};

export default function ExamStatusIcon({ status, label }: ExamStatusIconProps) {
  return (
    <span className={`inline-flex shrink-0 ${COLORS[status]}`}>
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill={status === "answered" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={PATHS[status]} />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
