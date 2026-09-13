const ComponentCard = ({
  isSearch = false,
  title = "",
  children,
  className = "",
  desc = "",
  onChange = () => {},
}) => {
  return (
    <div
      className={`h-[calc(100vh-9rem)] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="shrink-0 px-6 py-5 bg-white dark:bg-gray-900">
        {isSearch ? (
          <input
            type="text"
            placeholder="Search"
            className="h-14 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-base text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            name="search"
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        ) : (
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
        )}

        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto border-t border-gray-100 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent dark:border-gray-800 dark:scrollbar-thumb-white/[0.12] dark:scrollbar-track-transparent sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
