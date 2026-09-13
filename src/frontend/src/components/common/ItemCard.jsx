import { MapPin, CalendarDays, Clock3, Trash2, Plane } from "lucide-react";

import Modal from "@components/common/modal/Modal";
import DeleteModal from "@components/common/modal/DeleteModal";

export default function ItemCard({
  trip,
  onDelete,
  confirmDelete = true,
  isLoading,
  onClick,
}) {
  const deleteButtonClass =
    "shrink-0 rounded-xl border border-gray-200 p-2 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.08] dark:text-gray-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-300";

  return (
    <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 ease-in-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.05]">
      {/* Top */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-gray-300">
          <Plane size={19} />
        </div>

        {confirmDelete ? (
          <Modal
            className={deleteButtonClass}
            ariaLabel="Delete trip"
            ModalInterface={DeleteModal}
            fn={onDelete}
            disabled={isLoading}
            useCustomButton={false}
          >
            <Trash2 size={17} />
          </Modal>
        ) : (
          <button
            type="button"
            onClick={onDelete}
            className={deleteButtonClass}
            aria-label="Delete trip"
            disabled={isLoading}
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>

      {/* Text info */}
      <div className="hover:cursor-pointer" onClick={() => onClick(trip.id)}>
        <div className="mt-4 min-w-0">
          <h2 className="break-words text-base font-semibold leading-snug text-gray-900 dark:text-white/90">
            {trip.name}
          </h2>

          <div className="mt-2 flex min-w-0 items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span className="break-words leading-snug">
              {trip.city}, {trip.country}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-5 grid grid-cols-1 gap-3 min-[500px]:grid-cols-2">
          <div className="min-w-0 rounded-xl bg-gray-50 p-3 dark:bg-white/[0.05]">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <CalendarDays size={13} className="shrink-0" />
              <span>From</span>
            </div>

            <p className="break-words text-sm font-semibold leading-snug text-gray-900 dark:text-white/90">
              {trip.fromDate}
            </p>
          </div>

          <div className="min-w-0 rounded-xl bg-gray-50 p-3 dark:bg-white/[0.05]">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <CalendarDays size={13} className="shrink-0" />
              <span>To</span>
            </div>

            <p className="break-words text-sm font-semibold leading-snug text-gray-900 dark:text-white/90">
              {trip.toDate}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between dark:border-white/[0.08]">
          <div className="flex min-w-0 items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock3 size={14} className="mt-0.5 shrink-0" />
            <span className="break-words leading-snug">
              Created {trip.createdAt}
            </span>
          </div>

          <span className="w-fit shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/[0.05] dark:text-gray-300">
            Trip
          </span>
        </div>
      </div>
    </div>
  );
}
