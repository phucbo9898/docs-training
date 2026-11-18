type ExamFlagIconProps = {
  filled?: boolean;
  className?: string;
};

/** Icon cờ đánh dấu câu; luôn đi kèm chữ hoặc aria-label ở nơi dùng. */
export default function ExamFlagIcon({
  filled = false,
  className = "",
}: ExamFlagIconProps) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}
