import { NextRequest } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { jsonResponse, errorResponse, getCurrentUser, generateId } from "@/lib/api-utils";

// GET /api/products — list all products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lowStock = searchParams.get("lowStock");

  try {
    let result;
    if (lowStock === "true") {
      result = db
        .select()
        .from(products)
        .where(sql`${products.currentStock} <= ${products.minStock}`)
        .all();
    } else {
      result = db.select().from(products).all();
    }
    return jsonResponse(result);
  } catch (err) {
    return errorResponse("Gagal mengambil data produk", 500);
  }
}

// POST /api/products — create new product
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Silakan login terlebih dahulu", 401);

  try {
    const body = await req.json();
    const id = generateId("prd");
    const now = new Date();

    db.insert(products)
      .values({
        id,
        name: body.name,
        currentStock: body.currentStock ?? 0,
        minStock: body.minStock ?? 5,
        salePrice: body.salePrice,
        purchasePrice: body.purchasePrice ?? 0,
        category: body.category ?? "lainnya",
        unit: body.unit ?? "pcs",
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const product = db.select().from(products).where(sql`${products.id} = ${id}`).get();

    return jsonResponse(product, 201);
  } catch (err) {
    return errorResponse("Gagal menambah produk", 500);
  }
}
