"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useLayoutEffect, type ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Đổi locale làm layout `[locale]` mount lại; React khi đó xóa attribute của
 * <html> (mất class `dark`) còn next-themes chỉ thêm lại trong useEffect, tức
 * sau một lần paint. Khôi phục bằng useLayoutEffect để không bị nháy sáng.
 */
function RestoreThemeClass() {
  const { resolvedTheme } = useTheme();

  useLayoutEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  return null;
}

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <RestoreThemeClass />
      {children}
    </NextThemesProvider>
  );
}
