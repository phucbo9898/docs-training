import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center gap-3 px-4">
        <MenuButton />
        <Logo />
        {/* Mobile: nút tìm kiếm, ngôn ngữ và theme nằm trong drawer. */}
        <div className="ml-auto hidden shrink-0 md:block lg:min-w-0 lg:max-w-xs lg:flex-1">
          <SearchBox showShortcut compact />
        </div>
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
