import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart, total } = useCart();
  const router = useRouter();

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
                  <Ionicons name="remove-circle-outline" size={22} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
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
            onPress={() => router.push('/shop/checkout')} // ✅ navigate to checkout
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 13, color: '#007AFF', marginBottom: 6 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qty: { fontSize: 14, fontWeight: '600', marginHorizontal: 6 },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 12,
    marginTop: 'auto',
  },
  total: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  checkoutBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 40 },
});
