export default function DeleteModal({ onClose, title, children, fn }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/[0.08]">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>

        <button
          onClick={onClose}
          className="rounded-full px-2 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="px-5 py-4 text-gray-600 dark:text-gray-400">
        {children}
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-white/[0.08]">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            fn?.();
            onClose();
          }}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white transition hover:bg-brand-600"
        >
          Confirm
        </button>
      </div>
    </>
  );
}
