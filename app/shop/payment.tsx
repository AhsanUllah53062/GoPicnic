import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    BorderRadius,
    Colors,
    GlobalStyles,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";

export default function PaymentScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<"COD" | "Card" | "Wallet" | null>(null);

  const handlePayNow = () => {
    if (!method) {
      alert("Please select a payment method");
      return;
    }
    // ✅ Navigate to confirmation screen
    router.replace("/shop/order-confirmation");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#007AFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Payment Method</Text>

      <View style={styles.methods}>
        {["COD", "Card", "Wallet"].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.methodBtn, method === m && styles.methodActive]}
            onPress={() => setMethod(m as "COD" | "Card" | "Wallet")}
          >
            <Text
              style={[
                styles.methodText,
                method === m && styles.methodTextActive,
              ]}
            >
              {m === "COD" ? "Cash on Delivery" : m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Final Pay Now */}
      <TouchableOpacity style={styles.payBtn} onPress={handlePayNow}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.screenContainer,
    backgroundColor: Colors.neutral.white,
    padding: Spacing.md,
  },
  backBtn: { marginBottom: Spacing.sm },
  title: { ...TypographyStyles.h2, marginBottom: Spacing.md },
  methods: { flexDirection: "column", gap: Spacing.md },
  methodBtn: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  methodActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodText: { fontSize: 14, color: Colors.text.primary },
  methodTextActive: { color: Colors.neutral.white, fontWeight: "600" },
  payBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  payText: { color: Colors.neutral.white, ...TypographyStyles.label },
});
