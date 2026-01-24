import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { products } from '../../../data/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find product by id
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Title + Price */}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>PKR {product.price}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < product.rating ? 'star' : 'star-outline'}
            size={18}
            color="#FFD700"
          />
        ))}
      </View>

      {/* Description (mock for now) */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        This is a high‑quality {product.name}, perfect for your picnic adventures.
        Durable, lightweight, and designed for comfort.
      </Text>

      {/* Reviews (mock for now) */}
      <Text style={styles.sectionTitle}>Reviews</Text>
      <View style={styles.review}>
        <Text style={styles.reviewUser}>Ali Khan</Text>
        <Text style={styles.reviewText}>Great product, very useful for outdoor trips!</Text>
      </View>
      <View style={styles.review}>
        <Text style={styles.reviewUser}>Sara Ahmed</Text>
        <Text style={styles.reviewText}>Loved it, highly recommend.</Text>
      </View>

      {/* Add to Cart */}
      <TouchableOpacity style={styles.cartBtn}>
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 16, color: '#999' },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  price: { fontSize: 18, fontWeight: '600', color: '#007AFF', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  description: { fontSize: 14, color: '#555', lineHeight: 20 },
  review: { marginBottom: 12 },
  reviewUser: { fontWeight: '600', fontSize: 14 },
  reviewText: { fontSize: 13, color: '#444' },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 30,
  },
  cartText: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 6 },
});
