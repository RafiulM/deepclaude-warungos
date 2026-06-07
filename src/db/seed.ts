import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
const sqlite = new Database("warungos.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // ====== USERS ======
  const users = [
    { id: "u1", name: "Pak Budi", role: "pemilik" as const, email: "budi@warungos.local" },
    { id: "u2", name: "Mbak Siti", role: "penjaga" as const, email: "siti@warungos.local" },
    { id: "u3", name: "Mas Anto", role: "penjaga" as const, email: "anto@warungos.local" },
  ];

  for (const u of users) {
    db.insert(schema.users)
      .values({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
      .run();
  }
  console.log("  ✓ Users seeded");

  // ====== PRODUCTS ======
  const products = [
    { id: "p01", name: "Indomie Goreng", currentStock: 40, minStock: 10, salePrice: 3500, purchasePrice: 2800, category: "makanan", unit: "pcs" },
    { id: "p02", name: "Indomie Kuah Ayam Bawang", currentStock: 5, minStock: 10, salePrice: 3500, purchasePrice: 2800, category: "makanan", unit: "pcs" },
    { id: "p03", name: "Telur Ayam 1kg", currentStock: 8, minStock: 5, salePrice: 28000, purchasePrice: 25000, category: "sembako", unit: "kg" },
    { id: "p04", name: "Beras 5kg", currentStock: 3, minStock: 2, salePrice: 65000, purchasePrice: 58000, category: "sembako", unit: "pack" },
    { id: "p05", name: "Kopi Sachet", currentStock: 100, minStock: 20, salePrice: 2000, purchasePrice: 1500, category: "minuman", unit: "sachet" },
    { id: "p06", name: "Teh Botol", currentStock: 15, minStock: 10, salePrice: 5000, purchasePrice: 3800, category: "minuman", unit: "botol" },
    { id: "p07", name: "Gula Pasir 1kg", currentStock: 5, minStock: 3, salePrice: 16000, purchasePrice: 14000, category: "sembako", unit: "kg" },
    { id: "p08", name: "Minyak Goreng 1L", currentStock: 4, minStock: 3, salePrice: 18000, purchasePrice: 16000, category: "sembako", unit: "liter" },
    { id: "p09", name: "Air Mineral 600ml", currentStock: 24, minStock: 12, salePrice: 3000, purchasePrice: 2200, category: "minuman", unit: "botol" },
    { id: "p10", name: "Sabun Mandi Lifebuoy", currentStock: 6, minStock: 5, salePrice: 4500, purchasePrice: 3500, category: "lainnya", unit: "pcs" },
    { id: "p11", name: "Rokok Kretek Djisamsoe", currentStock: 2, minStock: 5, salePrice: 25000, purchasePrice: 22000, category: "rokok", unit: "bungkus"},
    { id: "p12", name: "Rokok Filter Sampoerna", currentStock: 10, minStock: 5, salePrice: 30000, purchasePrice: 27000, category: "rokok", unit: "bungkus"},
    { id: "p13", name: "Kecap Manis Bango", currentStock: 12, minStock: 5, salePrice: 8000, purchasePrice: 6000, category: "sembako", unit: "pcs" },
    { id: "p14", name: "Saus Sambal ABC", currentStock: 0, minStock: 5, salePrice: 7000, purchasePrice: 5500, category: "sembako", unit: "pcs" },
    { id: "p15", name: "Mie Sedap Goreng", currentStock: 35, minStock: 10, salePrice: 3500, purchasePrice: 2800, category: "makanan", unit: "pcs" },
    { id: "p16", name: "Tepung Terigu 1kg", currentStock: 4, minStock: 3, salePrice: 12000, purchasePrice: 10000, category: "sembako", unit: "kg" },
    { id: "p17", name: "Susu Kental Manis", currentStock: 1, minStock: 5, salePrice: 12000, purchasePrice: 10000, category: "minuman", unit: "pcs" },
    { id: "p18", name: "Shampo Sachet", currentStock: 50, minStock: 15, salePrice: 500, purchasePrice: 350, category: "lainnya", unit: "sachet" },
    { id: "p19", name: "Tisu Paseo", currentStock: 8, minStock: 5, salePrice: 6000, purchasePrice: 4800, category: "lainnya", unit: "bungkus" },
    { id: "p20", name: "Baterai AA", currentStock: 0, minStock: 5, salePrice: 8000, purchasePrice: 6000, category: "lainnya", unit: "pcs" },
  ];

  for (const p of products) {
    db.insert(schema.products)
      .values({
        id: p.id,
        name: p.name,
        currentStock: p.currentStock,
        minStock: p.minStock,
        salePrice: p.salePrice,
        purchasePrice: p.purchasePrice,
        category: p.category as any,
        unit: p.unit as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
      .run();
  }
  console.log("  ✓ Products seeded");

  // ====== EXPENSES ======
  const expenseData = [
    { id: "e1", productId: "p01", quantityAdded: 20, totalCost: 56000, userId: "u2", createdAt: new Date("2026-06-07T08:00:00") },
    { id: "e2", productId: "p03", quantityAdded: 5, totalCost: 125000, userId: "u2", createdAt: new Date("2026-06-07T08:15:00") },
    { id: "e3", productId: "p05", quantityAdded: 50, totalCost: 75000, userId: "u3", createdAt: new Date("2026-06-06T09:00:00") },
    { id: "e4", productId: "p07", quantityAdded: 3, totalCost: 42000, userId: "u3", createdAt: new Date("2026-06-06T10:30:00") },
    { id: "e5", productId: "p11", quantityAdded: 5, totalCost: 110000, userId: "u2", createdAt: new Date("2026-06-05T07:00:00") },
    { id: "e6", productId: "p09", quantityAdded: 12, totalCost: 26400, userId: "u3", createdAt: new Date("2026-06-05T08:00:00") },
  ];

  for (const e of expenseData) {
    db.insert(schema.expenses).values(e).onConflictDoNothing().run();
  }
  console.log("  ✓ Expenses seeded");

  console.log("✅ Seed complete!");
  sqlite.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
