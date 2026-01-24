import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/shop/product-detail?id=${id}`); // ✅ navigate to detail screen with ID
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>Rs. {price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
});
