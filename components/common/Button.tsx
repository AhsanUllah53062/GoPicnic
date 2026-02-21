import { ButtonStyles, Colors } from "@/constants/componentStyles";
import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        ButtonStyles.baseButton,
        ButtonStyles[variant],
        ButtonStyles[size],
        disabled && ButtonStyles.disabled,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text
        style={[
          ButtonStyles.buttonText,
          variant === "outline" || variant === "ghost"
            ? { color: Colors.primary }
            : { color: Colors.neutral.white },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Kept for backward compatibility - styles from ButtonStyles are used above
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  filled: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#007bff",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  filledText: {
    color: "#fff",
  },
  outlineText: {
    color: "#007bff",
  },
});
