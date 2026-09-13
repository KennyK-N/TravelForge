import { ChevronFirst, ChevronLast } from "lucide-react";
import { useSidebarContext } from "@/context/SidebarContext";

export default function Sidebar({ children }) {
  const { expanded, toggleSidebar, isMobile } = useSidebarContext();

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out ${
          isMobile ? "h-auto" : "h-screen"
        } ${
          isMobile
            ? expanded
              ? "h-screen w-full"
              : "w-auto"
            : expanded
              ? "h-screen w-64"
              : "w-auto"
        }`}
      >
        <nav
          className={`flex h-full flex-col overflow-y-scroll no-scrollbar ${
            !isMobile || expanded
              ? "border-r border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-gray-900 dark:shadow-[4px_0_18px_rgba(255,255,255,0.05)]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between p-4 pb-2">
            <button
              onClick={() => toggleSidebar()}
              className="rounded-lg bg-gray-50 p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {(!isMobile || expanded) && (
            <>
              <ul className="flex-1 px-3">{children}</ul>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
