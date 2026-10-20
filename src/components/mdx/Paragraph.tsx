import { Children, isValidElement, type ComponentProps } from "react";
import Image from "./Image";

/** Ảnh đứng riêng một dòng là `<figure>`, không được nằm trong `<p>`. */
export default function Paragraph({ children, ...rest }: ComponentProps<"p">) {
  const nodes = Children.toArray(children);
  const onlyImage =
    nodes.length === 1 && isValidElement(nodes[0]) && nodes[0].type === Image;

  if (onlyImage) return <>{children}</>;
  return <p {...rest}>{children}</p>;
}
