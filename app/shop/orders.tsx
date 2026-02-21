import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Colors,
    GlobalStyles,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";
import { useCart } from "../../src/context/CartContext";

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useCart(); // ✅ get real orders from context

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#007AFF" />
      </TouchableOpacity>

      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderRow}
            onPress={() => alert(`Order ${item.id} details coming soon`)}
          >
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.orderDate}>Date: {item.date}</Text>
              {/* ✅ Show tracking ID if available */}
              {item.trackingId && (
                <Text style={styles.tracking}>Tracking: {item.trackingId}</Text>
              )}
            </View>
            <Text
              style={[
                styles.status,
                item.status === "Delivered"
                  ? styles.delivered
                  : item.status === "Shipped"
                    ? styles.shipped
                    : styles.processing,
              ]}
            >
              {item.status}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No orders yet</Text>
          </View>
        }
      />
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
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.border.light,
  },
  orderInfo: { flex: 1 },
  orderId: { ...TypographyStyles.h4, marginBottom: Spacing.xs },
  orderDate: { fontSize: 13, color: Colors.text.secondary },
  tracking: { fontSize: 13, color: Colors.primary, marginTop: Spacing.xs },
  status: { ...TypographyStyles.label },
  delivered: { color: Colors.success },
  shipped: { color: Colors.primary },
  processing: { color: Colors.accent },
  empty: { alignItems: "center", marginTop: Spacing.xl },
});
