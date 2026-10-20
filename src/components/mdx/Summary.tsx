import type { ComponentProps } from "react";

/** `<summary>` viết tay trong `<details>` của Notion. */
export default function Summary({
  className = "",
  ...rest
}: ComponentProps<"summary">) {
  return (
    <summary
      className={`min-h-11 cursor-pointer py-2 font-semibold ${className}`}
      {...rest}
    />
  );
}
