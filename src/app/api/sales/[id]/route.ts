import { NextRequest } from "next/server";
import { db } from "@/db";
import { sales, saleItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

// GET /api/sales/[id] — get sale by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sale = db.select().from(sales).where(eq(sales.id, id)).get();

    if (!sale) {
      return errorResponse("Transaksi tidak ditemukan", 404);
    }

    const items = db
      .select()
      .from(saleItems)
      .where(eq(saleItems.saleId, id))
      .all();

    return jsonResponse({ ...sale, items });
  } catch (err) {
    return errorResponse("Gagal mengambil data transaksi", 500);
  }
}
