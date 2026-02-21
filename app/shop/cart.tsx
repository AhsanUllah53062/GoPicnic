import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Spacing } from "../../constants/styles";
import { useThemedStyles } from "../../hooks/useThemedStyles";
import { useCart } from "../../src/context/CartContext";

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart, total } = useCart();
  const router = useRouter();
  const { styles: themedStyles, colors } = useThemedStyles();

  const styles = StyleSheet.create({
    container: {
      ...themedStyles.global.screenContainer,
      paddingHorizontal: Spacing.gutter,
    },
    title: {
      fontSize: themedStyles.typography.h2.fontSize,
      fontWeight: themedStyles.typography.h2.fontWeight,
      color: themedStyles.typography.h2.color,
      marginBottom: Spacing.lg,
    },
    itemRow: {
      flexDirection: "row" as const,
      alignItems: "center",
      marginBottom: Spacing.md,
      paddingBottom: Spacing.md,
      borderBottomColor: colors.border.light,
      borderBottomWidth: 1,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: Spacing.md,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: themedStyles.typography.body.fontSize,
      fontWeight: themedStyles.typography.body.fontWeight,
      color: themedStyles.typography.body.color,
      marginBottom: 4,
    },
    price: {
      fontSize: themedStyles.typography.bodySmall.fontSize,
      fontWeight: themedStyles.typography.bodySmall.fontWeight,
      color: themedStyles.typography.bodySmall.color,
    },
    qtyRow: {
      flexDirection: "row" as const,
      alignItems: "center",
      marginTop: Spacing.sm,
    },
    qty: {
      marginHorizontal: Spacing.sm,
      color: colors.text.primary,
    },
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    footer: {
      borderTopColor: colors.border.light,
      borderTopWidth: 1,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.lg,
    },
    total: {
      fontSize: themedStyles.typography.h4.fontSize,
      fontWeight: themedStyles.typography.h4.fontWeight,
      color: themedStyles.typography.h4.color,
      marginBottom: Spacing.md,
    },
    checkoutBtn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      alignItems: "center",
      marginTop: Spacing.md,
    },
    checkoutText: {
      color: colors.text.inverse,
      fontSize: themedStyles.typography.body.fontSize,
      fontWeight: themedStyles.typography.body.fontWeight,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>PKR {item.price}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={22}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>Your cart is empty</Text>
          </View>
        }
      />

      {/* Total + Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: PKR {total}</Text>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => router.push("/shop/checkout")}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
