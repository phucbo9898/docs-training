import type { ComponentProps } from "react";
import NextImage from "next/image";

type ImageProps = Omit<ComponentProps<"img">, "width" | "height"> & {
  /** Chú thích hiển thị dưới ảnh; markdown `![alt](src "chú thích")` cũng dùng được. */
  caption?: string;
};

export default function Image({
  src,
  alt,
  title,
  caption,
  className,
}: ImageProps) {
  if (typeof src !== "string" || !src) return null;
  const text = caption ?? title;

  return (
    <figure className="my-6">
      {/* Chưa biết kích thước thật: để ảnh tự co theo tỷ lệ, tối đa bằng khung chứa. */}
      <NextImage
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(min-width: 1024px) 46rem, 100vw"
        unoptimized={!src.startsWith("/")}
        className={`mx-auto h-auto w-auto max-w-full rounded-lg border border-border ${className ?? ""}`}
      />
      {text ? (
        <figcaption className="mt-2 text-center text-sm text-text-muted">
          {text}
        </figcaption>
      ) : null}
    </figure>
  );
}
