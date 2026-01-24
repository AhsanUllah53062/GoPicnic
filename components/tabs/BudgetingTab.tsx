import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NewExpense, useTrip } from '../../src/context/TripContext';
import ExpenseEditorBottomSheet from '../ExpenseEditorBottomSheet';

export default function BudgetingTab() {
  const { budget, setBudget, expenses, addExpense, setExpenses } = useTrip();

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  // ✅ Use budget.spent directly from context
  const spentPercent = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;
  const progressWidth = Math.min(spentPercent, 100);
  const progressColor = spentPercent <= 100 ? '#007AFF' : '#FF3B30';

  const deleteExpense = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  const saveBudget = () => {
    if (tempBudget.trim()) {
      const newTotal = parseFloat(tempBudget);
      if (!isNaN(newTotal)) {
        setBudget((prev) => ({ ...prev, total: newTotal })); // only update total
      }
    }
    setShowBudgetModal(false);
    setTempBudget('');
  };

  return (
    <View style={styles.container}>
      {/* Budget Header */}
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetAmount}>PKR {budget.total.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => setShowBudgetModal(true)}>
          <Text style={styles.setBudgetText}>Edit budget</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressWidth}%`, backgroundColor: progressColor },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Spent: PKR {budget.spent.toFixed(2)} ({spentPercent.toFixed(0)}%)
        </Text>
      </View>

      {/* Expenses */}
      <View style={styles.expensesSection}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.placeholder}>You haven’t added any expenses yet.</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.expenseRow}>
                <MaterialIcons name={item.categoryIcon as any} size={22} color="#000" />
                <Text style={styles.expenseText}>
                  {item.category} — {item.amount} {item.currency}
                </Text>
                <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                  <MaterialIcons name="delete" size={22} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Add Expense Button */}
      <TouchableOpacity
        style={styles.addExpenseBtn}
        onPress={() => setShowExpenseModal(true)}
      >
        <MaterialIcons name="add" size={22} color="#fff" />
        <Text style={styles.addExpenseText}>Add Expense</Text>
      </TouchableOpacity>

      {/* Add Expense Bottom Sheet */}
      <ExpenseEditorBottomSheet
        visible={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSave={(expense: NewExpense) => {
          addExpense(expense); // ✅ context generates id
          setShowExpenseModal(false);
        }}
      />

      {/* Budget Modal */}
      <Modal visible={showBudgetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter budget amount"
              keyboardType="numeric"
              value={tempBudget}
              onChangeText={setTempBudget}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowBudgetModal(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={saveBudget}
              >
                <Text style={[styles.modalBtnText, styles.saveBtnText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  budgetHeader: {
    backgroundColor: '#001F54',
    paddingVertical: 30,
    alignItems: 'center',
  },
  budgetAmount: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  setBudgetText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  progressBar: {
    height: 12,
    width: '80%',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: '#eee',
  },
  progressFill: { height: '100%', borderRadius: 6 },
  progressText: { fontSize: 12, color: '#fff', marginTop: 6 },
  expensesSection: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    margin: 16,
    backgroundColor: '#fafafa',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  placeholder: { fontSize: 14, color: '#666', marginBottom: 20 },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseText: { marginLeft: 8, fontSize: 14, color: '#000', flex: 1 },
  addExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    margin: 20,
  },
  addExpenseText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { backgroundColor: '#fff', width: '80%', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    fontSize: 14,
    color: '#000',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  modalBtnText: { fontSize: 14, color: '#000' },
  saveBtn: { backgroundColor: '#000', borderRadius: 6 },
  saveBtnText: { color: '#fff' },
});
