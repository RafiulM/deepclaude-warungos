// ====== USER ======
export interface User {
  id: string;
  name: string;
  role: "pemilik" | "penjaga";
}

// ====== PRODUCT ======
export type ProductCategory = "makanan" | "minuman" | "sembako" | "rokok" | "lainnya";
export type UnitType = "pcs" | "kg" | "liter" | "bungkus" | "pack" | "botol" | "sachet";
export type StockStatus = "aman" | "menipis" | "habis";

export interface Product {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  salePrice: number;
  purchasePrice: number;
  category: ProductCategory;
  unit: UnitType;
}

// ====== EXPENSE / RESTOCK ======
export interface Expense {
  id: string;
  productId: string;
  productName: string;
  quantityAdded: number;
  totalCost: number;
  createdAt: string;
  userId: string;
  userName: string;
}

export interface ExpenseFormItem {
  productId: string;
  quantityAdded: number;
  totalCost: number;
}

// ====== SALE ======
export type PaymentMethod = "tunai" | "qris" | "transfer";

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  userId: string;
  cashierName: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: SaleItem[];
}

// ====== CART (POS session only) ======
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// ====== DAILY SUMMARY ======
export interface DailySummary {
  totalSales: number;
  totalTransactions: number;
  totalExpenses: number;
  totalRevenue: number;
}

// ====== API RESPONSE ======
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
