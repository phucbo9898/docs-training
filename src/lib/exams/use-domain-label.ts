import { useTranslations } from "next-intl";
import { isExamDomain } from "./types";

/**
 * Nhãn hiển thị của domain: 4 domain chuẩn lấy từ `messages`, danh mục AWS
 * (Bộ 2) là tên riêng tiếng Anh nên giữ nguyên, `null` là "chưa phân loại".
 */
export function useDomainLabel(): (domain: string | null) => string {
  const t = useTranslations("Exams");
  return (domain) => {
    if (domain === null) return t("domainNone");
    return isExamDomain(domain) ? t(`domain.${domain}`) : domain;
  };
}
