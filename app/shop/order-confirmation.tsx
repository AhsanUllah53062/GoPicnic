import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
    GlobalStyles,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { colors } = useThemedStyles();

  const styles = {
    container: {
      ...GlobalStyles.screenContainer,
      backgroundColor: colors.neutral.white,
      padding: Spacing.md,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    title: {
      ...TypographyStyles.h2,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
      color: colors.text.primary,
    },
    sub: {
      ...TypographyStyles.body,
      color: colors.text.secondary,
      marginBottom: Spacing.sm,
    },
    btn: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      borderRadius: 8,
      marginTop: Spacing.lg,
    },
    btnText: { color: colors.neutral.white, ...TypographyStyles.label },
  };

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      <Text style={styles.title}>Order Confirmed 🎉</Text>
      <Text style={styles.sub}>Thank you for your purchase!</Text>
      <Text style={styles.sub}>
        Your payment has been processed successfully.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/shopping")}
      >
        <Text style={styles.btnText}>Back to Shop</Text>
      </TouchableOpacity>
    </View>
  );
}
