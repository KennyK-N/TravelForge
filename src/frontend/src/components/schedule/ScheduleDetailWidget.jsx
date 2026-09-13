import { Clock, MapPin } from "lucide-react";

const dotColors = ["bg-indigo-500", "bg-violet-400", "bg-purple-300"];

export default function ScheduleDetail({ events }) {
  return (
    <div className="flex flex-none flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-md/4 md:flex-1 min-h-0 max-h-[14rem] md:max-h-none dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <Clock size={18} className="text-gray-500 dark:text-gray-400" />

        <h2 className="text-base font-medium text-gray-900 dark:text-white/90">
          Schedule details
        </h2>
      </div>

      <div className="flex min-h-0 flex-col overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent dark:scrollbar-thumb-white/[0.12]">
        {events.map((event, i) => (
          <div key={i} className="flex gap-4 pb-5 last:pb-0">
            <div className="flex shrink-0 flex-col items-center">
              <div
                className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  dotColors[i % dotColors.length]
                }`}
              />

              {i < events.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-gray-100 dark:bg-white/[0.08]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                <span>{event.time}</span>

                {event.places && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="flex items-center gap-1 truncate normal-case tracking-normal">
                      <MapPin size={12} />
                      {event.places}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white/90">
                {event.title}
              </div>

              <div className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {event.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
