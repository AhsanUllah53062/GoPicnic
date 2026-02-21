import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    GlobalStyles,
    InputStyles,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";
import { useCart } from "../../src/context/CartContext";

export default function CheckoutScreen() {
  const { cartItems, updateQuantity, total, addOrder, clearCart } = useCart();
  const router = useRouter();
  const { colors } = useThemedStyles();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [trackingId] = useState(
    `TRK${Math.floor(100000 + Math.random() * 900000)}`,
  );

  const styles = {
    container: {
      ...GlobalStyles.screenContainer,
      backgroundColor: colors.neutral.white,
      padding: Spacing.md,
    },
    backBtn: { marginBottom: Spacing.sm },
    title: { ...TypographyStyles.h2, marginBottom: Spacing.md },
    sectionTitle: { ...TypographyStyles.h4, marginVertical: Spacing.md },
    itemRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginVertical: Spacing.sm,
    },
    itemName: { flex: 1, fontSize: 14, color: colors.text.primary },
    qtyRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: Spacing.sm,
    },
    qty: { fontSize: 14, fontWeight: "600" as const },
    itemPrice: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.primary,
    },
    total: {
      fontSize: 16,
      fontWeight: "600" as const,
      marginTop: Spacing.lg,
      color: colors.text.primary,
    },
    input: {
      ...InputStyles.baseInput,
      marginVertical: Spacing.sm,
      color: colors.text.primary,
    },
    trackingRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginVertical: Spacing.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 8,
    },
    trackingText: { flex: 1, fontSize: 14, color: colors.text.primary },
    payBtn: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.lg,
      borderRadius: 8,
      alignItems: "center" as const,
      marginTop: Spacing.xl,
    },
    payText: { color: colors.neutral.white, ...TypographyStyles.label },
  };

  const copyTrackingId = () => {
    Clipboard.setStringAsync(trackingId);
    alert("Tracking ID copied!");
  };

  const handleProceedToPayment = () => {
    if (!name || !address || !phone) {
      alert("Please fill all shipping information");
      return;
    }

    const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      items: cartItems,
      total,
      date: new Date().toISOString().split("T")[0],
      status: "Processing" as "Processing",
      shipping: { name, address, phone },
      trackingId,
    };

    // ✅ Save order in context
    addOrder(newOrder);

    // Clear cart after saving
    clearCart();

    // Navigate to payment screen
    router.push("/shop/payment");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#007AFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Checkout</Text>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                <Ionicons
                  name="remove-circle-outline"
                  size={22}
                  color="#007AFF"
                />
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>
              PKR {item.price * item.quantity}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.total}>Total: PKR {total}</Text>
        }
      />

      {/* Shipping Info */}
      <Text style={styles.sectionTitle}>Shipping Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Tracking ID with copy option */}
      <View style={styles.trackingRow}>
        <Text style={styles.trackingText}>Tracking ID: {trackingId}</Text>
        <TouchableOpacity onPress={copyTrackingId}>
          <Ionicons name="copy-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Proceed to Payment */}
      <TouchableOpacity style={styles.payBtn} onPress={handleProceedToPayment}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}
