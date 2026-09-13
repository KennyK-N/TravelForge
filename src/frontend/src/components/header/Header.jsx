import { ThemeToggleButton } from "@components/common/ThemeToggleButton";
import UserDropdown from "@components/header/UserDropdown";

function Header() {
  return (
    <header className="fixed top-0 z-10 flex w-full border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_4px_18px_rgba(255,255,255,0.04)] lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div
          className={`${"flex"} items-center justify-end w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* Dark Mode Toggler */}
            <ThemeToggleButton />
          </div>
          {/* User Area  */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header;
