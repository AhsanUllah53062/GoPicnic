import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  filled?: boolean; // true = solid background, false = outline
  style?: ViewStyle; // allow custom styles
};

export default function Button({
  title,
  onPress,
  filled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, filled ? styles.filled : styles.outline, style]}
    >
      <Text
        style={[styles.text, filled ? styles.filledText : styles.outlineText]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
