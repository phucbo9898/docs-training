import type { ComponentProps, ReactNode } from "react";

type DetailsProps = ComponentProps<"details"> & {
  /** Tiêu đề; có thể bỏ qua nếu dùng `<summary>` thủ công trong nội dung. */
  summary?: ReactNode;
};

export default function Details({
  summary,
  children,
  className = "",
  ...rest
}: DetailsProps) {
  return (
    <details
      className={`group my-6 rounded-lg border border-border bg-bg-subtle px-4 py-2 ${className}`}
      {...rest}
    >
      {summary ? (
        <summary className="min-h-11 cursor-pointer py-2 font-semibold">
          {summary}
        </summary>
      ) : null}
      <div className="pb-2 [&>*+*]:mt-3">{children}</div>
    </details>
  );
}
