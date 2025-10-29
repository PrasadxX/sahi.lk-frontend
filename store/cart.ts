import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string; // For products with variants
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  itemCount: number;
  total: number;
}

// Helper function to create unique cart item key
const getCartItemKey = (productId: string, variantId?: string) => {
  return variantId ? `${productId}-${variantId}` : productId;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => 
          i.productId === item.productId && i.variantId === item.variantId
        );
        
        const quantityToAdd = item.quantity || 1;
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + quantityToAdd }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: quantityToAdd }] });
        }
        
        // Open cart when item is added
        set({ isOpen: true });
      },
      
      removeItem: (productId, variantId) => {
        set({ 
          items: get().items.filter((i) => 
            !(i.productId === productId && i.variantId === variantId)
          ) 
        });
      },
      
      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId 
              ? { ...i, quantity } 
              : i
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      get total() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
