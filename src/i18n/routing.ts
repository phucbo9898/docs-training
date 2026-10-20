import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
  // Luôn vào /vi khi truy cập "/", không đoán theo Accept-Language.
  localeDetection: false,
});
