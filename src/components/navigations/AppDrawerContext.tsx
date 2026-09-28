// components/navigations/AppDrawerContext.tsx

import React, { createContext, useCallback, useContext, useState } from "react";

interface AppDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const AppDrawerContext = createContext<AppDrawerContextType | undefined>(
  undefined,
);

export function AppDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <AppDrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </AppDrawerContext.Provider>
  );
}

export function useAppDrawer() {
  const context = useContext(AppDrawerContext);

  if (!context) {
    throw new Error("useAppDrawer must be used inside AppDrawerProvider");
  }

  return context;
}
