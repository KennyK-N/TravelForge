import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@components/ui/Button";

export default function Modal({
  ModalInterface,
  className = "",
  fn,
  ariaLabel = "",
  children,
  modalText = "Are you sure you want to delete this trip? This action cannot be undone.",
  disabled = false,
  useCustomButton = true,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {useCustomButton ? (
        <Button
          onClick={() => setOpen(true)}
          className={className}
          aria-label={ariaLabel}
          disabled={disabled}
        >
          {children}
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={className}
          aria-label={ariaLabel}
          disabled={disabled}
        >
          {children}
        </button>
      )}

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px] dark:bg-black/60">
            <div className="w-full max-w-md scale-100 rounded-2xl border border-gray-200 bg-white shadow-xl transition-all dark:border-white/[0.08] dark:bg-gray-900">
              <ModalInterface
                onClose={() => setOpen(false)}
                title="Delete Trip?"
                fn={fn}
              >
                <p>{modalText}</p>
              </ModalInterface>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
