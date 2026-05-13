"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  sku: string;
  price: number;
  currency: "USD";
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "jd-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.slug === item.slug);
      if (!existing) {
        return [...prev, { ...item, quantity }];
      }

      return prev.map((entry) =>
        entry.slug === item.slug
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry,
      );
    });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.slug !== slug);
      }

      return prev.map((item) =>
        item.slug === slug ? { ...item, quantity } : item,
      );
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
