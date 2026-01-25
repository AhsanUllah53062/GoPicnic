import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export type ExpenseCategory = {
  name: string;
  icon: string;
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: "Flights", icon: "flight" },
  { name: "Lodging", icon: "hotel" },
  { name: "Car Rental", icon: "directions-car" },
  { name: "Transit", icon: "train" },
  { name: "Food", icon: "restaurant" },
  { name: "Drinks", icon: "local-bar" },
  { name: "Sightseeing", icon: "map" },
  { name: "Activities", icon: "sports-soccer" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Gas", icon: "local-gas-station" },
  { name: "Groceries", icon: "shopping-cart" },
  { name: "Entertainment", icon: "movie" },
  { name: "Medical", icon: "local-hospital" },
  { name: "Other", icon: "more-horiz" },
];

export type SplitType = "don't split" | "equal" | "individual";

export type Expense = {
  id?: string;
  tripId: string;
  amount: number;
  currency: string;
  category: string;
  categoryIcon: string;
  paidBy: string; // User ID or name
  splitType: SplitType;
  splitWith?: string[]; // Array of user IDs/names
  description?: string;
  date: Date;
  dayPlanId?: string; // Optional link to specific day
  placeVisitId?: string; // Optional link to specific place
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateExpenseData = Omit<Expense, "id" | "createdAt" | "updatedAt">;

/**
 * Add a new expense
 */
export const addExpense = async (
  expense: CreateExpenseData,
): Promise<string> => {
  try {
    console.log("💰 Adding expense:", expense);

    const expensesRef = collection(db, "trips", expense.tripId, "expenses");

    const data = {
      tripId: expense.tripId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      categoryIcon: expense.categoryIcon,
      paidBy: expense.paidBy,
      splitType: expense.splitType,
      splitWith: expense.splitWith || null,
      description: expense.description || null,
      date: Timestamp.fromDate(expense.date),
      dayPlanId: expense.dayPlanId || null,
      placeVisitId: expense.placeVisitId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(expensesRef, data);
    console.log("✅ Expense added with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error adding expense:", error);
    throw new Error(`Failed to add expense: ${error.message}`);
  }
};

/**
 * Get all expenses for a trip
 */
export const getTripExpenses = async (tripId: string): Promise<Expense[]> => {
  try {
    console.log(`🔍 Fetching expenses for trip ${tripId}`);

    const expensesRef = collection(db, "trips", tripId, "expenses");
    const q = query(expensesRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    const expenses: Expense[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        tripId: data.tripId,
        amount: data.amount,
        currency: data.currency,
        category: data.category,
        categoryIcon: data.categoryIcon,
        paidBy: data.paidBy,
        splitType: data.splitType,
        splitWith: data.splitWith || undefined,
        description: data.description || undefined,
        date: data.date?.toDate() || new Date(),
        dayPlanId: data.dayPlanId || undefined,
        placeVisitId: data.placeVisitId || undefined,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    console.log(`✅ Found ${expenses.length} expenses`);
    return expenses;
  } catch (error: any) {
    console.error("❌ Error fetching expenses:", error);
    throw new Error(`Failed to fetch expenses: ${error.message}`);
  }
};

/**
 * Update an expense
 */
export const updateExpense = async (
  tripId: string,
  expenseId: string,
  updates: Partial<Expense>,
): Promise<void> => {
  try {
    console.log(`📝 Updating expense ${expenseId}`);

    const expenseRef = doc(db, "trips", tripId, "expenses", expenseId);

    const updateData: any = {};

    // Only add defined fields
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.categoryIcon !== undefined)
      updateData.categoryIcon = updates.categoryIcon;
    if (updates.paidBy !== undefined) updateData.paidBy = updates.paidBy;
    if (updates.splitType !== undefined)
      updateData.splitType = updates.splitType;
    if (updates.splitWith !== undefined)
      updateData.splitWith = updates.splitWith;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.date !== undefined)
      updateData.date = Timestamp.fromDate(updates.date);

    updateData.updatedAt = serverTimestamp();

    await updateDoc(expenseRef, updateData);
    console.log("✅ Expense updated");
  } catch (error: any) {
    console.error("❌ Error updating expense:", error);
    throw new Error(`Failed to update expense: ${error.message}`);
  }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (
  tripId: string,
  expenseId: string,
): Promise<void> => {
  try {
    console.log(`🗑️ Deleting expense ${expenseId}`);

    const expenseRef = doc(db, "trips", tripId, "expenses", expenseId);
    await deleteDoc(expenseRef);

    console.log("✅ Expense deleted");
  } catch (error: any) {
    console.error("❌ Error deleting expense:", error);
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
};

/**
 * Calculate total spent amount
 */
export const calculateTotalSpent = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

/**
 * Get expenses by category
 */
export const getExpensesByCategory = (
  expenses: Expense[],
): Record<string, number> => {
  const byCategory: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (!byCategory[expense.category]) {
      byCategory[expense.category] = 0;
    }
    byCategory[expense.category] += expense.amount;
  });

  return byCategory;
};
