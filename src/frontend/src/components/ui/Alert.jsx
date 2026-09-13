import useAlertDismiss from "@hooks/useAlertDismiss";
import { useAlertContext } from "@context/AlertContext";

const alertStyles = {
  success: {
    container:
      "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/40",
    text: "text-green-900 dark:text-green-300",
    subText: "text-green-900 dark:text-green-400",
    icon: "fill-green-800 dark:fill-green-300",
    link: "text-green-800 dark:text-green-300",
    type: "Success!",
  },

  warning: {
    container:
      "bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800/40",
    text: "text-yellow-900 dark:text-yellow-300",
    subText: "text-yellow-900 dark:text-yellow-400",
    icon: "fill-yellow-800 dark:fill-yellow-300",
    link: "text-yellow-800 dark:text-yellow-300",
    type: "Warning!",
  },

  error: {
    container:
      "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/40",
    text: "text-red-900 dark:text-red-300",
    subText: "text-red-900 dark:text-red-400",
    icon: "fill-red-800 dark:fill-red-300",
    link: "text-red-800 dark:text-red-300",
    type: "Error!",
  },

  info: {
    container:
      "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40",
    text: "text-blue-900 dark:text-blue-300",
    subText: "text-blue-900 dark:text-blue-400",
    icon: "fill-blue-800 dark:fill-blue-300",
    link: "text-blue-800 dark:text-blue-300",
    type: "Info!",
  },
};

export default function Alert() {
  const { open, value, alertType } = useAlertContext();

  const { boxRef, closeAlert } = useAlertDismiss();
  const styles = alertStyles[alertType]
    ? alertStyles[alertType]
    : alertStyles["error"];
  return (
    <>
      <div
        ref={boxRef}
        className={`fixed right-0 bottom-10 block transform transition-all duration-150 ease-out z-[9999] max-w-100 min-w-75 ${
          open ? "scale-100" : "scale-0"
        }`}
      >
        {open && (
          <div
            className={`ml-auto text-sm p-3 rounded-md gap-3 border max-w-4xl ${styles.container}`}
            role="alert"
          >
            <button
              onClick={() => {
                closeAlert();
              }}
              type="button"
              aria-label={`Dismiss ${styles.type} alert`}
              className="dismiss-btn ml-auto flex items-center opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-3 cursor-pointer ${styles.icon}`}
                aria-hidden="true"
                viewBox="0 0 329.269 329"
              >
                <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" />
              </svg>
            </button>

            <div className={`flex items-start gap-2.5 ${styles.text}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-[18px] fill-current overflow-visible"
                viewBox="0 0 330 330"
                aria-hidden="true"
              >
                <path
                  d="M165 0C74.019 0 0 74.019 0 165s74.019 165 165 165 165-74.019 165-165S255.981 0 165 0m0 300c-74.44 0-135-60.561-135-135S90.56 30 165 30s135 60.561 135 135-60.561 135-135 135"
                  data-original="#000000"
                />
                <path
                  d="m226.872 106.664-84.854 84.853-38.89-38.891c-5.857-5.857-15.355-5.858-21.213-.001-5.858 5.858-5.858 15.355 0 21.213l49.496 49.498a15 15 0 0 0 10.606 4.394h.001c3.978 0 7.793-1.581 10.606-4.393l95.461-95.459c5.858-5.858 5.858-15.355 0-21.213s-15.355-5.859-21.213-.001"
                  data-original="#000000"
                />
              </svg>

              <div>
                <p className="font-medium leading-tight capitalize">
                  {styles.type}
                </p>
                {styles.type === "Error!" ? (
                  <p
                    className={`${styles.subText} mt-2 whitespace-normal break-all`}
                  >
                    Something went wrong: {value}
                  </p>
                ) : (
                  <p className={`${styles.subText} mt-2`}>{value}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
