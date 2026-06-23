import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { SelectedItem, MenuItem, MenuCategory, PriceUnit } from '@/types';
import { menuItems as staticMenuItems } from '@/data/menu';
import { trpc } from '@/providers/trpc';

interface CateringContextType {
  selectedItems: Map<string, number>;
  updateQuantity: (itemId: string, quantity: number) => void;
  selectedItemsList: SelectedItem[];
  total: number;
  itemCount: number;
  menuItems: MenuItem[];
}

const CateringContext = createContext<CateringContextType | null>(null);

export function CateringProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const { data: dbItems } = trpc.menu.list.useQuery();

  const menuItems = useMemo((): MenuItem[] => {
    if (dbItems && dbItems.length > 0) {
      return dbItems.map((item) => ({
        id: String(item.id),
        category: item.category as MenuCategory,
        name: item.name,
        price: item.price,
        priceUnit: item.priceUnit as PriceUnit,
        priceSuffix: item.priceSuffix,
        image: item.image,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
      }));
    }
    return staticMenuItems;
  }, [dbItems]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (quantity <= 0) {
        next.delete(itemId);
      } else {
        next.set(itemId, quantity);
      }
      return next;
    });
  }, []);

  const selectedItemsList = useMemo(() => {
    const result: SelectedItem[] = [];
    selectedItems.forEach((quantity, itemId) => {
      const menuItem = menuItems.find((m) => m.id === itemId);
      if (menuItem && quantity > 0) {
        result.push({ menuItem, quantity });
      }
    });
    return result;
  }, [selectedItems, menuItems]);

  const total = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [selectedItemsList]);

  const itemCount = useMemo(() => {
    return selectedItemsList.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItemsList]);

  return (
    <CateringContext.Provider value={{ selectedItems, updateQuantity, selectedItemsList, total, itemCount, menuItems }}>
      {children}
    </CateringContext.Provider>
  );
}

export function useCatering() {
  const ctx = useContext(CateringContext);
  if (!ctx) throw new Error('useCatering must be used within CateringProvider');
  return ctx;
}
