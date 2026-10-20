import type { ComponentProps } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

/**
 * Link trong nội dung: link nội bộ do script import sinh dạng `/vi/...` được
 * chuyển về locale đang xem; link ngoài mở tab mới.
 */
export default function Link({ href, children, ...rest }: ComponentProps<"a">) {
  if (!href || href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    const path = href.replace(LOCALE_PREFIX, "") || "/";
    return (
      <IntlLink href={path} {...rest}>
        {children}
      </IntlLink>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
