import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BasketItem {
    productId: string;
    name: string;
    imageUri?: string;
    priceRange?: string;
    quantity: number;
}

interface BasketStore {
    items: BasketItem[];
    addItem: (item: BasketItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearBasket: () => void;
}

export const useBasketStore = create<BasketStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (newItem) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.productId === newItem.productId);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.productId === newItem.productId
                                    ? { ...item, quantity: item.quantity + newItem.quantity }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, newItem] };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId ? { ...item, quantity } : item
                    ),
                })),
            clearBasket: () => set({ items: [] }),
        }),
        {
            name: 'veranda-basket',
        }
    )
);
