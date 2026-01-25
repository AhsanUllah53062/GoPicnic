import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addExpense,
  calculateTotalSpent,
  CreateExpenseData,
  deleteExpense,
  Expense,
  getExpensesByCategory,
  getTripExpenses,
  updateExpense,
} from "../../services/expenses";
import { Trip, updateTrip } from "../../services/trips";
import ExpenseCard from "../budget/ExpenseCard";
import ExpenseEditorModal from "../budget/ExpenseEditorModal";

type Props = {
  tripId: string;
  trip: Trip;
};

export default function BudgetingTab({ tripId, trip }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [tempBudget, setTempBudget] = useState("");

  useEffect(() => {
    loadExpenses();
  }, [tripId]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const expensesList = await getTripExpenses(tripId);
      setExpenses(expensesList);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: CreateExpenseData) => {
    try {
      await addExpense(expenseData);
      await loadExpenses();
    } catch (error: any) {
      Alert.alert("Error", "Failed to add expense");
    }
  };

  const handleEditExpense = async (expenseData: CreateExpenseData) => {
    if (!editingExpense?.id) return;

    try {
      await updateExpense(tripId, editingExpense.id, expenseData);
      setEditingExpense(null);
      await loadExpenses();
    } catch (error: any) {
      Alert.alert("Error", "Failed to update expense");
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(tripId, expenseId);
      await loadExpenses();
    } catch (error: any) {
      Alert.alert("Error", "Failed to delete expense");
    }
  };

  const handleUpdateBudget = async () => {
    if (!tempBudget.trim()) {
      Alert.alert("Invalid Budget", "Please enter a valid budget amount");
      return;
    }

    const newBudget = parseFloat(tempBudget);
    if (isNaN(newBudget) || newBudget <= 0) {
      Alert.alert("Invalid Budget", "Please enter a valid positive number");
      return;
    }

    try {
      await updateTrip(tripId, { budget: newBudget });
      trip.budget = newBudget;
      setShowBudgetModal(false);
      setTempBudget("");
      Alert.alert("Success", "Budget updated successfully");
    } catch (error: any) {
      Alert.alert("Error", "Failed to update budget");
    }
  };

  const totalSpent = calculateTotalSpent(expenses);
  const remaining = trip.budget - totalSpent;
  const isOverBudget = remaining < 0;
  const spentPercent = trip.budget > 0 ? (totalSpent / trip.budget) * 100 : 0;
  const progressWidth = Math.min(spentPercent, 100);

  const byCategory = getExpensesByCategory(expenses);
  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Budget Overview Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetLabel}>Trip Budget</Text>
            <TouchableOpacity
              onPress={() => {
                setTempBudget(trip.budget.toString());
                setShowBudgetModal(true);
              }}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={18} color="#6B7280" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.budgetAmount}>
            {trip.currency} {trip.budget.toLocaleString()}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progressWidth}%`,
                    backgroundColor: isOverBudget
                      ? "#EF4444"
                      : spentPercent > 75
                        ? "#F59E0B"
                        : "#10B981",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {spentPercent.toFixed(0)}% {isOverBudget ? "over budget" : "used"}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
                <MaterialIcons name="trending-up" size={20} color="#EF4444" />
              </View>
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={styles.statValue}>
                {trip.currency} {totalSpent.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statBox}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: isOverBudget ? "#FEE2E2" : "#D1FAE5" },
                ]}
              >
                <MaterialIcons
                  name={isOverBudget ? "warning" : "account-balance-wallet"}
                  size={20}
                  color={isOverBudget ? "#EF4444" : "#10B981"}
                />
              </View>
              <Text style={styles.statLabel}>
                {isOverBudget ? "Over Budget" : "Remaining"}
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: isOverBudget ? "#EF4444" : "#10B981" },
                ]}
              >
                {trip.currency} {Math.abs(remaining).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Over Budget Warning */}
          {isOverBudget && (
            <View style={styles.warningBanner}>
              <MaterialIcons name="error-outline" size={20} color="#DC2626" />
              <Text style={styles.warningText}>
                You've exceeded your budget by {trip.currency}{" "}
                {Math.abs(remaining).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <View style={styles.categoriesCard}>
            <Text style={styles.cardTitle}>Top Spending</Text>
            <View style={styles.categoriesList}>
              {topCategories.map(([category, amount], index) => {
                const percent = (amount / totalSpent) * 100;
                return (
                  <View key={category} style={styles.categoryRow}>
                    <View style={styles.categoryInfo}>
                      <View
                        style={[
                          styles.categoryDot,
                          {
                            backgroundColor:
                              index === 0
                                ? "#6366F1"
                                : index === 1
                                  ? "#8B5CF6"
                                  : "#EC4899",
                          },
                        ]}
                      />
                      <Text style={styles.categoryName}>{category}</Text>
                    </View>
                    <View style={styles.categoryStats}>
                      <Text style={styles.categoryAmount}>
                        {trip.currency} {amount.toLocaleString()}
                      </Text>
                      <Text style={styles.categoryPercent}>
                        {percent.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Expenses List */}
        <View style={styles.expensesCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>All Expenses</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{expenses.length}</Text>
            </View>
          </View>

          {expenses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <MaterialIcons name="receipt-long" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No expenses yet</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking your spending
              </Text>
            </View>
          ) : (
            <View style={styles.expensesList}>
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onDelete={() => handleDeleteExpense(expense.id!)}
                  onEdit={() => {
                    setEditingExpense(expense);
                    setShowExpenseModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Add Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingExpense(null);
            setShowExpenseModal(true);
          }}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Expense Editor Modal */}
      <ExpenseEditorModal
        visible={showExpenseModal}
        tripId={tripId}
        expense={editingExpense}
        onClose={() => {
          setShowExpenseModal(false);
          setEditingExpense(null);
        }}
        onSave={editingExpense ? handleEditExpense : handleAddExpense}
      />

      {/* Edit Budget Modal */}
      <Modal visible={showBudgetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Budget</Text>
            <Text style={styles.modalSubtitle}>Set your total trip budget</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyPrefix}>{trip.currency}</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={tempBudget}
                onChangeText={setTempBudget}
                autoFocus
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => {
                  setShowBudgetModal(false);
                  setTempBudget("");
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleUpdateBudget}
              >
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  budgetCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  editText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  budgetAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "500",
  },
  categoriesCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  categoriesList: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  categoryStats: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  categoryPercent: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  expensesCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  expensesList: {
    padding: 16,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    paddingVertical: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#6366F1",
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
