import { NextRequest } from "next/server";
import { db } from "@/db";
import { expenses, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { jsonResponse, errorResponse, getCurrentUser, generateId } from "@/lib/api-utils";

// GET /api/expenses — list expenses
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const today = searchParams.get("today");

  try {
    let result = db.select().from(expenses).all();

    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      result = result.filter(
        (e) => new Date(e.createdAt) >= startOfDay
      );
    }

    // Enrich with product name
    const productList = db.select().from(products).all();
    const enriched = result.map((e) => {
      const p = productList.find((pr) => pr.id === e.productId);
      return {
        ...e,
        productName: p?.name ?? "Unknown",
      };
    });

    return jsonResponse(enriched);
  } catch (err) {
    return errorResponse("Gagal mengambil data pengeluaran", 500);
  }
}

// POST /api/expenses — create expenses (supports array of items)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Silakan login terlebih dahulu", 401);

  try {
    const body = await req.json();
    const items: { productId: string; quantityAdded: number; totalCost: number }[] =
      body.items;

    if (!items || items.length === 0) {
      return errorResponse("Minimal satu item diperlukan", 400);
    }

    const created = [];
    for (const item of items) {
      const id = generateId("exp");
      const now = new Date();

      db.insert(expenses)
        .values({
          id,
          productId: item.productId,
          quantityAdded: item.quantityAdded,
          totalCost: item.totalCost,
          userId: user.id,
          createdAt: now,
        })
        .run();

      // Update product stock
      db.update(products)
        .set({
          currentStock: sql`${products.currentStock} + ${item.quantityAdded}`,
          updatedAt: now,
        })
        .where(eq(products.id, item.productId))
        .run();

      const product = db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .get();

      created.push({
        id,
        productId: item.productId,
        quantityAdded: item.quantityAdded,
        totalCost: item.totalCost,
        userId: user.id,
        createdAt: now.toISOString(),
        productName: product?.name ?? "Unknown",
        userName: user.name,
      });
    }

    return jsonResponse(created, 201);
  } catch (err) {
    return errorResponse("Gagal menyimpan pengeluaran", 500);
  }
}
