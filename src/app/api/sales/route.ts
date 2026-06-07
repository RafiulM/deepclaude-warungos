import { NextRequest } from "next/server";
import { db } from "@/db";
import { sales, saleItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { jsonResponse, errorResponse, getCurrentUser, generateId } from "@/lib/api-utils";

// GET /api/sales — list sales
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const today = searchParams.get("today");

  try {
    let result = db.select().from(sales).all();

    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      result = result.filter(
        (s) => new Date(s.createdAt) >= startOfDay
      );
    }

    // Enrich with items
    const allItems = db.select().from(saleItems).all();
    const enriched = result.map((s) => ({
      ...s,
      items: allItems.filter((si) => si.saleId === s.id),
    }));

    return jsonResponse(enriched);
  } catch (err) {
    return errorResponse("Gagal mengambil data penjualan", 500);
  }
}

// POST /api/sales — create sale transaction
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Silakan login terlebih dahulu", 401);

  try {
    const body = await req.json();
    const cart: { productId: string; productName: string; quantity: number; unitPrice: number; subtotal: number }[] =
      body.cart;
    const paymentMethod = body.paymentMethod ?? "tunai";

    if (!cart || cart.length === 0) {
      return errorResponse("Keranjang kosong", 400);
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const saleId = generateId("sale");
    const now = new Date();

    // Create sale
    db.insert(sales)
      .values({
        id: saleId,
        userId: user.id,
        totalAmount,
        paymentMethod,
        createdAt: now,
      })
      .run();

    // Create sale items + update stock
    const items = [];
    for (const item of cart) {
      const itemId = generateId("si");

      db.insert(saleItems)
        .values({
          id: itemId,
          saleId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })
        .run();

      // Reduce stock
      db.update(products)
        .set({
          currentStock: sql`MAX(0, ${products.currentStock} - ${item.quantity})`,
          updatedAt: now,
        })
        .where(eq(products.id, item.productId))
        .run();

      items.push({
        id: itemId,
        saleId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      });
    }

    return jsonResponse(
      {
        id: saleId,
        userId: user.id,
        cashierName: user.name,
        totalAmount,
        paymentMethod,
        createdAt: now.toISOString(),
        items,
      },
      201
    );
  } catch (err) {
    return errorResponse("Gagal memproses transaksi", 500);
  }
}
