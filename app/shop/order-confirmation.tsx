import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderConfirmationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      <Text style={styles.title}>Order Confirmed 🎉</Text>
      <Text style={styles.sub}>Thank you for your purchase!</Text>
      <Text style={styles.sub}>Your payment has been processed successfully.</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/shopping')}
      >
        <Text style={styles.btnText}>Back to Shop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  sub: { fontSize: 14, color: '#555', marginBottom: 6 },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
