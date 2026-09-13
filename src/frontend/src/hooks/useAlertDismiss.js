import { useRef, useEffect, useCallback } from "react";
import { useAlertContext } from "@context/AlertContext";

export const useAlertDismiss = () => {
  const { open, value, alertType, hideAlert } = useAlertContext();

  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const boxRef = useRef(null);

  function clearTimer(ref) {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  }

  const closeAlert = useCallback(() => {
    clearTimer(timerRef);
    clearTimer(hideTimerRef);

    if (boxRef.current) {
      boxRef.current.classList.remove("scale-100");
      boxRef.current.classList.add("scale-0");
    }

    hideTimerRef.current = setTimeout(() => {
      hideAlert();
      hideTimerRef.current = null;
    }, 150);
  }, [hideAlert]);

  useEffect(() => {
    if (!open) return;
    clearTimer(timerRef);
    clearTimer(hideTimerRef);

    timerRef.current = setTimeout(() => {
      closeAlert();
    }, 5000);

    return () => {
      clearTimer(timerRef);
    };
  }, [open, value, alertType, closeAlert]);

  return {
    boxRef,
    closeAlert,
  };
};

export default useAlertDismiss;
