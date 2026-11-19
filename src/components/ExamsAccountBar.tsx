import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ExamUser } from "@/lib/auth/session";
import { signOutFromExams } from "@/lib/auth/actions";

type ExamsAccountBarProps = {
  user: ExamUser;
  locale: string;
};

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 font-semibold text-text hover:bg-bg-subtle";

/**
 * Thanh tài khoản trên đầu tab Luyện đề: ai đang đăng nhập, link lịch sử làm
 * bài và nút đăng xuất, gom thành một cụm bên phải.
 */
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
      <span className="min-w-0 truncate text-text-muted">
        {t("signedInAs", { name: user.name ?? user.email ?? "" })}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/aws-exams/history" className={buttonClass}>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l3 2" />
          </svg>
          {tHistory("link")}
        </Link>
        <form action={signOutFromExams.bind(null, locale)}>
          <button type="submit" className={buttonClass}>
            {t("signOut")}
          </button>
        </form>
      </div>
    </div>
  );
}
