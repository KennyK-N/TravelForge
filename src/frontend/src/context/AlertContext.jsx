/* eslint-disable react-refresh/only-export-components */

import {
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";

const AlertContext = createContext(null);

export function useAlertContext() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlertContext must be used inside AlertProvider");
  }

  return context;
}

export function AlertProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [alertType, setAlertType] = useState("None");

  const showAlert = useCallback((message, type) => {
    setValue(message);
    setAlertType(type);
    setOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setOpen(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      open,
      value,
      alertType,
      showAlert,
      hideAlert,
    }),
    [open, value, alertType, showAlert, hideAlert],
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
    </AlertContext.Provider>
  );
}
