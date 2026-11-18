"use server";

import { signIn, signOut } from "@/auth";
import { routing } from "@/i18n/routing";
import { safeCallbackPath } from "./callback-url";

function localeOf(value: unknown): string {
  return (
    routing.locales.find((locale) => locale === value) ?? routing.defaultLocale
  );
}

/** Tham số đến từ form nên kiểm tra lại, không tin giá trị client gửi lên. */
export async function signInWithGoogle(
  locale: unknown,
  callbackUrl: unknown,
): Promise<void> {
  const fallback = `/${localeOf(locale)}/aws-exams`;
  await signIn("google", {
    redirectTo: safeCallbackPath(
      typeof callbackUrl === "string" ? callbackUrl : null,
      fallback,
    ),
  });
}

export async function signOutFromExams(locale: unknown): Promise<void> {
  await signOut({ redirectTo: `/${localeOf(locale)}` });
}
