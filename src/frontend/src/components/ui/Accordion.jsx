export default function Accordion({
  id,
  setExpanded,
  expand,
  description,
  title,
}) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div
          className={
            expand
              ? "flex cursor-pointer items-center justify-between py-3 pl-6 pr-3 bg-gray-50 dark:bg-white/[0.03]"
              : "flex cursor-pointer items-center justify-between py-3 pl-6 pr-3"
          }
          onClick={() => setExpanded(id)}
        >
          <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <button
            className={
              expand
                ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 duration-200 transition-transform ease-linear dark:bg-white/[0.03] text-gray-800 dark:text-white/90 rotate-180"
                : "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 duration-200 transition-transform ease-linear dark:bg-white/[0.03] text-gray-500 dark:text-gray-400"
            }
          >
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`
          overflow-hidden
          transition-all
          duration-200
          ease-out
          ${expand ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div
            className={`
            px-6 py-7
            transition-all
            duration-200
            ease-out
            ${expand ? "translate-y-0" : "-translate-y-6"}
          `}
          >
            <p className="text-base text-gray-500 dark:text-gray-400 whitespace-normal break-words leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
