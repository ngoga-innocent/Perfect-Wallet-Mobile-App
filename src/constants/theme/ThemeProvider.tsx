import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Appearance, ColorSchemeName } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

import type { ThemeColors, ThemeMode } from "./types";

const STORAGE_KEY = "@walletflow_theme";

interface ThemeContextType {
  theme: ThemeColors;

  mode: ThemeMode;

  isDark: boolean;

  setMode: (mode: ThemeMode) => Promise<void>;

  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const [mode, setModeState] = useState<ThemeMode>("system");

  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? "light",
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
    });
  }, []);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => listener.remove();
  }, []);

  const isDark = mode === "system" ? systemTheme === "dark" : mode === "dark";

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);

    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const toggleTheme = async () => {
    const next = isDark ? "light" : "dark";

    await setMode(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
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

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context)
    throw new Error("useThemeContext must be used inside ThemeProvider");

  return context;
}
