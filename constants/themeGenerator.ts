import { StyleSheet } from "react-native";
import {
    BorderRadius,
    Colors,
    CommonStyles,
    Spacing,
    Typography,
} from "./styles";

// ═══════════════════════════════════════════════════════════════
// Theme-Aware Style Generators
// ═══════════════════════════════════════════════════════════════

type ThemeType = "light" | "dark";

/**
 * Get colors for a specific theme
 */
export const getThemeColors = (theme: ThemeType) => {
  return Colors[theme];
};

/**
 * Create theme-aware global styles
 */
export const createGlobalStyles = (theme: ThemeType) => {
  const colors = getThemeColors(theme);

  return StyleSheet.create({
    // Containers
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },

    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: Spacing.gutter,
    },

    // Scrollable containers
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },

    scrollContentContainer: {
      paddingHorizontal: Spacing.gutter,
      paddingVertical: Spacing.section,
    },
  });
};

/**
 * Create theme-aware typography styles
 */
export const createTypographyStyles = (theme: ThemeType) => {
  const colors = getThemeColors(theme);

  return StyleSheet.create({
    // Headings
    h1: {
      fontSize: Typography.sizes.h1,
      fontWeight: Typography.weights.extrabold,
      color: colors.text.primary,
      lineHeight: Typography.sizes.h1 * Typography.lineHeights.tight,
      letterSpacing: Typography.letterSpacing.tight,
    },

    h2: {
      fontSize: Typography.sizes.h2,
      fontWeight: Typography.weights.extrabold,
      color: colors.text.primary,
      lineHeight: Typography.sizes.h2 * Typography.lineHeights.tight,
      letterSpacing: Typography.letterSpacing.tight,
    },

    h3: {
      fontSize: Typography.sizes.h3,
      fontWeight: Typography.weights.bold,
      color: colors.text.primary,
      lineHeight: Typography.sizes.h3 * Typography.lineHeights.tight,
    },

    h4: {
      fontSize: Typography.sizes.h4,
      fontWeight: Typography.weights.bold,
      color: colors.text.primary,
    },

    h5: {
      fontSize: Typography.sizes.h5,
      fontWeight: Typography.weights.semibold,
      color: colors.text.primary,
    },

    h6: {
      fontSize: Typography.sizes.h6,
      fontWeight: Typography.weights.semibold,
      color: colors.text.primary,
    },

    // Body text
    body: {
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.regular,
      color: colors.text.primary,
      lineHeight: Typography.sizes.body * Typography.lineHeights.normal,
    },

    bodySmall: {
      fontSize: Typography.sizes.bodySmall,
      fontWeight: Typography.weights.regular,
      color: colors.text.secondary,
      lineHeight: Typography.sizes.bodySmall * Typography.lineHeights.normal,
    },

    // Labels
    label: {
      fontSize: Typography.sizes.label,
      fontWeight: Typography.weights.semibold,
      color: colors.text.tertiary,
      textTransform: "uppercase" as any,
      letterSpacing: Typography.letterSpacing.wide,
    },

    // Captions
    caption: {
      fontSize: Typography.sizes.caption,
      fontWeight: Typography.weights.medium,
      color: colors.text.tertiary,
    },

    captionSmall: {
      fontSize: Typography.sizes.tiny,
      fontWeight: Typography.weights.medium,
      color: colors.text.disabled,
    },
  });
};

/**
 * Create theme-aware button styles
 */
export const createButtonStyles = (theme: ThemeType) => {
  const colors = getThemeColors(theme);

  return StyleSheet.create({
    // Base button
    baseButton: {
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      minHeight: 48,
      ...CommonStyles.flexCenter,
    },

    // Size variants
    small: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      minHeight: 36,
    },

    medium: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      minHeight: 44,
    },

    large: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      minHeight: 52,
    },

    // Primary button
    primary: {
      backgroundColor: colors.primary,
    },

    primaryText: {
      color: colors.text.inverse,
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    },

    // Secondary button
    secondary: {
      backgroundColor: colors.secondary,
    },

    secondaryText: {
      color: colors.text.inverse,
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    },

    // Success button
    success: {
      backgroundColor: colors.success,
    },

    successText: {
      color: colors.text.inverse,
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    },

    // Danger button
    danger: {
      backgroundColor: colors.error,
    },

    dangerText: {
      color: colors.text.inverse,
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    },

    // Outline button
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.border.medium,
    },

    outlineText: {
      color: colors.primary,
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    },

    // Ghost button (text only)
    ghost: {
      backgroundColor: "transparent",
    },

    ghostText: {
      color: colors.primary,
      fontSize: Typography.sizes.body,
      fontWeight: Typography.weights.semibold,
    },

    // Disabled state
    disabled: {
      opacity: 0.6,
    },

    disabledText: {
      color: colors.text.disabled,
    },
  });
};
