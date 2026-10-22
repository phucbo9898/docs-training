import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const LOGO_FILE = "logo-nws.png";
const LOGO_WIDTH = 274;
const LOGO_HEIGHT = 72;

/** Đọc `public/logo-nws.png`; chưa có file thì chỉ hiện tên site bằng chữ. */
export default function Logo() {
  const t = useTranslations("Metadata");
  const hasLogo = existsSync(path.join(process.cwd(), "public", LOGO_FILE));

  return (
    <Link
      href="/"
      className="inline-flex min-h-11 min-w-0 shrink items-center gap-2 rounded-md font-bold text-text"
    >
      {hasLogo ? (
        <Image
          src={`/${LOGO_FILE}`}
          alt=""
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          unoptimized
          className="h-7 w-auto shrink-0 sm:h-8 md:h-9"
        />
      ) : null}
      <span className="line-clamp-2 min-w-0 text-xs leading-tight sm:line-clamp-none sm:block sm:truncate sm:text-base">
        {t("siteName")}
      </span>
    </Link>
  );
}
