import { create } from "zustand";
import { Product } from "../types";
import { mockProducts } from "../mock-data";

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  updateStock: (productId: string, delta: number) => void;
  getLowStock: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [...mockProducts],
  setProducts: (products) => set({ products }),
  updateStock: (productId, delta) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, currentStock: Math.max(0, p.currentStock + delta) }
          : p
      ),
    })),
  getLowStock: () => {
    return get().products.filter((p) => p.currentStock <= p.minStock);
  },
}));
