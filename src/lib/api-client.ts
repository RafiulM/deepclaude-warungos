import { User, Product, Sale, Expense, CartItem, PaymentMethod, DailySummary, ExpenseFormItem, ApiResponse } from "./types";
import { signIn, signOut, getSession } from "./auth-client";

const BASE = "";

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, data: null as unknown as T, message: json.message || "Request failed" };
    }
    return json;
  } catch (err) {
    return { success: false, data: null as unknown as T, message: "Network error" };
  }
}

// ====== AUTH ======
export async function login(email: string, password: string): Promise<ApiResponse<User>> {
  const result = await signIn(email, password);
  if (!result.success) {
    return { success: false, data: null as unknown as User, message: result.message };
  }
  return { success: true, data: result.data as User };
}

export async function logout(): Promise<ApiResponse<null>> {
  await signOut();
  return { success: true, data: null };
}

export async function fetchSession(): Promise<ApiResponse<User | null>> {
  const user = await getSession();
  if (user) {
    return { success: true, data: user as User };
  }
  return { success: false, data: null };
}

// ====== PRODUCTS ======
export async function getProducts(): Promise<ApiResponse<Product[]>> {
  return request<Product[]>("/api/products");
}

export async function getLowStockProducts(): Promise<ApiResponse<Product[]>> {
  return request<Product[]>("/api/products?lowStock=true");
}

// ====== EXPENSES ======
export async function createExpense(
  items: ExpenseFormItem[]
): Promise<ApiResponse<Expense[]>> {
  return request<Expense[]>("/api/expenses", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function getTodayExpenses(): Promise<ApiResponse<Expense[]>> {
  return request<Expense[]>("/api/expenses?today=true");
}

// ====== SALES ======
export async function createSale(
  cart: CartItem[],
  paymentMethod: PaymentMethod
): Promise<ApiResponse<Sale>> {
  return request<Sale>("/api/sales", {
    method: "POST",
    body: JSON.stringify({ cart, paymentMethod }),
  });
}

export async function getSales(): Promise<ApiResponse<Sale[]>> {
  return request<Sale[]>("/api/sales");
}

export async function getSale(id: string): Promise<ApiResponse<Sale | null>> {
  return request<Sale>(`/api/sales/${id}`);
}

export async function getTodaySales(): Promise<ApiResponse<Sale[]>> {
  return request<Sale[]>("/api/sales?today=true");
}

// ====== DASHBOARD ======
export async function getDailySummary(): Promise<ApiResponse<DailySummary>> {
  return request<DailySummary>("/api/dashboard");
}
