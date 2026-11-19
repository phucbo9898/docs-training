import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ExamUser } from "@/lib/auth/session";
import { signOutFromExams } from "@/lib/auth/actions";

type ExamsAccountBarProps = {
  user: ExamUser;
  locale: string;
};

/** Thanh tài khoản trên đầu tab Luyện đề: ai đang đăng nhập và nút đăng xuất. */
export default async function ExamsAccountBar({
  user,
  locale,
}: ExamsAccountBarProps) {
  const [t, tHistory] = await Promise.all([
    getTranslations("Auth"),
    getTranslations("History"),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-end gap-3 px-4 pt-4 text-sm md:px-8">
      <Link
        href="/aws-exams/history"
        className="mr-auto inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-2"
      >
        {tHistory("link")}
      </Link>
      <span className="min-w-0 truncate text-text-muted">
        {t("signedInAs", { email: user.email })}
      </span>
      <form action={signOutFromExams.bind(null, locale)}>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-semibold text-text hover:bg-bg-subtle"
        >
          {t("signOut")}
        </button>
      </form>
    </div>
  );
}
