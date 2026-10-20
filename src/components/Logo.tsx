import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const LOGO_FILE = "logo.svg";

/** Đọc `public/logo.svg`; chưa có file thì chỉ hiện tên site bằng chữ. */
export default function Logo() {
  const t = useTranslations("Metadata");
  const hasLogo = existsSync(path.join(process.cwd(), "public", LOGO_FILE));

  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md font-bold whitespace-nowrap text-text"
    >
      {hasLogo ? (
        <Image
          src={`/${LOGO_FILE}`}
          alt=""
          width={32}
          height={32}
          unoptimized
          className="size-8 shrink-0"
        />
      ) : null}
      <span className="leading-tight">{t("siteName")}</span>
    </Link>
  );
}
