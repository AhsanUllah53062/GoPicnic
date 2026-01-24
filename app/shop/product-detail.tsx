import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { id } = useLocalSearchParams(); // assuming you pass product ID via navigation

  // Mock product data (replace with real fetch later)
  const product = {
    id: 'tent001',
    name: 'Treckamp Camping Tent',
    size: '200×150 cm',
    price: 3950,
    rating: 4,
    reviews: 102,
    description:
      'A picnic tent provides you with shelter from rain, wind, and harsh sunlight. It ensures that you and your companions can enjoy your meals and activities without worrying about getting wet or sunburned.',
    delivery: 'Standard Delivery 5 Dec - 7 Dec',
    colors: ['Black', 'White', 'Green', 'Red', 'Yellow'],
    image: 'https://your-image-url.com/tent.jpg',
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#007AFF" />
      </TouchableOpacity>

      {/* Product Image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Product Info */}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.size}>Size: {product.size}</Text>
      <Text style={styles.price}>Rs. {product.price}</Text>
      <Text style={styles.rating}>
        {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)} ({product.reviews} Reviews)
      </Text>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Delivery */}
      <Text style={styles.sectionTitle}>Delivery</Text>
      <Text style={styles.delivery}>{product.delivery}</Text>

      {/* Colors */}
      <Text style={styles.sectionTitle}>Colors</Text>
      <View style={styles.colorRow}>
        {product.colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              selectedColor === color && styles.colorSelected,
              { backgroundColor: color.toLowerCase() },
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      {/* Quantity */}
      <Text style={styles.sectionTitle}>Quantity</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Ionicons name="remove-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.qty}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Add to Cart */}
      <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backBtn: { marginBottom: 10 },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  size: { fontSize: 14, color: '#555', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#007AFF', marginBottom: 4 },
  rating: { fontSize: 14, color: '#888', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  description: { fontSize: 14, color: '#444' },
  delivery: { fontSize: 14, color: '#444' },
  colorRow: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 10 },
  qty: { fontSize: 16, fontWeight: '600' },
  cartBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cartText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
