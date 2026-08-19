'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: string | number;
    name: string;
    price: string;
    image: string;
    category: string;
    quantity: number;
    variationId?: string;
  }

  interface CartContextType {
    items: CartItem[];
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string | number, variationId?: string) => void;
    updateQuantity: (id: string | number, variationId: string | undefined, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }

const CartContext = createContext<CartContextType | null>(null);

// Two cart lines are "the same" only if both id AND variationId match —
// this is what keeps different sizes of the same product as separate lines.
function itemKey(item: { id: string | number; variationId?: string }) {
  return `${item.id}::${item.variationId ?? ''}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => itemKey(i) === itemKey(product));
      if (existing) {
        return prev.map(i => itemKey(i) === itemKey(product) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string | number, variationId?: string) => {
    setItems(prev => prev.filter(i => itemKey(i) !== itemKey({ id, variationId })));
  };

  const updateQuantity = (id: string | number, variationId: string | undefined, quantity: number) => {
    if (quantity <= 0) return removeItem(id, variationId);
    setItems(prev => prev.map(i => itemKey(i) === itemKey({ id, variationId }) ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = parseFloat(i.price.replace('$', ''));
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}