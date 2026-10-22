import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

/** Bảng cuộn ngang trong khung riêng để không làm tràn trang trên mobile. */
export default function Table(props: ComponentProps<"table">) {
  const t = useTranslations("Table");

  return (
    <div
      role="group"
      aria-label={t("label")}
      tabIndex={0}
      className="my-6 overflow-x-auto rounded-lg border border-border"
    >
      <table {...props} />
    </div>
  );
}
