import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<'COD' | 'Card' | 'Wallet' | null>(null);

  const handlePayNow = () => {
    if (!method) {
      alert('Please select a payment method');
      return;
    }
    // ✅ Navigate to confirmation screen
    router.replace('/shop/order-confirmation');
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#007AFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Payment Method</Text>

      <View style={styles.methods}>
        {['COD', 'Card', 'Wallet'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.methodBtn, method === m && styles.methodActive]}
            onPress={() => setMethod(m as 'COD' | 'Card' | 'Wallet')}
          >
            <Text
              style={[styles.methodText, method === m && styles.methodTextActive]}
            >
              {m === 'COD' ? 'Cash on Delivery' : m}
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
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  methods: { flexDirection: 'column', gap: 12 },
  methodBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  methodActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  methodText: { fontSize: 14, color: '#333' },
  methodTextActive: { color: '#fff', fontWeight: '600' },
  payBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  payText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
