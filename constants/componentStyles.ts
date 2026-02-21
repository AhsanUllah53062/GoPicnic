/**
 * Component-Level Styling Mixins
 * Reusable style combinations for common UI patterns
 */

import { StyleSheet } from "react-native";
import {
    BorderRadius,
    Colors,
    CommonStyles,
    Shadows,
    Spacing,
    Typography,
} from "./styles";

// ═══════════════════════════════════════════════════════════════
// 📋 GLOBAL BASE STYLES
// ═══════════════════════════════════════════════════════════════

export const GlobalStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Spacing.gutter,
  },

  // Scrollable containers
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.neutral.white,
  },

  scrollContentContainer: {
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.section,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🎯 TYPOGRAPHY PRESETS
// ═══════════════════════════════════════════════════════════════

export const TypographyStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.extrabold,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.h1 * Typography.lineHeights.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },

  h2: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.extrabold,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.h2 * Typography.lineHeights.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },

  h3: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.h3 * Typography.lineHeights.tight,
  },

  h4: {
    fontSize: Typography.sizes.h4,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },

  h5: {
    fontSize: Typography.sizes.h5,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },

  h6: {
    fontSize: Typography.sizes.h6,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },

  // Body text
  body: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.text.primary,
    lineHeight: Typography.sizes.body * Typography.lineHeights.normal,
  },

  bodySmall: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.sizes.bodySmall * Typography.lineHeights.normal,
  },

  // Labels
  label: {
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.tertiary,
    textTransform: "uppercase" as any,
    letterSpacing: Typography.letterSpacing.wide,
  },

  // Captions
  caption: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.text.tertiary,
  },

  captionSmall: {
    fontSize: Typography.sizes.tiny,
    fontWeight: Typography.weights.medium,
    color: Colors.text.disabled,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🎨 BUTTON STYLES
// ═══════════════════════════════════════════════════════════════

export const ButtonStyles = StyleSheet.create({
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
    backgroundColor: Colors.primary,
  },

  primaryText: {
    color: Colors.neutral.white,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },

  // Secondary button
  secondary: {
    backgroundColor: Colors.secondary,
  },

  secondaryText: {
    color: Colors.neutral.white,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },

  // Success button
  success: {
    backgroundColor: Colors.success,
  },

  successText: {
    color: Colors.neutral.white,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },

  // Danger button
  danger: {
    backgroundColor: Colors.error,
  },

  dangerText: {
    color: Colors.neutral.white,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },

  // Outline button
  outline: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  outlineText: {
    color: Colors.primary,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },

  // Ghost button
  ghost: {
    backgroundColor: "transparent",
  },

  ghostText: {
    color: Colors.primary,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  disabledText: {
    color: Colors.text.disabled,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🎴 CARD STYLES
// ═══════════════════════════════════════════════════════════════

export const CardStyles = StyleSheet.create({
  // Base card
  baseCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: "hidden" as any,
  },

  // Elevated card
  elevated: {
    backgroundColor: Colors.neutral.white,
    ...Shadows.md,
  },

  // Flat card
  flat: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  // Filled card
  filled: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },

  // Padding variants
  compactPadding: {
    padding: Spacing.md,
  },

  normalPadding: {
    padding: Spacing.lg,
  },

  generousPadding: {
    padding: Spacing.xl,
  },

  // Header
  cardHeader: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  cardTitle: {
    fontSize: Typography.sizes.h5,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },

  // Content
  cardContent: {
    paddingVertical: Spacing.md,
  },

  // Footer
  cardFooter: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});

// ═══════════════════════════════════════════════════════════════
// 📝 INPUT STYLES
// ═══════════════════════════════════════════════════════════════

export const InputStyles = StyleSheet.create({
  // Base input container
  baseInputContainer: {
    marginVertical: Spacing.sm,
  },

  // Input field
  baseInput: {
    backgroundColor: Colors.input.background,
    borderWidth: 1,
    borderColor: Colors.input.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.sizes.body,
    color: Colors.text.primary,
    minHeight: 48,
  },

  // Input focus state
  inputFocused: {
    borderColor: Colors.input.borderFocus,
    borderWidth: 2,
  },

  // Input error state
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1,
  },

  // Placeholder styling
  inputPlaceholder: {
    color: Colors.input.placeholder,
  },

  // Label
  inputLabel: {
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  // Helper text
  helperText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },

  // Error text
  errorText: {
    fontSize: Typography.sizes.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },

  // Multi-line input
  multilineInput: {
    minHeight: 100,
    paddingTop: Spacing.md,
    textAlignVertical: "top" as any,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🎀 BADGE & TAG STYLES
// ═══════════════════════════════════════════════════════════════

export const BadgeStyles = StyleSheet.create({
  // Base badge
  baseBadge: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignSelf: "flex-start" as any,
  },

  // Primary badge
  primary: {
    backgroundColor: Colors.primaryLight,
  },

  primaryText: {
    color: Colors.primary,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },

  // Secondary badge
  secondary: {
    backgroundColor: Colors.secondaryLight,
  },

  secondaryText: {
    color: Colors.secondary,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },

  // Success badge
  success: {
    backgroundColor: Colors.successLight,
  },

  successText: {
    color: Colors.success,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },

  // Warning badge
  warning: {
    backgroundColor: Colors.warningLight,
  },

  warningText: {
    color: Colors.warning,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },

  // Error badge
  error: {
    backgroundColor: Colors.errorLight,
  },

  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },

  // Accent badge
  accent: {
    backgroundColor: Colors.accentLight,
  },

  accentText: {
    color: Colors.accent,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },

  // Size variants
  small: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },

  medium: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },

  large: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🔲 DIVIDER STYLES
// ═══════════════════════════════════════════════════════════════

export const DividerStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },

  dividerThin: {
    height: 0.5,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.sm,
  },

  dividerThick: {
    height: 2,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.lg,
  },

  verticalDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🏷️ SECTION HEADER STYLES
// ═══════════════════════════════════════════════════════════════

export const SectionStyles = StyleSheet.create({
  sectionContainer: {
    marginBottom: Spacing.section,
  },

  sectionHeader: {
    flexDirection: "row" as any,
    justifyContent: "space-between" as any,
    alignItems: "center" as any,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.sizes.h5,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },

  sectionSubtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },

  sectionAction: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
});

// ═══════════════════════════════════════════════════════════════
// 📊 LIST ITEM STYLES
// ═══════════════════════════════════════════════════════════════

export const ListItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  content: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },

  title: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },

  rightContent: {
    flexDirection: "row" as any,
    alignItems: "center" as any,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
  },
});

// ═══════════════════════════════════════════════════════════════
// 🔔 NOTIFICATION & ALERT STYLES
// ═══════════════════════════════════════════════════════════════

export const AlertStyles = StyleSheet.create({
  baseAlert: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    flexDirection: "row" as any,
    alignItems: "flex-start" as any,
  },

  successAlert: {
    backgroundColor: Colors.successLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },

  successText: {
    color: Colors.success,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },

  warningAlert: {
    backgroundColor: Colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },

  warningText: {
    color: Colors.warning,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },

  errorAlert: {
    backgroundColor: Colors.errorLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },

  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },

  infoAlert: {
    backgroundColor: Colors.infoLight,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },

  infoText: {
    color: Colors.info,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },
});

// ═══════════════════════════════════════════════════════════════
// ✅ COMBINED EXPORT
// ═══════════════════════════════════════════════════════════════

export const ComponentStyles = {
  GlobalStyles,
  TypographyStyles,
  ButtonStyles,
  CardStyles,
  InputStyles,
  BadgeStyles,
  DividerStyles,
  SectionStyles,
  ListItemStyles,
  AlertStyles,
};

export default ComponentStyles;
