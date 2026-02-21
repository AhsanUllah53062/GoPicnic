# 📖 STYLING SYSTEM - Developer Guide

## Quick Start

### Import the constants:

```tsx
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/styles";
import {
  GlobalStyles,
  ButtonStyles,
  CardStyles,
  InputStyles,
} from "@/constants/componentStyles";
```

### Use them in your components:

```tsx
const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.screenContainer,
    paddingHorizontal: Spacing.gutter,
  },

  title: {
    ...TypographyStyles.h3,
  },

  button: {
    ...ButtonStyles.baseButton,
    ...ButtonStyles.primary,
  },
});
```

---

## 🎨 Colors

### Primary Colors

```tsx
Colors.primary; // #345AFA - Main blue button, important CTAs
Colors.primaryLight; // #5B7FFF - Button hover state
Colors.primaryDark; // #1E3FD9 - Button active state
```

### Secondary Colors

```tsx
Colors.secondary; // #06B6D4 - Teal secondary buttons
Colors.accent; // #FF9500 - Orange carpool highlights
```

### Semantic Colors

```tsx
Colors.success; // #10B981 - Green confirmations
Colors.warning; // #F1CD0E - Yellow warnings
Colors.error; // #FF361D - Red errors
Colors.info; // #3B82F6 - Blue info messages
```

### Text Colors

```tsx
Colors.text.primary; // #2A2A2E - Main headings & body
Colors.text.secondary; // #4A4A54 - Secondary text
Colors.text.tertiary; // #64646E - Labels & captions
Colors.text.disabled; // #9CA3AF - Disabled text
```

### Backgrounds

```tsx
Colors.neutral.white; // #FFFFFF - Main background
Colors.surface; // #F9FAFB - Light card backgrounds
Colors.surfaceAlt; // #24272D - Dark alternative
Colors.neutral[900]; // #111827 - Dark backgrounds
```

### Borders

```tsx
Colors.border.light; // #E0E0E0 - Subtle borders
Colors.border.medium; // #D1D5DB - Standard borders
Colors.border.dark; // #9CA3AF - Strong borders
```

### Input Colors

```tsx
Colors.input.background; // #EFEEEE - Input field background
Colors.input.border; // #E0E0E0 - Input border
Colors.input.borderFocus; // #345AFA - Focused input border (blue)
Colors.input.placeholder; // #64646E - Placeholder text
```

---

## 📏 Spacing Scale (Base: 4px)

```tsx
Spacing.xs; // 4px   - Micro spacing
Spacing.sm; // 8px   - Small gaps
Spacing.md; // 12px  - Medium spacing
Spacing.lg; // 16px  - Standard padding
Spacing.xl; // 20px  - Large spacing
Spacing.xxl; // 24px  - Section spacing
Spacing.xxxl; // 32px  - Large gaps
Spacing.huge; // 40px  - Huge gaps
Spacing.massive; // 48px  - Colossal gaps
```

### Semantic Spacing

```tsx
Spacing.gutter; // 20px - Screen horizontal padding
Spacing.section; // 24px - Section vertical spacing
Spacing.component; // 12px - Component internal spacing
Spacing.element; // 8px  - Element gap spacing
```

---

## 🎯 Border Radius

```tsx
BorderRadius.sm; // 4px   - Small inputs
BorderRadius.md; // 8px   - Standard cards
BorderRadius.lg; // 12px  - Prominent cards
BorderRadius.xl; // 16px  - Large components
BorderRadius.xxl; // 20px  - Modals
BorderRadius.full; // 999px - Circular (avatars)
```

---

## 💫 Shadows (Elevation)

```tsx
Shadows.none; // No shadow
Shadows.xs; // Subtle
Shadows.sm; // Cards & buttons
Shadows.md; // Standard cards
Shadows.lg; // Elevated components
Shadows.xl; // Modals
Shadows.xxl; // Full overlays
```

### Using Shadows:

```tsx
const styles = StyleSheet.create({
  card: {
    ...Shadows.md, // Spread shadow properties
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
});
```

---

## 🔤 Typography

### Font Sizes

```tsx
Typography.sizes.h1; // 36px - Page title
Typography.sizes.h2; // 32px - Section title
Typography.sizes.h3; // 28px - Subsection
Typography.sizes.h4; // 24px - Card title
Typography.sizes.h5; // 20px - Heading
Typography.sizes.h6; // 18px - Small heading
Typography.sizes.body; // 16px - Body text
Typography.sizes.bodySmall; // 14px - Secondary body
Typography.sizes.label; // 13px - Form labels
Typography.sizes.caption; // 12px - Captions
```

### Font Weights

```tsx
Typography.weights.regular; // 400 - Normal
Typography.weights.medium; // 500 - Emphasis
Typography.weights.semibold; // 600 - Important
Typography.weights.bold; // 700 - Strong
Typography.weights.extrabold; // 800 - Very strong
```

### Line Heights

```tsx
Typography.lineHeights.tight; // 1.2  - Headings
Typography.lineHeights.normal; // 1.5  - Body text
Typography.lineHeights.relaxed; // 1.75 - Descriptions
Typography.lineHeights.loose; // 2.0  - Spaced layouts
```

---

## 🎨 Pre-Made Component Styles

### Button Styles

```tsx
// Combine these in StyleSheet.create():
...ButtonStyles.baseButton      // Base button styling
...ButtonStyles.primary         // Blue button
...ButtonStyles.primaryText     // White text

// Other variants: secondary, success, danger, outline, ghost
// Also available: ButtonStyles.small, .medium, .large
```

### Card Styles

```tsx
...CardStyles.elevated          // White card with shadow
...CardStyles.flat              // White card with border
...CardStyles.normalPadding     // Standard padding

// Also: .compactPadding, .generousPadding
```

### Input Styles

```tsx
...InputStyles.baseInput        // Styled input field
...InputStyles.baseInputContainer // Input wrapper
...InputStyles.inputLabel       // Label text
...InputStyles.helperText       // Helper text below
```

### Badge Styles

```tsx
...BadgeStyles.primary          // Blue badge background
...BadgeStyles.primaryText      // Badge text color

// Other variants: secondary, success, warning, error, accent
// Also available: BadgeStyles.small, .medium, .large
```

### Global Styles

```tsx
...GlobalStyles.screenContainer // Full-screen container
...GlobalStyles.safeContainer   // With horizontal padding
```

---

## 📋 Common Patterns

### Card with Shadow

```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
});
```

### Input Field

```tsx
const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.input.background,
    borderWidth: 1,
    borderColor: Colors.input.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    color: Colors.text.primary,
    fontSize: Typography.sizes.body,
  },
});
```

### Primary Button

```tsx
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: Colors.neutral.white,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },
});
```

### Badge

```tsx
const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: Colors.primary,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
});
```

### Section Divider

```tsx
const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },
});
```

---

## ✅ Implementation Checklist

When creating new components:

- ✅ Import from `@/constants/styles`
- ✅ Use `Colors` for all colors
- ✅ Use `Spacing` for padding/margin
- ✅ Use `BorderRadius` for border-radius
- ✅ Use `Shadows` for elevation
- ✅ Use `Typography` for fonts
- ✅ Check `ComponentStyles` for pre-made styles
- ✅ Test on different screen sizes
- ❌ Never hardcode hex colors
- ❌ Never use magic spacing numbers
- ❌ Never duplicate button/card/input styles

---

## 🚀 Example Component

```tsx
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants/styles";
import {
  GlobalStyles,
  ButtonStyles,
  TypographyStyles,
} from "@/constants/componentStyles";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to goPicnic</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Plan a Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.screenContainer,
    paddingHorizontal: Spacing.gutter,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    ...TypographyStyles.h2,
    marginBottom: Spacing.section,
  },

  button: {
    ...ButtonStyles.baseButton,
    ...ButtonStyles.primary,
  },

  buttonText: {
    ...ButtonStyles.primaryText,
  },
});
```

---

## 📞 Need Help?

All constants are in:

- **Colors, Typography, Spacing, etc:** `@/constants/styles.ts`
- **Component styles:** `@/constants/componentStyles.ts`
- **This guide:** `STYLING_SYSTEM.md`

For questions or additions, check the source files directly!
