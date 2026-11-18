import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth/actions";
import { safeCallbackPath } from "@/lib/auth/callback-url";
import { getExamUser } from "@/lib/auth/session";

type LoginPanelProps = {
  locale: string;
  searchParams: PageProps<"/[locale]/login">["searchParams"];
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Phần động của trang đăng nhập: đọc query và phiên hiện tại. */
export default async function LoginPanel({
  locale,
  searchParams,
}: LoginPanelProps) {
  const query = await searchParams;
  const callbackUrl = safeCallbackPath(
    first(query.callbackUrl),
    `/${locale}/aws-exams`,
  );

  // Đã có quyền thì không cần đăng nhập lại.
  if (await getExamUser()) redirect(callbackUrl);

  const t = await getTranslations("Auth");
  const error = first(query.error);

  return (
    <div className="mt-8 space-y-6">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger bg-danger/10 p-4 text-text"
        >
          {error === "AccessDenied"
            ? t("error.notAllowed")
            : t("error.generic")}
        </p>
      ) : null}
      <form action={signInWithGoogle.bind(null, locale, callbackUrl)}>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21.35 11.1H12v2.9h5.35c-.25 1.45-1.67 4.25-5.35 4.25a6.25 6.25 0 0 1 0-12.5c1.78 0 2.97.76 3.65 1.41l2.5-2.4C16.6 3.3 14.5 2.4 12 2.4a9.6 9.6 0 1 0 0 19.2c5.54 0 9.2-3.9 9.2-9.38 0-.63-.07-1.11-.15-1.6z" />
          </svg>
          {t("signInWithGoogle")}
        </button>
      </form>
    </div>
  );
}
