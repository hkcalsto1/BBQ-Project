import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  priceUnit: string;
  quantity: number;
  weightKg?: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateWeight: (productId: number, weightKg: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity, weightKg: item.weightKg ?? i.weightKg }
              : i
          );
        } else {
          next = [...prev, item];
        }
        localStorage.setItem("cart", JSON.stringify(next));
        return next;
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: number) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        localStorage.setItem("cart", JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) => {
        const next = prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        localStorage.setItem("cart", JSON.stringify(next));
        return next;
      });
    },
    [removeItem]
  );

  const updateWeight = useCallback(
    (productId: number, weightKg: number) => {
      setItems((prev) => {
        const next = prev.map((i) =>
          i.productId === productId ? { ...i, weightKg } : i
        );
        localStorage.setItem("cart", JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cart");
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => {
    const qty = i.weightKg ?? i.quantity;
    return sum + i.price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateWeight,
        clearCart,
        totalItems,
        totalAmount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
