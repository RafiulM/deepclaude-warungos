import { NextRequest } from "next/server";
import { db } from "@/db";
import { sales, expenses } from "@/db/schema";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

// GET /api/dashboard — get daily summary
export async function GET(req: NextRequest) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const allSales = db.select().from(sales).all();
    const allExpenses = db.select().from(expenses).all();

    const todaySales = allSales.filter(
      (s) => new Date(s.createdAt) >= startOfDay
    );
    const todayExpenses = allExpenses.filter(
      (e) => new Date(e.createdAt) >= startOfDay
    );

    const totalSales = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = todaySales.length;
    const totalExpenses = todayExpenses.reduce(
      (sum, e) => sum + e.totalCost,
      0
    );
    const totalRevenue = totalSales - totalExpenses;

    return jsonResponse({
      totalSales,
      totalTransactions,
      totalExpenses,
      totalRevenue,
    });
  } catch (err) {
    return errorResponse("Gagal mengambil ringkasan", 500);
  }
}
