import { MaterialIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Expense } from "../../services/expenses";

type Props = {
  expense: Expense;
  onDelete: () => void;
  onEdit: () => void;
};

export default function ExpenseCard({ expense, onDelete, onEdit }: Props) {
  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ],
    );
  };

  const getSplitLabel = () => {
    switch (expense.splitType) {
      case "equal":
        return "Split Equally";
      case "individual":
        return "Individual";
      default:
        return "Not Split";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onEdit}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={expense.categoryIcon as any}
          size={24}
          color="#6366F1"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.amount}>
            -{expense.currency} {expense.amount.toLocaleString()}
          </Text>
        </View>

        {expense.description && (
          <Text style={styles.description} numberOfLines={1}>
            {expense.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.detail}>
            <MaterialIcons name="person-outline" size={14} color="#9CA3AF" />
            <Text style={styles.detailText}>{expense.paidBy}</Text>
          </View>

          <View style={styles.dot} />

          <View style={styles.detail}>
            <MaterialIcons name="people-outline" size={14} color="#9CA3AF" />
            <Text style={styles.detailText}>{getSplitLabel()}</Text>
          </View>

          <View style={styles.dot} />

          <Text style={styles.detailText}>
            {expense.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1D5DB",
  },
  deleteButton: {
    padding: 4,
  },
});
