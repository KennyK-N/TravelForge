import { CalendarDays } from "lucide-react";

export default function SchedulePlan({ items, onClick }) {
  return (
    <div className="flex flex-none flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-md/4 md:flex-1 min-h-0 max-h-[14rem] md:max-h-none dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <CalendarDays size={18} className="text-gray-500 dark:text-gray-400" />
        <h2 className="text-base font-medium text-gray-900 dark:text-white/90">
          Trip plan
        </h2>
      </div>

      <div className="flex min-h-0 flex-col gap-2.5 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent dark:scrollbar-thumb-white/[0.12]">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => onClick?.(index)}
            className={`
              cursor-pointer rounded-lg px-4 py-3.5 transition-colors
              ${
                item.active
                  ? "border border-blue-300 bg-blue-50 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10"
                  : "border border-gray-100 bg-gray-50 hover:border-gray-200 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-white/[0.14] dark:hover:bg-white/[0.06]"
              }
            `}
          >
            <div
              className={`
                text-[11px] font-medium uppercase tracking-wide
                ${item.active ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}
              `}
            >
              {item.date}
            </div>

            <div
              className={`
                mt-1 text-sm font-medium
                ${item.active ? "text-blue-900 dark:text-blue-300" : "text-gray-900 dark:text-white/90"}
              `}
            >
              {item.title}
            </div>

            <div
              className={`
                mt-0.5 text-sm
                ${item.active ? "text-blue-700 dark:text-blue-300/80" : "text-gray-500 dark:text-gray-400"}
              `}
            >
              {item.summary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
