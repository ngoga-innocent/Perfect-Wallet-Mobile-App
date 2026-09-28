import { createContext, useContext, useState } from "react";

import AppAlert from "./AppAlert";

import { AlertData } from "./types";

interface ContextType {
  showAlert: (data: AlertData) => void;

  hideAlert: () => void;
}

const AlertContext = createContext<ContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertData | null>(null);

  const showAlert = (data: AlertData) => {
    setAlert(data);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        hideAlert,
      }}
    >
      {children}

      {alert && <AppAlert {...alert} onClose={hideAlert} />}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }

  return context;
}
