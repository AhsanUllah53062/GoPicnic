import { MaterialIcons } from "@expo/vector-icons";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { EXPENSE_CATEGORIES, ExpenseCategory } from "../../services/expenses";

type Props = {
  selectedCategory: string;
  selectedIcon: string;
  onSelect: (category: ExpenseCategory) => void;
};

export default function CategorySelector({
  selectedCategory,
  selectedIcon,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category</Text>
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {EXPENSE_CATEGORIES.map((cat) => {
          const isSelected = cat.name === selectedCategory;
          return (
            <TouchableOpacity
              key={cat.name}
              style={[styles.categoryItem, isSelected && styles.selectedItem]}
              onPress={() => onSelect(cat)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={28}
                  color={isSelected ? "#007AFF" : "#8E8E93"}
                />
              </View>
              <Text
                style={[styles.categoryName, isSelected && styles.selectedText]}
              >
                {cat.name}
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 16,
  },
  selectedItem: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: "#E5F3FF",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  categoryName: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  selectedText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
