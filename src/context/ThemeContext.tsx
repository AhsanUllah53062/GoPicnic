import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

// ═══════════════════════════════════════════════════════════════
// Theme Context
// ═══════════════════════════════════════════════════════════════

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  isSystem: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
  toggleTheme: () => Promise<void>;
  setSystemTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("light");
  const [isSystem, setIsSystem] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load theme preference from AsyncStorage ──
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("app_theme");
        const savedIsSystem = await AsyncStorage.getItem("app_theme_is_system");

        if (savedIsSystem === "true") {
          setIsSystem(true);
          setThemeState((systemColorScheme as ThemeType) || "light");
        } else if (savedTheme) {
          setIsSystem(false);
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  // ── Set manual theme preference ──
  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      setIsSystem(false);
      await AsyncStorage.setItem("app_theme", newTheme);
      await AsyncStorage.setItem("app_theme_is_system", "false");
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // ── Toggle between light and dark ──
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    await setTheme(newTheme);
  };

  // ── Use system theme preference ──
  const setSystemTheme = async () => {
    try {
      setIsSystem(true);
      setThemeState((systemColorScheme as ThemeType) || "light");
      await AsyncStorage.setItem("app_theme_is_system", "true");
      await AsyncStorage.removeItem("app_theme");
    } catch (error) {
      console.error("Failed to set system theme:", error);
    }
  };

  const value: ThemeContextType = {
    theme,
    isDark: theme === "dark",
    isSystem,
    setTheme,
    toggleTheme,
    setSystemTheme,
  };

  if (isLoading) {
    return null; // Or return a loading screen
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
