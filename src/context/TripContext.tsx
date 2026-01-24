import React, { createContext, useContext, useEffect, useState } from 'react';

type Todo = { text: string; done: boolean };

type DayItinerary = {
  dayIndex: number;
  date: Date;
  places: string[];
  notes: string[];
  todos: Todo[];
};

export type Expense = {
  id: string;
  amount: string;
  currency: string;
  category: string;
  categoryIcon: string;
  paidBy: string;
  split: string;
  date?: string;
  description?: string;
};

export type NewExpense = Omit<Expense, 'id'>;

type Budget = { total: number; spent: number };
type TripMeta = { tripName: string; tripDates: string };

export type Notification = {
  id: string;
  type: 'chat' | 'notification';
  sender: string;
  title?: string;
  message: string;
  timestamp: string;
};

type TripContextType = {
  tripMeta: TripMeta;
  setTripMeta: React.Dispatch<React.SetStateAction<TripMeta>>;

  budget: Budget;
  setBudget: React.Dispatch<React.SetStateAction<Budget>>;

  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  addExpense: (expense: NewExpense) => void;

  carpools: any[];
  setCarpools: React.Dispatch<React.SetStateAction<any[]>>;

  itinerary: DayItinerary[];
  setItinerary: React.Dispatch<React.SetStateAction<DayItinerary[]>>;

  notes: string[];
  setNotes: React.Dispatch<React.SetStateAction<string[]>>;

  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  addNotification: (n: Omit<Notification, 'id'>) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripMeta, setTripMeta] = useState<TripMeta>({ tripName: '', tripDates: '' });
  const [budget, setBudget] = useState<Budget>({ total: 0, spent: 0 });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [carpools, setCarpools] = useState<any[]>([]);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const spent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
    setBudget(prev => ({ ...prev, spent }));
  }, [expenses]);

  const addExpense = (expense: NewExpense) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  };

  const addNotification = (n: Omit<Notification, 'id'>) => {
    setNotifications(prev => [...prev, { ...n, id: Date.now().toString() }]);
  };

  return (
    <TripContext.Provider
      value={{
        tripMeta,
        setTripMeta,
        budget,
        setBudget,
        expenses,
        setExpenses,
        addExpense,
        carpools,
        setCarpools,
        itinerary,
        setItinerary,
        notes,
        setNotes,
        notifications,
        setNotifications,
        addNotification,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
};
