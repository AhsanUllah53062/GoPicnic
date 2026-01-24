import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  shipping: {
    name: string;
    address: string;
    phone: string;
  };
  trackingId: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  orders: Order[];
  addOrder: (order: Order) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('orders').then((data) => {
      if (data) setOrders(JSON.parse(data));
    });
  }, []);

  // Save orders to AsyncStorage
  const saveOrders = async (newOrders: Order[]) => {
    setOrders(newOrders);
    await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
  };

  const addOrder = (order: Order) => {
    const newOrders = [...orders, order];
    saveOrders(newOrders);
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
  setCartItems((prev) => {
    const existing = prev.find((p) => p.id === item.id);
    if (existing) {
      // ✅ If same product, increase its quantity
      return prev.map((p) =>
        p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
      );
    }
    // ✅ If different product, add as new entry
    return [...prev, { ...item, quantity: 1 }];
  });
};


  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        orders,
        addOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
