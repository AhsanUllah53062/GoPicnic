import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CreateExpenseData,
  Expense,
  ExpenseCategory,
  SplitType,
} from "../../services/expenses";
import CategorySelector from "./CategorySelector";

type Props = {
  visible: boolean;
  tripId: string;
  expense?: Expense | null;
  onClose: () => void;
  onSave: (expense: CreateExpenseData) => void;
};

const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "INR", "AED"];
const SPLIT_OPTIONS: { value: SplitType; label: string; icon: string }[] = [
  { value: "don't split", label: "Don't Split", icon: "person" },
  { value: "equal", label: "Split Equally", icon: "group" },
  { value: "individual", label: "Individual", icon: "people-outline" },
];

export default function ExpenseEditorModal({
  visible,
  tripId,
  expense,
  onClose,
  onSave,
}: Props) {
  const [step, setStep] = useState<"amount" | "category" | "details">("amount");

  // Form data
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [category, setCategory] = useState("Food");
  const [categoryIcon, setCategoryIcon] = useState("restaurant");
  const [paidBy, setPaidBy] = useState("You");
  const [splitType, setSplitType] = useState<SplitType>("don't split");
  const [description, setDescription] = useState("");

  // Load expense data when editing
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCurrency(expense.currency);
      setCategory(expense.category);
      setCategoryIcon(expense.categoryIcon);
      setPaidBy(expense.paidBy);
      setSplitType(expense.splitType);
      setDescription(expense.description || "");
      setStep("details"); // Skip to details for editing
    }
  }, [expense]);

  const resetForm = () => {
    setAmount("");
    setCurrency("PKR");
    setCategory("Food");
    setCategoryIcon("restaurant");
    setPaidBy("You");
    setSplitType("don't split");
    setDescription("");
    setStep("amount");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCategorySelect = (cat: ExpenseCategory) => {
    setCategory(cat.name);
    setCategoryIcon(cat.icon);
    setStep("details");
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    const expense: CreateExpenseData = {
      tripId,
      amount: parseFloat(amount),
      currency,
      category,
      categoryIcon,
      paidBy,
      splitType,
      description: description || undefined,
      date: new Date(),
    };

    console.log("💾 Saving expense:", expense);
    onSave(expense);
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {expense ? "Edit Expense" : "Add Expense"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.step, step === "amount" && styles.activeStep]}>
            <Text
              style={[
                styles.stepText,
                step === "amount" && styles.activeStepText,
              ]}
            >
              1
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, step === "category" && styles.activeStep]}>
            <Text
              style={[
                styles.stepText,
                step === "category" && styles.activeStepText,
              ]}
            >
              2
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, step === "details" && styles.activeStep]}>
            <Text
              style={[
                styles.stepText,
                step === "details" && styles.activeStepText,
              ]}
            >
              3
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Amount */}
          {step === "amount" && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>How much did you spend?</Text>

              <View style={styles.amountContainer}>
                {/* Currency Selector */}
                <View style={styles.currencySelector}>
                  {CURRENCIES.map((curr) => (
                    <TouchableOpacity
                      key={curr}
                      style={[
                        styles.currencyButton,
                        currency === curr && styles.selectedCurrency,
                      ]}
                      onPress={() => setCurrency(curr)}
                    >
                      <Text
                        style={[
                          styles.currencyText,
                          currency === curr && styles.selectedCurrencyText,
                        ]}
                      >
                        {curr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Amount Input */}
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor="#C7C7CC"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !amount && styles.disabledButton,
                ]}
                onPress={() => amount && setStep("category")}
                disabled={!amount}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Category */}
          {step === "category" && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Category</Text>
              <CategorySelector
                selectedCategory={category}
                selectedIcon={categoryIcon}
                onSelect={handleCategorySelect}
              />
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep("amount")}
              >
                <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Add Details</Text>

              {/* Selected Amount & Category Preview - Make it Editable */}
              <TouchableOpacity
                style={styles.previewCard}
                onPress={() => setStep("category")}
              >
                <View style={styles.previewIcon}>
                  <MaterialIcons
                    name={categoryIcon as any}
                    size={32}
                    color="#007AFF"
                  />
                </View>
                <View style={styles.previewContent}>
                  <Text style={styles.previewCategory}>{category}</Text>
                  <Text style={styles.previewAmount}>
                    {currency} {parseFloat(amount).toLocaleString()}
                  </Text>
                </View>
                <MaterialIcons name="edit" size={20} color="#6366F1" />
              </TouchableOpacity>

              {/* Paid By */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Paid By</Text>
                <View style={styles.detailCard}>
                  <MaterialIcons name="person" size={22} color="#007AFF" />
                  <TextInput
                    style={styles.detailInput}
                    placeholder="Who paid?"
                    placeholderTextColor="#C7C7CC"
                    value={paidBy}
                    onChangeText={setPaidBy}
                  />
                </View>
              </View>

              {/* Split Type */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Split</Text>
                <View style={styles.splitOptions}>
                  {SPLIT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.splitOption,
                        splitType === option.value && styles.selectedSplit,
                      ]}
                      onPress={() => setSplitType(option.value)}
                    >
                      <MaterialIcons
                        name={option.icon as any}
                        size={20}
                        color={
                          splitType === option.value ? "#007AFF" : "#8E8E93"
                        }
                      />
                      <Text
                        style={[
                          styles.splitOptionText,
                          splitType === option.value &&
                            styles.selectedSplitText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Description (Optional)</Text>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Add a note about this expense..."
                  placeholderTextColor="#C7C7CC"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Expense</Text>
                <MaterialIcons name="check" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  doneText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#007AFF",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  activeStepText: {
    color: "#fff",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 32,
    textAlign: "center",
  },
  amountContainer: {
    alignItems: "center",
  },
  currencySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  currencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  selectedCurrency: {
    backgroundColor: "#007AFF",
  },
  currencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  selectedCurrencyText: {
    color: "#fff",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: "300",
    color: "#8E8E93",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: "700",
    color: "#000",
    minWidth: 200,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 16,
    borderWidth: 1,
    borderColor: "#D6EDFF",
  },
  previewIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContent: {
    flex: 1,
  },
  previewCategory: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  splitOptions: {
    gap: 12,
  },
  splitOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedSplit: {
    backgroundColor: "#F0F8FF",
    borderColor: "#007AFF",
  },
  splitOptionText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  selectedSplitText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  descriptionInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000",
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34C759",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366F1",
  },
});
