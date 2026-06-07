import { create } from "zustand";
import { Sale, CartItem, Product } from "../types";
import { mockSales } from "../mock-data";

interface SaleState {
  sales: Sale[];
  cart: CartItem[];
  setSales: (sales: Sale[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  addSale: (sale: Sale) => void;
}

export const useSaleStore = create<SaleState>((set) => ({
  sales: [...mockSales],
  cart: [],
  setSales: (sales) => set({ sales }),
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((c) => c.productId === product.id);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.productId === product.id
              ? {
                  ...c,
                  quantity: c.quantity + 1,
                  subtotal: (c.quantity + 1) * c.unitPrice,
                }
              : c
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.salePrice,
            subtotal: product.salePrice,
          },
        ],
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.productId !== productId),
    })),
  updateCartQty: (productId, qty) =>
    set((state) => ({
      cart: state.cart
        .map((c) =>
          c.productId === productId
            ? { ...c, quantity: qty, subtotal: qty * c.unitPrice }
            : c
        )
        .filter((c) => c.quantity > 0),
    })),
  clearCart: () => set({ cart: [] }),
  addSale: (sale) =>
    set((state) => ({
      sales: [sale, ...state.sales],
    })),
}));
