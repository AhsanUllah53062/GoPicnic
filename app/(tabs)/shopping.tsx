import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CartIcon from '../../components/shop/CartIcon';
import CategoryTabs from '../../components/shop/CategoryTabs';
import ProductCard from '../../components/shop/ProductCard';
import SearchBar from '../../components/shop/SearchBar';
import { categories } from '../../data/categories';
import { products } from '../../data/products';

export default function ShoppingScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Essentials');
  const [search, setSearch] = useState('');

  // Filter products by category + search keyword
  const filteredProducts = products.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search + Cart */}
      <View style={styles.header}>
        <SearchBar value={search} onChangeText={setSearch} />
        <CartIcon />
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        active={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard {...item} />}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No products found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
});
