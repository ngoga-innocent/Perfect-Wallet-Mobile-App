import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "nativewind";

import type { ThemeMode } from "./types";

const STORAGE_KEY = "@walletflow_theme";

interface ThemeContextType {
  mode: ThemeMode;

  isDark: boolean;

  setMode: (mode: ThemeMode) => Promise<void>;

  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const { colorScheme, setColorScheme } = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    async function loadTheme() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);

        setColorScheme(saved);
      }
    }

    loadTheme();
  }, []);

  const isDark = colorScheme === "dark";

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);

    await AsyncStorage.setItem(STORAGE_KEY, newMode);

    setColorScheme(newMode);
  };

  const toggleTheme = async () => {
    await setMode(isDark ? "light" : "dark");
  };

  console.log("Theme mode:", mode);
  console.log("NativeWind scheme:", colorScheme);
  console.log("Is dark:", isDark);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark,
        setMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
