import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="page-fade mx-auto flex w-full max-w-2xl flex-col items-start gap-4 px-4 py-16 md:px-8">
      <p className="text-5xl font-bold text-text-muted">404</p>
      <h1 className="text-3xl font-bold leading-tight">{t("title")}</h1>
      <p className="text-text-muted">{t("description")}</p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
