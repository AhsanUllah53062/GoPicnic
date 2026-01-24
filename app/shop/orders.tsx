import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../src/context/CartContext';

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
                item.status === 'Delivered'
                  ? styles.delivered
                  : item.status === 'Shipped'
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
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  orderDate: { fontSize: 13, color: '#555' },
  tracking: { fontSize: 13, color: '#007AFF', marginTop: 2 },
  status: { fontSize: 14, fontWeight: '600' },
  delivered: { color: '#4CAF50' },
  shipped: { color: '#007AFF' },
  processing: { color: '#FF9500' },
  empty: { alignItems: 'center', marginTop: 40 },
});
