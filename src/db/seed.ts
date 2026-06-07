import Database from "better-sqlite3";
import { hashPassword } from "better-auth/crypto";

const sqlite = new Database("warungos.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

async function seed() {
  console.log("🌱 Seeding database...");

  // ====== CREATE BETTER AUTH TABLES ======
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER DEFAULT 0 NOT NULL,
      image TEXT,
      role TEXT DEFAULT 'penjaga' NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY NOT NULL,
      expiresAt INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY NOT NULL,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt INTEGER,
      refreshTokenExpiresAt INTEGER,
      scope TEXT,
      password TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY NOT NULL,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);
  console.log("  ✓ Auth tables created");

  // ====== USERS (Better Auth compatible) ======
  const users = [
    { id: "u1", name: "Pak Budi", role: "pemilik", email: "budi@warungos.local" },
    { id: "u2", name: "Mbak Siti", role: "penjaga", email: "siti@warungos.local" },
    { id: "u3", name: "Mas Anto", role: "penjaga", email: "anto@warungos.local" },
  ];

  const hashedPassword = await hashPassword("warung123");

  const now = Date.now();

  for (const u of users) {
    // Insert user
    sqlite.prepare(`
      INSERT OR IGNORE INTO user (id, name, email, emailVerified, role, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, ?, ?, ?)
    `).run(u.id, u.name, u.email, u.role, now, now);

    // Insert account with hashed password
    sqlite.prepare(`
      INSERT OR IGNORE INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
      VALUES (?, ?, 'credential', ?, ?, ?, ?)
    `).run(`acc_${u.id}`, u.email, u.id, hashedPassword, now, now);
  }
  console.log("  ✓ Users seeded (3 with passwords: warung123)");

  // ====== PRODUCTS ======
  const productList = [
    { id: "p01", name: "Indomie Goreng", stock: 40, min: 10, sale: 3500, purchase: 2800, cat: "makanan", unit: "pcs" },
    { id: "p02", name: "Indomie Kuah Ayam Bawang", stock: 5, min: 10, sale: 3500, purchase: 2800, cat: "makanan", unit: "pcs" },
    { id: "p03", name: "Telur Ayam 1kg", stock: 8, min: 5, sale: 28000, purchase: 25000, cat: "sembako", unit: "kg" },
    { id: "p04", name: "Beras 5kg", stock: 3, min: 2, sale: 65000, purchase: 58000, cat: "sembako", unit: "pack" },
    { id: "p05", name: "Kopi Sachet", stock: 100, min: 20, sale: 2000, purchase: 1500, cat: "minuman", unit: "sachet" },
    { id: "p06", name: "Teh Botol", stock: 15, min: 10, sale: 5000, purchase: 3800, cat: "minuman", unit: "botol" },
    { id: "p07", name: "Gula Pasir 1kg", stock: 5, min: 3, sale: 16000, purchase: 14000, cat: "sembako", unit: "kg" },
    { id: "p08", name: "Minyak Goreng 1L", stock: 4, min: 3, sale: 18000, purchase: 16000, cat: "sembako", unit: "liter" },
    { id: "p09", name: "Air Mineral 600ml", stock: 24, min: 12, sale: 3000, purchase: 2200, cat: "minuman", unit: "botol" },
    { id: "p10", name: "Sabun Mandi Lifebuoy", stock: 6, min: 5, sale: 4500, purchase: 3500, cat: "lainnya", unit: "pcs" },
    { id: "p11", name: "Rokok Kretek Djisamsoe", stock: 2, min: 5, sale: 25000, purchase: 22000, cat: "rokok", unit: "bungkus" },
    { id: "p12", name: "Rokok Filter Sampoerna", stock: 10, min: 5, sale: 30000, purchase: 27000, cat: "rokok", unit: "bungkus" },
    { id: "p13", name: "Kecap Manis Bango", stock: 12, min: 5, sale: 8000, purchase: 6000, cat: "sembako", unit: "pcs" },
    { id: "p14", name: "Saus Sambal ABC", stock: 0, min: 5, sale: 7000, purchase: 5500, cat: "sembako", unit: "pcs" },
    { id: "p15", name: "Mie Sedap Goreng", stock: 35, min: 10, sale: 3500, purchase: 2800, cat: "makanan", unit: "pcs" },
    { id: "p16", name: "Tepung Terigu 1kg", stock: 4, min: 3, sale: 12000, purchase: 10000, cat: "sembako", unit: "kg" },
    { id: "p17", name: "Susu Kental Manis", stock: 1, min: 5, sale: 12000, purchase: 10000, cat: "minuman", unit: "pcs" },
    { id: "p18", name: "Shampo Sachet", stock: 50, min: 15, sale: 500, purchase: 350, cat: "lainnya", unit: "sachet" },
    { id: "p19", name: "Tisu Paseo", stock: 8, min: 5, sale: 6000, purchase: 4800, cat: "lainnya", unit: "bungkus" },
    { id: "p20", name: "Baterai AA", stock: 0, min: 5, sale: 8000, purchase: 6000, cat: "lainnya", unit: "pcs" },
  ];

  const insertProduct = sqlite.prepare(`
    INSERT OR IGNORE INTO products (id, name, current_stock, min_stock, sale_price, purchase_price, category, unit, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  for (const p of productList) {
    insertProduct.run(p.id, p.name, p.stock, p.min, p.sale, p.purchase, p.cat, p.unit);
  }
  console.log("  ✓ Products seeded (20)");

  // ====== EXPENSES ======
  const expenseData = [
    { id: "e1", pid: "p01", qty: 20, cost: 56000, uid: "u2" },
    { id: "e2", pid: "p03", qty: 5, cost: 125000, uid: "u2" },
    { id: "e3", pid: "p05", qty: 50, cost: 75000, uid: "u3" },
    { id: "e4", pid: "p07", qty: 3, cost: 42000, uid: "u3" },
    { id: "e5", pid: "p11", qty: 5, cost: 110000, uid: "u2" },
    { id: "e6", pid: "p09", qty: 12, cost: 26400, uid: "u3" },
  ];

  const insertExpense = sqlite.prepare(`
    INSERT OR IGNORE INTO expenses (id, product_id, quantity_added, total_cost, user_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Stagger the dates for variety: hours ago → epoch ms
  const hoursAgo = [2, 2, 26, 24, 50, 48];
  expenseData.forEach((e, i) => {
    const ts = Date.now() - hoursAgo[i] * 60 * 60 * 1000;
    insertExpense.run(e.id, e.pid, e.qty, e.cost, e.uid, ts);
  });
  console.log("  ✓ Expenses seeded (6)");

  console.log("✅ Seed complete!");
  sqlite.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
