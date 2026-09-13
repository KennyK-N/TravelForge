import { useSidebarContext } from "@/context/SidebarContext";

export default function SideBarItem({ icon, text, active, alert }) {
  const { expanded, isMobile } = useSidebarContext();

  return (
    <>
      {(!isMobile || expanded) && (
        <li
          className={`group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium transition-colors ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:from-indigo-500/20 dark:to-indigo-500/10 dark:text-indigo-300"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
          }`}
        >
          <span className="shrink-0">{icon}</span>

          <span
            className={`overflow-hidden transition-all ${
              expanded ? "ml-3 h-full w-52" : "h-0 w-0"
            }`}
          >
            {text}
          </span>

          {alert && (
            <div
              className={`absolute right-2 h-2 w-2 rounded bg-indigo-400 dark:bg-indigo-300 ${
                expanded ? "" : "top-2"
              }`}
            ></div>
          )}

          {!expanded && (
            <div className="invisible absolute left-full ml-6 -translate-x-3 rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-800 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 dark:bg-gray-800 dark:text-indigo-300">
              {text}
            </div>
          )}
        </li>
      )}
    </>
  );
}
