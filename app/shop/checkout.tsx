import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function CheckoutScreen() {
  const { cartItems, updateQuantity, total, addOrder, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingId] = useState(`TRK${Math.floor(100000 + Math.random() * 900000)}`);

  const copyTrackingId = () => {
    Clipboard.setStringAsync(trackingId);
    alert('Tracking ID copied!');
  };

  const handleProceedToPayment = () => {
    if (!name || !address || !phone) {
      alert('Please fill all shipping information');
      return;
    }

    const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      items: cartItems,
      total,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing' as 'Processing',
      shipping: { name, address, phone },
      trackingId,
    };

    // ✅ Save order in context
    addOrder(newOrder);

    // Clear cart after saving
    clearCart();

    // Navigate to payment screen
    router.push('/shop/payment');
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
                <Ionicons name="remove-circle-outline" size={22} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>PKR {item.price * item.quantity}</Text>
          </View>
        )}
        ListFooterComponent={<Text style={styles.total}>Total: PKR {total}</Text>}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: { fontSize: 14, flex: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qty: { fontSize: 14, fontWeight: '600', marginHorizontal: 6 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#007AFF' },
  total: { fontSize: 16, fontWeight: '700', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  trackingText: { fontSize: 14, fontWeight: '600', color: '#333' },
  payBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  payText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
