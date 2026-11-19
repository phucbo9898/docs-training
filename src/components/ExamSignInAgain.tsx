import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type ExamSignInAgainProps = {
  /** Đường dẫn đầy đủ (có locale) để quay lại sau khi đăng nhập. */
  callbackPath: string;
};

/** Phiên cũ chưa có user id: cần đăng nhập lại mới đọc được kết quả đã lưu. */
export default async function ExamSignInAgain({
  callbackPath,
}: ExamSignInAgainProps) {
  const t = await getTranslations("History");

  return (
    <p
      role="alert"
      className="rounded-lg border border-warning bg-warning/10 p-4 text-text"
    >
      {t("needSignIn")}{" "}
      <Link
        href={{ pathname: "/login", query: { callbackUrl: callbackPath } }}
        className="font-semibold text-primary-text underline underline-offset-2"
      >
        {t("signIn")}
      </Link>
    </p>
  );
}
