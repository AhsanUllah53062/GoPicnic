import { ButtonStyles, Colors } from "@/constants/componentStyles";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        ButtonStyles.baseButton,
        ButtonStyles[variant],
        ButtonStyles[size],
        disabled && ButtonStyles.disabled,
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
      disabled={disabled}
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
  button: {
    width: 250,
    paddingVertical: 12,
    borderRadius: 6,
    marginVertical: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  filled: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  outlined: {
    backgroundColor: "#fff",
    borderColor: "#000",
  },
  text: {
    fontSize: 16,
  },
  filledText: {
    color: "#fff",
  },
  outlinedText: {
    color: "#000",
  },
});
