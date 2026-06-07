import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ====== PRODUCTS ======
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(5),
  salePrice: real("sale_price").notNull(),
  purchasePrice: real("purchase_price").notNull().default(0),
  category: text("category", { enum: ["makanan", "minuman", "sembako", "rokok", "lainnya"] }).notNull().default("lainnya"),
  unit: text("unit", { enum: ["pcs", "kg", "liter", "bungkus", "pack", "botol", "sachet"] }).notNull().default("pcs"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const productsRelations = relations(products, ({ many }) => ({
  expenses: many(expenses),
  saleItems: many(saleItems),
}));

// ====== EXPENSES ======
export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantityAdded: integer("quantity_added").notNull(),
  totalCost: integer("total_cost").notNull(),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const expensesRelations = relations(expenses, ({ one }) => ({
  product: one(products, { fields: [expenses.productId], references: [products.id] }),
}));

// ====== SALES ======
export const sales = sqliteTable("sales", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  totalAmount: real("total_amount").notNull(),
  paymentMethod: text("payment_method", { enum: ["tunai", "qris", "transfer"] }).notNull().default("tunai"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const salesRelations = relations(sales, ({ many }) => ({
  items: many(saleItems),
}));

// ====== SALE ITEMS ======
export const saleItems = sqliteTable("sale_items", {
  id: text("id").primaryKey(),
  saleId: text("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  subtotal: real("subtotal").notNull(),
});

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, { fields: [saleItems.saleId], references: [sales.id] }),
  product: one(products, { fields: [saleItems.productId], references: [products.id] }),
}));
