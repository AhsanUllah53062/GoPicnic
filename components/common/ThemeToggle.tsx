import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderRadius, Spacing } from "../../constants/styles";
import { useThemedStyles } from "../../hooks/useThemedStyles";
import { useAppTheme } from "../../src/context/ThemeContext";

// ═══════════════════════════════════════════════════════════════
// Theme Toggle Component
// Allows users to switch between light/dark/system themes
// ═══════════════════════════════════════════════════════════════

export function ThemeToggleButton() {
  const { theme, toggleTheme, setSystemTheme, isSystem } = useAppTheme();
  const { styles: themedStyles, colors } = useThemedStyles();

  const styles = StyleSheet.create({
    button: {
      flexDirection: "row" as const,
      alignItems: "center",
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    icon: {
      marginRight: Spacing.sm,
    },
    textContainer: {
      flex: 1,
    },
    text: {
      fontSize: themedStyles.typography.body.fontSize,
      fontWeight: themedStyles.typography.body.fontWeight,
      color: themedStyles.typography.body.color,
    },
    subtext: {
      fontSize: themedStyles.typography.caption.fontSize,
      fontWeight: themedStyles.typography.caption.fontWeight,
      color: colors.text.secondary,
      marginTop: 4,
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Ionicons
        name={theme === "dark" ? "moon" : "sunny"}
        size={20}
        color={colors.primary}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </Text>
        <Text style={styles.subtext}>{isSystem ? "(System)" : "(Manual)"}</Text>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Theme Settings Menu
 * Shows all theme options (Light, Dark, System)
 */
export function ThemeSettingsMenu() {
  const { theme, setTheme, setSystemTheme, isSystem } = useAppTheme();
  const { colors } = useThemedStyles();

  const options = [
    { id: "light", label: "Light Mode", icon: "sunny" },
    { id: "dark", label: "Dark Mode", icon: "moon" },
    { id: "system", label: "System Theme", icon: "settings" },
  ];

  const styles = StyleSheet.create({
    container: {
      gap: Spacing.sm,
    },
    option: {
      flexDirection: "row" as const,
      alignItems: "center",
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    optionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "15", // 15% opacity
    },
    icon: {
      marginRight: Spacing.md,
    },
    label: {
      flex: 1,
      fontSize: 16,
      color: colors.text.primary,
      fontWeight: "500" as const,
    },
    checkmark: {
      marginLeft: Spacing.sm,
    },
  });

  const handleOptionPress = (optionId: string) => {
    if (optionId === "system") {
      setSystemTheme();
    } else {
      setTheme(optionId as "light" | "dark");
    }
  };

  const isActive = (optionId: string) => {
    if (optionId === "system") {
      return isSystem;
    }
    return !isSystem && theme === optionId;
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[styles.option, isActive(option.id) && styles.optionActive]}
          onPress={() => handleOptionPress(option.id)}
        >
          <Ionicons
            name={option.icon as any}
            size={20}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>{option.label}</Text>
          {isActive(option.id) && (
            <Ionicons
              name="checkmark"
              size={20}
              color={colors.primary}
              style={styles.checkmark}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
