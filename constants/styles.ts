/**
 * Global Styling System for goPicnic
 * Professional, Vibrant, Modern Design System
 * All colors, typography, spacing, and component styles in one place
 */

import { Platform } from "react-native";

// ═══════════════════════════════════════════════════════════════
// 🎨 LIGHT MODE COLOR PALETTE
// ═══════════════════════════════════════════════════════════════

const LightColors = {
  // ── Core Branding Colors ──
  primary: "#345AFA", // Solid Blue - Main CTA, primary actions
  primaryLight: "#5B7FFF", // Lighter blue for hover states
  primaryDark: "#1E3FD9", // Darker blue for active states

  secondary: "#06B6D4", // Teal - Secondary actions, highlights
  secondaryLight: "#2DDFFF", // Light teal for backgrounds
  secondaryDark: "#0891B2", // Dark teal for active states

  accent: "#FF9500", // Orange - Carpool/activity highlights
  accentLight: "#FFAA33", // Light orange for hover
  accentDark: "#CC7700", // Dark orange for active

  // ── Semantic Colors ──
  success: "#10B981", // Green - Confirmations, success states
  successLight: "#6EE7B7", // Light green for backgrounds
  successDark: "#059669", // Dark green for active

  warning: "#F1CD0E", // Yellow - Warnings, alerts
  warningLight: "#FDE047", // Light yellow
  warningDark: "#CA8A04", // Dark yellow

  error: "#FF361D", // Red - Errors, destructive actions
  errorLight: "#FF8A80", // Light red for backgrounds
  errorDark: "#CC2A16", // Dark red for active

  info: "#3B82F6", // Blue - Informational messages
  infoLight: "#93C5FD", // Light blue for backgrounds
  infoDark: "#1D4ED8", // Dark blue for active

  // ── Neutral Colors (Gray Scale) ──
  neutral: {
    white: "#FFFFFF", // Pure white
    50: "#F9FAFB", // Very light gray
    100: "#F3F4F6", // Light gray
    150: "#F5F5F5", // Light gray (backgrounds)
    200: "#E5E7EB", // Medium light gray (borders)
    300: "#D1D5DB", // Medium gray
    400: "#9CA3AF", // Medium-dark gray
    500: "#64646E", // Medium gray (your sub-text color)
    600: "#4A4A54", // Dark gray
    700: "#374151", // Darker gray
    800: "#1F2937", // Very dark gray
    900: "#111827", // Almost black
    black: "#000000", // Pure black
  },

  // ── Brand Colors ──
  solid: {
    color: "#080E1E", // Your solid dark primary
    dark2: "#4A4A54", // Fixed duplicate (was FF361D)
    dark3: "#24272D", // Your solid dark 3
    input: "#EFEEEE", // Your input background
    text: "#2A2A2E", // Recommended primary text
  },

  // ── Semantic Aliases (Light Mode) ──
  background: "#FFFFFF",
  surface: "#F9FAFB",
  surfaceAlt: "#24272D",
  text: {
    primary: "#2A2A2E", // Main text
    secondary: "#4A4A54", // Secondary text
    tertiary: "#64646E", // Labels, captions
    inverse: "#FFFFFF", // Text on dark backgrounds
    disabled: "#9CA3AF", // Disabled text
  },
  border: {
    light: "#E0E0E0", // Light borders
    medium: "#D1D5DB", // Medium borders
    dark: "#9CA3AF", // Dark borders
  },
  input: {
    background: "#EFEEEE", // Your input color
    border: "#E0E0E0", // Input border
    borderFocus: "#345AFA", // Input focus border (primary blue)
    placeholder: "#64646E", // Placeholder text
  },
  overlay: {
    light: "rgba(0, 0, 0, 0.3)",
    medium: "rgba(0, 0, 0, 0.5)",
    dark: "rgba(0, 0, 0, 0.7)",
  },
};

// ═══════════════════════════════════════════════════════════════
// 🎨 DARK MODE COLOR PALETTE
// ═══════════════════════════════════════════════════════════════

const DarkColors = {
  // ── Core Branding Colors (adjusted for dark mode) ──
  primary: "#5B7FFF", // Lighter blue for better contrast on dark
  primaryLight: "#7B9EFF", // Even lighter for hover states
  primaryDark: "#3B5FDB", // Darker shade for active states

  secondary: "#2DDFFF", // Lighter teal for dark mode
  secondaryLight: "#4DEAFF", // Even lighter for hover
  secondaryDark: "#1DB5D4", // Darker shade for active

  accent: "#FFAA33", // Lighter orange for dark mode
  accentLight: "#FFBB55", // Even lighter for hover
  accentDark: "#DD8800", // Darker shade for active

  // ── Semantic Colors (adjusted for dark mode) ──
  success: "#6EE7B7", // Lighter green for dark mode
  successLight: "#95F5D4", // Even lighter for backgrounds
  successDark: "#10B981", // Darker shade for active

  warning: "#FDE047", // Lighter yellow for dark mode
  warningLight: "#FFED6A", // Even lighter
  warningDark: "#F1CD0E", // Darker shade for active

  error: "#FF8A80", // Lighter red for dark mode
  errorLight: "#FFA8A0", // Even lighter for backgrounds
  errorDark: "#FF361D", // Darker shade for active

  info: "#93C5FD", // Lighter blue for dark mode
  infoLight: "#BFDBFE", // Even lighter for backgrounds
  infoDark: "#3B82F6", // Darker shade for active

  // ── Neutral Colors (Dark mode gray scale) ──
  neutral: {
    white: "#000000", // Pure black (reverse)
    50: "#1F2937", // Very dark gray
    100: "#374151", // Dark gray
    150: "#4B5563", // Medium-dark gray
    200: "#6B7280", // Medium gray
    300: "#9CA3AF", // Medium-light gray
    400: "#D1D5DB", // Light gray
    500: "#E5E7EB", // Very light gray
    600: "#F3F4F6", // Light gray
    700: "#F9FAFB", // Very light gray
    800: "#FFFFFF", // Pure white (reverse)
    900: "#FFFFFF", // Almost white
    black: "#FFFFFF", // Pure white (reverse)
  },

  // ── Brand Colors (Dark mode) ──
  solid: {
    color: "#F0F4FF", // Light color for dark backgrounds
    dark2: "#B4B8C4", // Lighter gray
    dark3: "#D8DCE3", // Much lighter gray
    input: "#2D3139", // Dark input background
    text: "#E5E7EB", // Light text for dark mode
  },

  // ── Semantic Aliases (Dark Mode) ──
  background: "#0F1419", // Very dark background
  surface: "#1A1F26", // Dark surface
  surfaceAlt: "#2D3139", // Alternate dark surface
  text: {
    primary: "#E5E7EB", // Light text
    secondary: "#D1D5DB", // Medium-light text
    tertiary: "#9CA3AF", // Medium text
    inverse: "#000000", // Dark text on light backgrounds
    disabled: "#6B7280", // Disabled text (medium gray)
  },
  border: {
    light: "#4B5563", // Dark borders
    medium: "#6B7280", // Medium-dark borders
    dark: "#9CA3AF", // Medium-light borders
  },
  input: {
    background: "#2D3139", // Dark input background
    border: "#4B5563", // Dark border
    borderFocus: "#5B7FFF", // Primary color for focus
    placeholder: "#9CA3AF", // Medium text for placeholder
  },
  overlay: {
    light: "rgba(0, 0, 0, 0.5)",
    medium: "rgba(0, 0, 0, 0.7)",
    dark: "rgba(0, 0, 0, 0.9)",
  },
};

// ═══════════════════════════════════════════════════════════════
// 🎨 THEME-AWARE COLOR EXPORT
// ═══════════════════════════════════════════════════════════════

export const Colors = {
  light: LightColors,
  dark: DarkColors,
  // Default to light (will be overridden by useAppTheme)
  ...LightColors,
};

// ═══════════════════════════════════════════════════════════════
// 🔤 TYPOGRAPHY - Professional & Clear
// ═══════════════════════════════════════════════════════════════

export const Typography = {
  // Font sizes (in pixels)
  sizes: {
    // Headings
    h1: 36,
    h2: 32,
    h3: 28,
    h4: 24,
    h5: 20,
    h6: 18,

    // Body
    body: 16,
    bodySmall: 14,

    // Labels & captions
    label: 13,
    caption: 12,
    tiny: 11,
    xs: 10,
  },

  // Font weights
  weights: {
    thin: "200" as any,
    light: "300" as any,
    regular: "400" as any,
    medium: "500" as any,
    semibold: "600" as any,
    bold: "700" as any,
    extrabold: "800" as any,
    black: "900" as any,
  },

  // Line heights for readability
  lineHeights: {
    tight: 1.2, // For headings
    normal: 1.5, // For body text
    relaxed: 1.75, // For descriptions
    loose: 2, // For spaced layouts
  },

  // Letter spacing for typography
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },

  // Font family (platform-specific)
  families: Platform.select({
    ios: {
      regular: "System",
      bold: "System",
      mono: "Menlo",
    },
    android: {
      regular: "Roboto",
      bold: "Roboto",
      mono: "RobotoMono",
    },
    default: {
      regular: "Arial",
      bold: "Arial",
      mono: "Courier New",
    },
  }),
};

// ═══════════════════════════════════════════════════════════════
// 📏 SPACING - Consistent & Scalable (Base unit: 4px)
// ═══════════════════════════════════════════════════════════════

export const Spacing = {
  // Incremental spacing (multiples of 4)
  xs: 4, // Micro spacing
  sm: 8, // Small spacing
  md: 12, // Medium spacing
  lg: 16, // Large spacing
  xl: 20, // Extra large
  xxl: 24, // 2x large
  xxxl: 32, // 3x large
  huge: 40, // Large gap
  massive: 48, // Very large gap
  giant: 56, // Giant gap
  colossal: 64, // Colossal gap

  // Semantic spacing
  gutter: 20, // Screen padding
  section: 24, // Section spacing
  component: 12, // Component spacing
  element: 8, // Element spacing
};

// ═══════════════════════════════════════════════════════════════
// 🎯 BORDER RADIUS - Modern & Consistent
// ═══════════════════════════════════════════════════════════════

export const BorderRadius = {
  none: 0,
  sm: 4, // Small rounded - inputs, small buttons
  md: 8, // Medium rounded - cards, moderate elements
  lg: 12, // Large rounded - prominent cards
  xl: 16, // Extra large - large components
  xxl: 20, // 2x large - modals, large cards
  xxxl: 24, // 3x large - section backgrounds
  full: 999, // Fully rounded - circular buttons, avatars
};

// ═══════════════════════════════════════════════════════════════
// 💫 SHADOWS - Depth & Elevation
// ═══════════════════════════════════════════════════════════════

export const Shadows = {
  // None
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Subtle - For slight depth
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  // Small - For cards, buttons
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // Medium - Standard card shadow
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Large - Prominent components
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  // Extra Large - Modal, overlay
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Extra Extra Large - Full screen overlays
  xxl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
};

// ═══════════════════════════════════════════════════════════════
// 🎨 THEME PRESETS - For consistency
// ═══════════════════════════════════════════════════════════════

export const Variants = {
  // Button variants
  button: {
    primary: {
      backgroundColor: Colors.primary,
      color: Colors.neutral.white,
    },
    secondary: {
      backgroundColor: Colors.secondary,
      color: Colors.neutral.white,
    },
    success: {
      backgroundColor: Colors.success,
      color: Colors.neutral.white,
    },
    danger: {
      backgroundColor: Colors.error,
      color: Colors.neutral.white,
    },
    outline: {
      backgroundColor: Colors.neutral.white,
      borderColor: Colors.primary,
      color: Colors.primary,
    },
    ghost: {
      backgroundColor: "transparent",
      color: Colors.primary,
    },
  },

  // Badge variants
  badge: {
    primary: {
      backgroundColor: Colors.primaryLight,
      color: Colors.primary,
    },
    secondary: {
      backgroundColor: Colors.secondaryLight,
      color: Colors.secondary,
    },
    success: {
      backgroundColor: Colors.successLight,
      color: Colors.success,
    },
    warning: {
      backgroundColor: Colors.warningLight,
      color: Colors.warning,
    },
    error: {
      backgroundColor: Colors.errorLight,
      color: Colors.error,
    },
  },

  // Card variants
  card: {
    elevated: {
      backgroundColor: Colors.neutral.white,
      borderRadius: BorderRadius.lg,
      ...Shadows.md,
    },
    flat: {
      backgroundColor: Colors.neutral.white,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border.light,
    },
    filled: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// 🚀 PERFORMANCE & RESPONSIVE
// ═══════════════════════════════════════════════════════════════

export const Responsive = {
  // Common breakpoints for responsive layouts
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
  },

  // Grid system
  grid: {
    columns: 12,
    gap: Spacing.md,
  },
};

// ═══════════════════════════════════════════════════════════════
// 📱 SCREEN SAFE AREAS & LAYOUT
// ═══════════════════════════════════════════════════════════════

export const Layout = {
  screenPadding: Spacing.gutter,
  cardPadding: Spacing.lg,
  elementPadding: Spacing.md,

  // Common screen margins
  marginHorizontal: Spacing.gutter,
  marginVertical: Spacing.section,

  // Tab bar height (rough estimate)
  tabBarHeight: 60,
  headerHeight: 56,
};

// ═══════════════════════════════════════════════════════════════
// 🎯 COMMONLY USED COMBINATIONS
// ═══════════════════════════════════════════════════════════════

export const CommonStyles = {
  // Flex layouts
  flexCenter: {
    justifyContent: "center" as any,
    alignItems: "center" as any,
  },

  flexBetween: {
    justifyContent: "space-between" as any,
    alignItems: "center" as any,
  },

  flexStart: {
    justifyContent: "flex-start" as any,
    alignItems: "flex-start" as any,
  },

  // Row/Column
  row: {
    flexDirection: "row" as any,
  },

  column: {
    flexDirection: "column" as any,
  },

  // Centering
  centerHorizontal: {
    alignItems: "center" as any,
  },

  centerVertical: {
    justifyContent: "center" as any,
  },
};

// Export all together for convenience
export const AppTheme = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Variants,
  Responsive,
  Layout,
  CommonStyles,
};

export default AppTheme;

// ═══════════════════════════════════════════════════════════════
// ✅ RE-EXPORTS: Component-Level Styling (for convenience)
// ═══════════════════════════════════════════════════════════════

export {
    AlertStyles,
    BadgeStyles,
    ButtonStyles,
    CardStyles,
    DividerStyles,
    GlobalStyles,
    InputStyles,
    ListItemStyles,
    SectionStyles,
    TypographyStyles
} from "./componentStyles";

