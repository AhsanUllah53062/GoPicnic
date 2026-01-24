import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CategoryTabsProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export default function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onSelect(cat)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});
