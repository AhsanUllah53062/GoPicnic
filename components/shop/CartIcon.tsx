import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function CartIcon() {
  const { cartItems } = useCart();
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/shop/cart')}>
      <Ionicons name="cart-outline" size={24} color="#333" />
      {cartItems.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartItems.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
