import { useEffect } from "react";

import { useAlertContext } from "@context/AlertContext";

export default function useErrorAlert({ error, isAnyError }) {
  const { showAlert } = useAlertContext();

  useEffect(() => {
    if (!isAnyError) return;

    const errorMsg =
      error?.response?.data?.msg ||
      error?.response?.data?.msg.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    showAlert(errorMsg, "error");
  }, [isAnyError, error, showAlert]);
}
