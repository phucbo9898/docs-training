import { Fragment } from "react";
import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  /** Bỏ trống cho mục không có trang (phase) hoặc mục hiện tại. */
  href?: string;
};

type BreadcrumbProps = {
  label: string;
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ label, items }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className="mb-4 text-sm text-text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <Fragment key={`${index}-${item.label}`}>
              <li className="min-w-0">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:text-text hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={last ? "text-text" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {last ? null : (
                <li aria-hidden="true" role="presentation">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
