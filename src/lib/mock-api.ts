import { User, Product, Sale, Expense, CartItem, PaymentMethod, DailySummary, ApiResponse, ExpenseFormItem } from "./types";
import { mockUsers } from "./mock-data";
import { useAuthStore } from "./stores/auth-store";
import { useProductStore } from "./stores/product-store";
import { useSaleStore } from "./stores/sale-store";
import { useExpenseStore } from "./stores/expense-store";

// Simulate network delay
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// ====== AUTH ======
export async function getUsers(): Promise<ApiResponse<User[]>> {
  await delay(200);
  return { success: true, data: mockUsers };
}

export async function login(userId: string): Promise<ApiResponse<User>> {
  await delay(300);
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return { success: false, data: null as unknown as User, message: "User tidak ditemukan" };
  useAuthStore.getState().login(user);
  return { success: true, data: user };
}

export async function logout(): Promise<ApiResponse<null>> {
  await delay(100);
  useAuthStore.getState().logout();
  return { success: true, data: null };
}

// ====== PRODUCTS ======
export async function getProducts(): Promise<ApiResponse<Product[]>> {
  await delay(300);
  return { success: true, data: useProductStore.getState().products };
}

export async function getLowStockProducts(): Promise<ApiResponse<Product[]>> {
  await delay(200);
  return { success: true, data: useProductStore.getState().getLowStock() };
}

export async function getProduct(id: string): Promise<ApiResponse<Product | null>> {
  await delay(200);
  const product = useProductStore.getState().products.find((p) => p.id === id);
  return { success: true, data: product || null };
}

// ====== EXPENSES ======
export async function createExpense(
  items: ExpenseFormItem[],
  userId: string
): Promise<ApiResponse<Expense[]>> {
  await delay(400);
  const user = useAuthStore.getState().user;
  const products = useProductStore.getState().products;
  const created: Expense[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;

    const expense: Expense = {
      id: generateId("exp"),
      productId: item.productId,
      productName: product.name,
      quantityAdded: item.quantityAdded,
      totalCost: item.totalCost,
      createdAt: new Date().toISOString(),
      userId,
      userName: user?.name || "Unknown",
    };
    created.push(expense);

    // Update stock
    useProductStore.getState().updateStock(item.productId, item.quantityAdded);
    // Add expense record
    useExpenseStore.getState().addExpense(expense);
  }

  return { success: true, data: created };
}

export async function getExpenses(): Promise<ApiResponse<Expense[]>> {
  await delay(300);
  return { success: true, data: useExpenseStore.getState().expenses };
}

export async function getTodayExpenses(): Promise<ApiResponse<Expense[]>> {
  await delay(200);
  const today = new Date().toISOString().slice(0, 10);
  const expenses = useExpenseStore.getState().expenses.filter(
    (e) => e.createdAt.slice(0, 10) === today
  );
  return { success: true, data: expenses };
}

// ====== SALES ======
export async function createSale(
  cart: CartItem[],
  paymentMethod: PaymentMethod,
  userId: string
): Promise<ApiResponse<Sale>> {
  await delay(500);
  if (cart.length === 0) {
    return { success: false, data: null as unknown as Sale, message: "Keranjang kosong" };
  }

  const user = useAuthStore.getState().user;
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const saleId = generateId("sale");

  const items = cart.map((item) => ({
    id: generateId("si"),
    saleId,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
  }));

  const sale: Sale = {
    id: saleId,
    userId,
    cashierName: user?.name || "Unknown",
    totalAmount,
    paymentMethod,
    createdAt: new Date().toISOString(),
    items,
  };

  // Deduct stock
  for (const item of cart) {
    useProductStore.getState().updateStock(item.productId, -item.quantity);
  }

  // Save sale
  useSaleStore.getState().addSale(sale);
  // Clear cart
  useSaleStore.getState().clearCart();

  return { success: true, data: sale };
}

export async function getSales(): Promise<ApiResponse<Sale[]>> {
  await delay(300);
  return { success: true, data: useSaleStore.getState().sales };
}

export async function getSale(id: string): Promise<ApiResponse<Sale | null>> {
  await delay(200);
  const sale = useSaleStore.getState().sales.find((s) => s.id === id);
  return { success: true, data: sale || null };
}

export async function getTodaySales(): Promise<ApiResponse<Sale[]>> {
  await delay(200);
  const today = new Date().toISOString().slice(0, 10);
  const sales = useSaleStore.getState().sales.filter(
    (s) => s.createdAt.slice(0, 10) === today
  );
  return { success: true, data: sales };
}

// ====== DAILY SUMMARY ======
export async function getDailySummary(): Promise<ApiResponse<DailySummary>> {
  await delay(300);
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = useSaleStore.getState().sales.filter(
    (s) => s.createdAt.slice(0, 10) === today
  );
  const todayExpenses = useExpenseStore.getState().expenses.filter(
    (e) => e.createdAt.slice(0, 10) === today
  );

  const totalSales = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTransactions = todaySales.length;
  const totalExpenses = todayExpenses.reduce((sum, e) => sum + e.totalCost, 0);
  const totalRevenue = totalSales - totalExpenses;

  return {
    success: true,
    data: { totalSales, totalTransactions, totalExpenses, totalRevenue },
  };
}
