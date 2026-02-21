import { GlobalStyles } from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import CartIcon from "../../components/shop/CartIcon";
import CategoryTabs from "../../components/shop/CategoryTabs";
import ProductCard from "../../components/shop/ProductCard";
import SearchBar from "../../components/shop/SearchBar";
import { categories } from "../../data/categories";
import { products } from "../../data/products";

export default function ShoppingScreen() {
  const { colors } = useThemedStyles();
  const [selectedCategory, setSelectedCategory] = useState("Essentials");
  const [search, setSearch] = useState("");

  // Filter products by category + search keyword
  const filteredProducts = products.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(search.toLowerCase()),
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

const styles = {
  container: {
    flex: 1,
    ...GlobalStyles.screenContainer,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  grid: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  empty: {
    alignItems: "center" as const,
    marginTop: Spacing.xl,
  },
};
