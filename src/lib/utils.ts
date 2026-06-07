import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StockStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function calculateSubtotal(price: number, qty: number): number {
  return price * qty;
}

export function calculateTotal(items: { subtotal: number }[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export function calculateChange(paid: number, total: number): number {
  return Math.max(0, paid - total);
}

export function getStockStatus(current: number, min: number): StockStatus {
  if (current === 0) return "habis";
  if (current <= min) return "menipis";
  return "aman";
}

export function getStockStatusColor(current: number, min: number): string {
  const status = getStockStatus(current, min);
  if (status === "habis") return "text-red-600 bg-red-50";
  if (status === "menipis") return "text-amber-600 bg-amber-50";
  return "text-green-600 bg-green-50";
}

export const CATEGORY_LABELS: Record<string, string> = {
  makanan: "Makanan",
  minuman: "Minuman",
  sembako: "Sembako",
  rokok: "Rokok",
  lainnya: "Lainnya",
};

export const PAYMENT_LABELS: Record<string, string> = {
  tunai: "Tunai",
  qris: "QRIS",
  transfer: "Transfer",
};
