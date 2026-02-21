import { useMemo } from "react";
import {
    createButtonStyles,
    createGlobalStyles,
    createTypographyStyles,
    getThemeColors,
} from "../constants/themeGenerator";
import { useAppTheme } from "../src/context/ThemeContext";

// ═══════════════════════════════════════════════════════════════
// useThemedStyles Hook
// Provides theme-aware styles and colors for any component
// ═══════════════════════════════════════════════════════════════

export function useThemedStyles() {
  const { theme } = useAppTheme();

  // Memoize style generation to avoid recreation on every render
  const styles = useMemo(() => {
    return {
      global: createGlobalStyles(theme),
      typography: createTypographyStyles(theme),
      buttons: createButtonStyles(theme),
    };
  }, [theme]);

  const colors = useMemo(() => getThemeColors(theme), [theme]);

  return {
    styles,
    colors,
    theme,
  };
}
