import { User, Product, Sale, Expense } from "./types";

// ====== USERS ======
export const mockUsers: User[] = [
  { id: "u1", name: "Pak Budi", role: "pemilik" },
  { id: "u2", name: "Mbak Siti", role: "penjaga" },
  { id: "u3", name: "Mas Anto", role: "penjaga" },
];

// ====== PRODUCTS ======
export const mockProducts: Product[] = [
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
  { id: "p11", name: "Rokok Kretek Djisamsoe", currentStock: 2, minStock: 5, salePrice: 25000, purchasePrice: 22000, category: "rokok", unit: "bungkus" },
  { id: "p12", name: "Rokok Filter Sampoerna", currentStock: 10, minStock: 5, salePrice: 30000, purchasePrice: 27000, category: "rokok", unit: "bungkus" },
  { id: "p13", name: "Kecap Manis Bango", currentStock: 12, minStock: 5, salePrice: 8000, purchasePrice: 6000, category: "sembako", unit: "pcs" },
  { id: "p14", name: "Saus Sambal ABC", currentStock: 0, minStock: 5, salePrice: 7000, purchasePrice: 5500, category: "sembako", unit: "pcs" },
  { id: "p15", name: "Mie Sedap Goreng", currentStock: 35, minStock: 10, salePrice: 3500, purchasePrice: 2800, category: "makanan", unit: "pcs" },
  { id: "p16", name: "Tepung Terigu 1kg", currentStock: 4, minStock: 3, salePrice: 12000, purchasePrice: 10000, category: "sembako", unit: "kg" },
  { id: "p17", name: "Susu Kental Manis", currentStock: 1, minStock: 5, salePrice: 12000, purchasePrice: 10000, category: "minuman", unit: "pcs" },
  { id: "p18", name: "Shampo Sachet", currentStock: 50, minStock: 15, salePrice: 500, purchasePrice: 350, category: "lainnya", unit: "sachet" },
  { id: "p19", name: "Tisu Paseo", currentStock: 8, minStock: 5, salePrice: 6000, purchasePrice: 4800, category: "lainnya", unit: "bungkus" },
  { id: "p20", name: "Baterai AA", currentStock: 0, minStock: 5, salePrice: 8000, purchasePrice: 6000, category: "lainnya", unit: "pcs" },
];

// ====== EXPENSES ======
export const mockExpenses: Expense[] = [
  { id: "e1", productId: "p01", productName: "Indomie Goreng", quantityAdded: 20, totalCost: 56000, createdAt: "2026-06-07T08:00:00", userId: "u2", userName: "Mbak Siti" },
  { id: "e2", productId: "p03", productName: "Telur Ayam 1kg", quantityAdded: 5, totalCost: 125000, createdAt: "2026-06-07T08:15:00", userId: "u2", userName: "Mbak Siti" },
  { id: "e3", productId: "p05", productName: "Kopi Sachet", quantityAdded: 50, totalCost: 75000, createdAt: "2026-06-06T09:00:00", userId: "u3", userName: "Mas Anto" },
  { id: "e4", productId: "p07", productName: "Gula Pasir 1kg", quantityAdded: 3, totalCost: 42000, createdAt: "2026-06-06T10:30:00", userId: "u3", userName: "Mas Anto" },
  { id: "e5", productId: "p11", productName: "Rokok Kretek Djisamsoe", quantityAdded: 5, totalCost: 110000, createdAt: "2026-06-05T07:00:00", userId: "u2", userName: "Mbak Siti" },
  { id: "e6", productId: "p09", productName: "Air Mineral 600ml", quantityAdded: 12, totalCost: 26400, createdAt: "2026-06-05T08:00:00", userId: "u3", userName: "Mas Anto" },
];

// ====== SALES ======
export const mockSales: Sale[] = [
  {
    id: "s1", userId: "u2", cashierName: "Mbak Siti", totalAmount: 41000, paymentMethod: "tunai",
    createdAt: "2026-06-07T10:00:00",
    items: [
      { id: "si1", saleId: "s1", productId: "p01", productName: "Indomie Goreng", quantity: 2, unitPrice: 3500, subtotal: 7000 },
      { id: "si2", saleId: "s1", productId: "p03", productName: "Telur Ayam 1kg", quantity: 1, unitPrice: 28000, subtotal: 28000 },
      { id: "si3", saleId: "s1", productId: "p05", productName: "Kopi Sachet", quantity: 3, unitPrice: 2000, subtotal: 6000 },
    ],
  },
  {
    id: "s2", userId: "u2", cashierName: "Mbak Siti", totalAmount: 79500, paymentMethod: "qris",
    createdAt: "2026-06-07T11:30:00",
    items: [
      { id: "si4", saleId: "s2", productId: "p04", productName: "Beras 5kg", quantity: 1, unitPrice: 65000, subtotal: 65000 },
      { id: "si5", saleId: "s2", productId: "p06", productName: "Teh Botol", quantity: 2, unitPrice: 5000, subtotal: 10000 },
      { id: "si6", saleId: "s2", productId: "p10", productName: "Sabun Mandi Lifebuoy", quantity: 1, unitPrice: 4500, subtotal: 4500 },
    ],
  },
  {
    id: "s3", userId: "u3", cashierName: "Mas Anto", totalAmount: 52000, paymentMethod: "tunai",
    createdAt: "2026-06-07T14:00:00",
    items: [
      { id: "si7", saleId: "s3", productId: "p02", productName: "Indomie Kuah Ayam Bawang", quantity: 3, unitPrice: 3500, subtotal: 10500 },
      { id: "si8", saleId: "s3", productId: "p07", productName: "Gula Pasir 1kg", quantity: 1, unitPrice: 16000, subtotal: 16000 },
      { id: "si9", saleId: "s3", productId: "p08", productName: "Minyak Goreng 1L", quantity: 1, unitPrice: 18000, subtotal: 18000 },
      { id: "si10", saleId: "s3", productId: "p09", productName: "Air Mineral 600ml", quantity: 2, unitPrice: 3000, subtotal: 6000 },
      { id: "si11", saleId: "s3", productId: "p18", productName: "Shampo Sachet", quantity: 3, unitPrice: 500, subtotal: 1500 },
    ],
  },
  {
    id: "s4", userId: "u2", cashierName: "Mbak Siti", totalAmount: 55000, paymentMethod: "tunai",
    createdAt: "2026-06-06T09:15:00",
    items: [
      { id: "si12", saleId: "s4", productId: "p12", productName: "Rokok Filter Sampoerna", quantity: 1, unitPrice: 30000, subtotal: 30000 },
      { id: "si13", saleId: "s4", productId: "p15", productName: "Mie Sedap Goreng", quantity: 5, unitPrice: 3500, subtotal: 17500 },
      { id: "si14", saleId: "s4", productId: "p09", productName: "Air Mineral 600ml", quantity: 2, unitPrice: 3000, subtotal: 6000 },
      { id: "si15", saleId: "s4", productId: "p18", productName: "Shampo Sachet", quantity: 3, unitPrice: 500, subtotal: 1500 },
    ],
  },
  {
    id: "s5", userId: "u3", cashierName: "Mas Anto", totalAmount: 78000, paymentMethod: "transfer",
    createdAt: "2026-06-06T15:00:00",
    items: [
      { id: "si16", saleId: "s5", productId: "p13", productName: "Kecap Manis Bango", quantity: 2, unitPrice: 8000, subtotal: 16000 },
      { id: "si17", saleId: "s5", productId: "p16", productName: "Tepung Terigu 1kg", quantity: 1, unitPrice: 12000, subtotal: 12000 },
      { id: "si18", saleId: "s5", productId: "p08", productName: "Minyak Goreng 1L", quantity: 2, unitPrice: 18000, subtotal: 36000 },
      { id: "si19", saleId: "s5", productId: "p06", productName: "Teh Botol", quantity: 2, unitPrice: 5000, subtotal: 10000 },
      { id: "si20", saleId: "s5", productId: "p19", productName: "Tisu Paseo", quantity: 1, unitPrice: 6000, subtotal: 6000 },
    ],
  },
  {
    id: "s6", userId: "u2", cashierName: "Mbak Siti", totalAmount: 35000, paymentMethod: "tunai",
    createdAt: "2026-06-06T18:30:00",
    items: [
      { id: "si21", saleId: "s6", productId: "p01", productName: "Indomie Goreng", quantity: 5, unitPrice: 3500, subtotal: 17500 },
      { id: "si22", saleId: "s6", productId: "p05", productName: "Kopi Sachet", quantity: 5, unitPrice: 2000, subtotal: 10000 },
      { id: "si23", saleId: "s6", productId: "p09", productName: "Air Mineral 600ml", quantity: 2, unitPrice: 3000, subtotal: 6000 },
      { id: "si24", saleId: "s6", productId: "p18", productName: "Shampo Sachet", quantity: 3, unitPrice: 500, subtotal: 1500 },
    ],
  },
  {
    id: "s7", userId: "u3", cashierName: "Mas Anto", totalAmount: 125000, paymentMethod: "qris",
    createdAt: "2026-06-05T11:00:00",
    items: [
      { id: "si25", saleId: "s7", productId: "p04", productName: "Beras 5kg", quantity: 1, unitPrice: 65000, subtotal: 65000 },
      { id: "si26", saleId: "s7", productId: "p12", productName: "Rokok Filter Sampoerna", quantity: 2, unitPrice: 30000, subtotal: 60000 },
    ],
  },
  {
    id: "s8", userId: "u2", cashierName: "Mbak Siti", totalAmount: 48000, paymentMethod: "tunai",
    createdAt: "2026-06-05T08:00:00",
    items: [
      { id: "si27", saleId: "s8", productId: "p11", productName: "Rokok Kretek Djisamsoe", quantity: 1, unitPrice: 25000, subtotal: 25000 },
      { id: "si28", saleId: "s8", productId: "p07", productName: "Gula Pasir 1kg", quantity: 1, unitPrice: 16000, subtotal: 16000 },
      { id: "si29", saleId: "s8", productId: "p15", productName: "Mie Sedap Goreng", quantity: 2, unitPrice: 3500, subtotal: 7000 },
    ],
  },
  {
    id: "s9", userId: "u3", cashierName: "Mas Anto", totalAmount: 36000, paymentMethod: "tunai",
    createdAt: "2026-06-05T16:00:00",
    items: [
      { id: "si30", saleId: "s9", productId: "p03", productName: "Telur Ayam 1kg", quantity: 1, unitPrice: 28000, subtotal: 28000 },
      { id: "si31", saleId: "s9", productId: "p05", productName: "Kopi Sachet", quantity: 4, unitPrice: 2000, subtotal: 8000 },
    ],
  },
  {
    id: "s10", userId: "u2", cashierName: "Mbak Siti", totalAmount: 107000, paymentMethod: "tunai",
    createdAt: "2026-06-04T13:00:00",
    items: [
      { id: "si32", saleId: "s10", productId: "p03", productName: "Telur Ayam 1kg", quantity: 2, unitPrice: 28000, subtotal: 56000 },
      { id: "si33", saleId: "s10", productId: "p08", productName: "Minyak Goreng 1L", quantity: 1, unitPrice: 18000, subtotal: 18000 },
      { id: "si34", saleId: "s10", productId: "p13", productName: "Kecap Manis Bango", quantity: 2, unitPrice: 8000, subtotal: 16000 },
      { id: "si35", saleId: "s10", productId: "p17", productName: "Susu Kental Manis", quantity: 1, unitPrice: 12000, subtotal: 12000 },
      { id: "si36", saleId: "s10", productId: "p18", productName: "Shampo Sachet", quantity: 10, unitPrice: 500, subtotal: 5000 },
    ],
  },
];
